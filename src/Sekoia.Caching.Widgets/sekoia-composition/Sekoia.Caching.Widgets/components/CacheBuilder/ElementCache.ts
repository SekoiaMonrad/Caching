import helpers = require("sekoia/helpers");
import CacheEntry = require("./CacheEntry");

class ElementCache<T> implements Sekoia.Caching.IElementCache<T>
{
    private _cache: ICache<T> = { };

    constructor(private _elementRetriever: (id: string) => Rx.Observable<T>, private _maxAgeInMilliseconds = () => 60 * 1000 /* 15 seconds */)
    {
        helpers.assert.parameterCannotBeNull(_elementRetriever, "_elementRetriever");
    }

    public get(id: string): Rx.Observable<T>
    {
        helpers.assert.parameterCannotBeNullOrWhitespace(id, "id");

        const cacheEntry = this.getCacheEntry(id);
        return cacheEntry.observable;
    }

    public refresh(id: string)
    {
        helpers.assert.parameterCannotBeNullOrWhitespace(id, "id");

        const cacheEntry = this.getCacheEntry(id, false);
        if (!cacheEntry)
            return;

        cacheEntry.refresh();
    }

    public refreshAll()
    {
        for (const p in this._cache)
        {
            if (this._cache.hasOwnProperty(p))
                this._cache[p].refresh();
        }
    }

    public remove(id: string)
    {
        helpers.assert.parameterCannotBeNullOrWhitespace(id, "id");

        const cacheEntry = this.getCacheEntry(id, false);
        if (!cacheEntry)
            return;

        cacheEntry.dispose();
        delete this._cache[id];
    }

    public set(id: string, element: T): Rx.Observable<T>
    {
        helpers.assert.parameterCannotBeNullOrWhitespace(id, "id");
        helpers.assert.parameterCannotBeNull(element, "element");

        const cacheEntry = this.getCacheEntry(id);

        cacheEntry.setCachedValue(element);

        return cacheEntry.observable;
    }

    private getCacheEntry(id: string, createIfMissing: boolean = true): CacheEntry<string, T>
    {
        let entryObservable = this._cache[id];
        if (entryObservable == null && createIfMissing)
        {
            entryObservable = this.createCacheEntry(id);
            this._cache[id] = entryObservable;
        }

        return entryObservable;
    }

    private createCacheEntry(id: string): CacheEntry<string, T>
    {
        return new CacheEntry<string, T>(
            id,
            () =>
            {
                return this._elementRetriever(id)
                    .doOnError(() =>
                    {
                        delete this._cache[id];
                    });
            },
            this._maxAgeInMilliseconds);
    }
}

interface ICache<T>
{
    [id: string]: CacheEntry<string, T>;
}

export = ElementCache;