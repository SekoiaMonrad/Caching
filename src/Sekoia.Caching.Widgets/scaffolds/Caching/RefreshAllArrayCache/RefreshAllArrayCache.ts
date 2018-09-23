import ActivatableBase = require("sekoia/ActivatableBase");
import cacheBuilder = require("sekoia/CacheBuilder");
import rx = require("rx");

class RefreshAllArrayCache extends ActivatableBase
{
    private _arrayCache: Sekoia.Caching.IArrayCache<string, string>;

    public values1: KnockoutObservable<string[]>;
    public values2: KnockoutObservable<string[]>;
    public values3: KnockoutObservable<string[]>;
    public values4: KnockoutObservable<string[]>;

    constructor()
    {
        super();

        const cb = cacheBuilder.for<string>()
            .withKeyExtractor(s => s)
            .withElementRetriever(s =>
            {
                return rx.Observable.return(Math.random().toString());
            });

        this._arrayCache = cb.arrayCaches.multiValueWithStringKeys(() =>
        {
            return rx.Observable.fromArray([
                Math.random().toString(),
                Math.random().toString(),
                Math.random().toString(),
                Math.random().toString(),
                Math.random().toString()
            ]);
        });

        this.values1 = this._arrayCache.get("values1").toKoObservable();
        this.values2 = this._arrayCache.get("values2").toKoObservable();
        this.values3 = this._arrayCache.get("values3").toKoObservable();
        this.values4 = this._arrayCache.get("values4").toKoObservable();
    }

    public refreshAll()
    {
        this._arrayCache.refreshAll();
    }
}

export = RefreshAllArrayCache;