import helpers = require("sekoia/helpers");
import CacheEntry = require("./CacheEntry");
import rx = require("rx");
import Dictionary = require("./Dictionary");

class ArrayCache<TKey, TValue> implements Sekoia.Caching.IArrayCache<TKey, TValue>, Sekoia.Caching.ISingleArrayCache<TValue>
{
    private _cache: Dictionary<TKey, IArrayCacheEntry<TKey, TValue>>;

    constructor(
        private _keyComparer: Sekoia.Caching.IComparer<TKey>,
        private _queryRetriever: (key: TKey) => Rx.Observable<TValue>,
        private _idExtractor: (value: TValue) => string,
        private _elementCacher: (e: TValue) => void,
        private _elementCacheRetriever: (id: string) => Rx.Observable<TValue>,
        private _maxAgeInMilliseconds = () => 60 * 1000 /* 60 seconds */)
    {
        helpers.assert.parameterCannotBeNull(_keyComparer, "_keyComparer");
        helpers.assert.parameterCannotBeNull(_queryRetriever, "_queryRetriever");
        helpers.assert.parameterCannotBeNull(_idExtractor, "_idExtractor");
        helpers.assert.parameterCannotBeNull(_elementCacher, "_elementCacher");
        helpers.assert.parameterCannotBeNull(_elementCacheRetriever, "_elementCacheRetriever");

        this._cache = new Dictionary<TKey, IArrayCacheEntry<TKey, TValue>>(this._keyComparer);
    }

    public get(key?: TKey): Rx.Observable<TValue[]>
    {
        if (key === undefined)
            key = <TKey><any>"single";
        helpers.assert.parameterCannotBeNull(key, "key");

        var arrayCacheEntry = this.getArrayCacheEntry(key);
        return arrayCacheEntry.observable;
    }

    public refresh(key?: TKey)
    {
        if (key === undefined)
            key = <TKey><any>"single";
        helpers.assert.parameterCannotBeNull(key, "key");

        let arrayCacheEntry = this.getArrayCacheEntry(key, false);
        if (!arrayCacheEntry)
            return;

        arrayCacheEntry.cacheEntry.refresh();
    }

    public refreshAll()
    {
        this._cache.forEach((k, v) =>
        {
            v.cacheEntry.refresh();
        });
    }

    private getArrayCacheEntry(key: TKey, createIfMissing: boolean = true): IArrayCacheEntry<TKey, TValue>
    {
        let entryObservable = this._cache.get(key);
        if (entryObservable == null && createIfMissing)
        {
            entryObservable = this.createCacheEntry(key);
            this._cache.set(key, entryObservable);
        }

        return entryObservable;
    }

    private createCacheEntry(key: TKey): IArrayCacheEntry<TKey, TValue>
    {
        var cacheEntry = new CacheEntry<TKey, string[]>(
            key,
            () =>
            {
                return this._queryRetriever(key)
                    .doOnNext(v =>
                    {
                        this._elementCacher(v);
                    })
                    .select(v =>
                    {
                        return this._idExtractor(v);
                    })
                    .toArray();
            },
            this._maxAgeInMilliseconds);

        var arrayCacheEntry = {
                cacheEntry: cacheEntry,
                observable: cacheEntry.observable
                    .select(ids =>
                    {
                        return ids.map(id => this._elementCacheRetriever(id));
                    })
                    .selectSwitch(valuesObservables =>
                    {
                        if (valuesObservables.length === 0)
                            return rx.Observable.return<TValue[]>([]);

                        return rx.Observable.combineLatest(
                                valuesObservables,
                                // ReSharper disable Lambda
                                function()
                                    {
                                        return Array.prototype.slice.call(arguments);
                                    }
                                // ReSharper restore Lambda
                            );
                    })
                    .throttle(100)
                    .doOnError(() =>
                    {
                        this._cache.remove(key);
                    })
            };
        return arrayCacheEntry;
    }
}

interface IArrayCacheEntry<TKey, TValue>
{
    cacheEntry: CacheEntry<TKey, string[]>,
    observable: Rx.Observable<TValue[]>;
}

export = ArrayCache;