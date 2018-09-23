import ActivatableBase = require("sekoia/ActivatableBase");
import cacheBuilder = require("sekoia/CacheBuilder");
import rx = require("rx");

class RefreshAllElementCache extends ActivatableBase
{
    private _elementCache: Sekoia.Caching.IElementCache<string>;

    public values1: KnockoutObservable<string>;
    public values2: KnockoutObservable<string>;
    public values3: KnockoutObservable<string>;
    public values4: KnockoutObservable<string>;

    constructor()
    {
        super();

        const cb = cacheBuilder.for<string>()
            .withKeyExtractor(s => s)
            .withElementRetriever(s =>
            {
                return rx.Observable.return(Math.random().toString());
            });

        this._elementCache = cb.elementCache;

        this.values1 = this._elementCache.get("values1").toKoObservable();
        this.values2 = this._elementCache.get("values2").toKoObservable();
        this.values3 = this._elementCache.get("values3").toKoObservable();
        this.values4 = this._elementCache.get("values4").toKoObservable();
    }

    public refreshAll()
    {
        this._elementCache.refreshAll();
    }
}

export = RefreshAllElementCache;