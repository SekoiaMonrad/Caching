import helpers = require("sekoia/helpers");
import ElementCache = require("./ElementCache");
import ArrayCache = require("./ArrayCache");

class DefaultCacheBuilder implements Sekoia.Caching.ICacheBuilder
{
    public static Instance: Sekoia.Caching.ICacheBuilder = new DefaultCacheBuilder();

    public for<T>(): Sekoia.Caching.IForTypeCacheBuilder<T>
    {
        return new ForTypeCacheBuilder<T>();
    }
}

class ForTypeCacheBuilder<T> implements Sekoia.Caching.IForTypeCacheBuilder<T>
{
    public withKeyExtractor(idExtractor: (element: T) => string): Sekoia.Caching.IWithIdExtractorCacheBuilder<T>
    {
        helpers.assert.parameterCannotBeNull(idExtractor, "idExtractor");

        return new WithIdExtractorCacheBuilder(idExtractor);
    }
}

class WithIdExtractorCacheBuilder<T> implements Sekoia.Caching.IWithIdExtractorCacheBuilder<T>
{
    constructor(private _idExtractor: (element: T) => string)
    {
    }

    public withElementRetriever(elementRetriever: (id: string) => Rx.Observable<T>): Sekoia.Caching.IWithElementRetrieverCacheBuilder<T>
    {
        helpers.assert.parameterCannotBeNull(elementRetriever, "elementRetriever");

        return new WithElementRetrieverCacheBuilder(
            this._idExtractor,
            elementRetriever);
    }
}

class WithElementRetrieverCacheBuilder<TValue> implements Sekoia.Caching.IWithElementRetrieverCacheBuilder<TValue>
{
    private _elementRetriever: (id: string) => Rx.Observable<TValue>;

    private _getElementCacheWarning: any;
    private _getQueryCacheWarning: boolean;

    public elementCache: Sekoia.Caching.IElementCache<TValue>;
    public arrayCaches: Sekoia.Caching.IArrayCacheBuilder<TValue>;

    constructor(private _idExtractor: (element: TValue) => string, elementRetriever: (id: string) => Rx.Observable<TValue>, 
                private _elementMaxAgeInMilliseconds = () => 60 * 1000, private _arrayMaxAgeInMilliseconds = () => 60 * 1000)
    {
        helpers.assert.parameterCannotBeNull(_arrayMaxAgeInMilliseconds, "_arrayMaxAgeInMilliseconds");
        helpers.assert.parameterCannotBeNull(_elementMaxAgeInMilliseconds, "_elementMaxAgeInMilliseconds");
        helpers.assert.parameterCannotBeNull(_idExtractor, "_idExtractor");
        helpers.assert.parameterCannotBeNull(elementRetriever, "_elementRetriever");

        if (_elementMaxAgeInMilliseconds() < 60 * 1000 || _arrayMaxAgeInMilliseconds() < 60 * 1000)
            throw new Error("Cant create caching with time less than 60 * 1000 milisec");

        this._elementRetriever = elementRetriever;

        const elementCache = new ElementCache<TValue>(this._elementRetriever, this._elementMaxAgeInMilliseconds);
        this.elementCache = elementCache;
        this.arrayCaches = new ArrayCacheBuilder<TValue>(this._idExtractor, elementCache, this._arrayMaxAgeInMilliseconds);
    }

    public withElementMaxAge(maxAgeInMilliseconds: number): Sekoia.Caching.IWithElementRetrieverCacheBuilder<TValue>
    {
        return new WithElementRetrieverCacheBuilder(this._idExtractor, this._elementRetriever, ()=> maxAgeInMilliseconds, this._arrayMaxAgeInMilliseconds);
    }

    public withArrayMaxAge(maxAgeInMilliseconds: number): Sekoia.Caching.IWithElementRetrieverCacheBuilder<TValue>
    {        
        return new WithElementRetrieverCacheBuilder(this._idExtractor, this._elementRetriever, this._elementMaxAgeInMilliseconds, ()=> maxAgeInMilliseconds);
    }

    public getElementCache(): Sekoia.Caching.IElementCache<TValue>
    {
        if (!this._getElementCacheWarning)
        {
            console.warn("use elementCache member instead of getElementCache");
            this._getElementCacheWarning = true;
        }

        return this.elementCache;
    }

    public getQueryCache(queryRetriever: () => Rx.Observable<TValue>): Sekoia.Caching.ISingleArrayCache<TValue>;
    public getQueryCache(queryRetriever: (key: string) => Rx.Observable<TValue>): Sekoia.Caching.IArrayCache<string, TValue>;
    public getQueryCache<TKey>(queryRetriever: (() => Rx.Observable<TValue>) | ((key: string) => Rx.Observable<TValue>)): any
    {
        if (!this._getQueryCacheWarning)
        {
            console.warn("use arrayCaches member instead of getQueryCache");
            this._getQueryCacheWarning = true;
        }

        return this.arrayCaches.multiValue(
            queryRetriever,
            (k1, k2) => k1 === k2);
    }
}

class ArrayCacheBuilder<TValue> implements Sekoia.Caching.IArrayCacheBuilder<TValue>
{
    constructor(private _idExtractor: (element: TValue) => string,
                private _elementCache: ElementCache<TValue>,
                private _arrayMaxAgeInMilliseconds: () => number)
    {
    }

    public singleValue(queryRetriever: () => Rx.Observable<TValue>): Sekoia.Caching.ISingleArrayCache<TValue>
    {
        return new ArrayCache<string, TValue>(
            (k1, k2) => k1 === k2,
            queryRetriever,
            this._idExtractor,
            e => this._elementCache.set(this._idExtractor(e), e),
            e => this._elementCache.get(e),
            this._arrayMaxAgeInMilliseconds);
    }

    public multiValue<TKey>(queryRetriever: (key: TKey) => Rx.Observable<TValue>, keyComparer: Sekoia.Caching.IComparer<TKey>)
    {
        helpers.assert.parameterCannotBeNull(keyComparer, "keyComparer");
        helpers.assert.parameterCannotBeNull(queryRetriever, "queryRetriever");

        return new ArrayCache<TKey, TValue>(
            keyComparer,
            queryRetriever,
            this._idExtractor,
            e => this._elementCache.set(this._idExtractor(e), e),
            e => this._elementCache.get(e),
            this._arrayMaxAgeInMilliseconds);
    }

    public multiValueWithStringKeys(queryRetriever: (key: string) => Rx.Observable<TValue>)
    {
        helpers.assert.parameterCannotBeNull(queryRetriever, "queryRetriever");

        return new ArrayCache<string, TValue>(
            (k1, k2) => k1 === k2,
            queryRetriever,
            this._idExtractor,
            e => this._elementCache.set(this._idExtractor(e), e),
            e => this._elementCache.get(e),
            this._arrayMaxAgeInMilliseconds);
    }
}

var instance = DefaultCacheBuilder.Instance;
export = instance;