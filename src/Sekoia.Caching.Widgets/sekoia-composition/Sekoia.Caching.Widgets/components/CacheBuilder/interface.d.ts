declare module Sekoia.Caching
{
    export interface ICacheBuilder
    {
        /**
         * Specifies the type of objects to cache.
         */
        for<TValue>(): IForTypeCacheBuilder<TValue>;
    }

    export interface IForTypeCacheBuilder<TValue>
    {
        /**
         * Specifies provides the function to use to go from element to id for that element. This is used both to determine ids for individual elements as well as elements in lists.
         */
        withKeyExtractor(idExtractor: (element: TValue) => string): IWithIdExtractorCacheBuilder<TValue>;
    }

    export interface IWithIdExtractorCacheBuilder<TValue>
    {
        /**
         * Specifies the function to be used to retrieve a single element from the server. This should return an observable with a single element with the specified id.
         * The observable should complete (i.e. call onCompleted) after a single element.
         */
        withElementRetriever(elementRetriever: (id: string) => Rx.Observable<TValue>): IWithElementRetrieverCacheBuilder<TValue>;
    }

    export interface IWithElementRetrieverCacheBuilder<TValue>
    {
        withElementMaxAge(maxAgeInMilliseconds: number) : IWithElementRetrieverCacheBuilder<TValue>;

        withArrayMaxAge(maxAgeInMilliseconds: number) : IWithElementRetrieverCacheBuilder<TValue>;

        /**
         * Gets the element cache.
         */
        elementCache: IElementCache<TValue>;

        /**
         * Builders for array caches.
         */
        arrayCaches: IArrayCacheBuilder<TValue>;
    }

    export interface IArrayCacheBuilder<TValue>
    {
        /**
         * Creates an array cache with a single key/value pair (the key is implicit).
         */
        singleValue(queryRetriever: () => Rx.Observable<TValue>): ISingleArrayCache<TValue>;

        /**
         * Creates an array cache with multiple key/values pairs. 
         */
        multiValue<TKey>(queryRetriever: (key: TKey) => Rx.Observable<TValue>, keyComparer: IComparer<TKey>): IArrayCache<TKey, TValue>;

        /**
         * Creates an array cache with multiple key/values pairs where the key is a string and key comparison is the === operator. 
         */
        multiValueWithStringKeys(queryRetriever: (key: string) => Rx.Observable<TValue>): IArrayCache<string, TValue>;
    }

    export interface IElementCache<T>
    {
        get(id: string): Rx.Observable<T>;
        refresh(id: string): void;
        refreshAll(): void;
        remove(id: string): void;
    }

    export interface IArrayCache<TKey, TValue>
    {
        get(key: TKey): Rx.Observable<TValue[]>;
        refresh(key: TKey): void;
        refreshAll(): void;
    }

    export interface ISingleArrayCache<T>
    {
        get(): Rx.Observable<T[]>;
        refresh(): void;
    }

    export interface IComparer<T>
    {
        (v1: T, v2: T): boolean;
    }
}