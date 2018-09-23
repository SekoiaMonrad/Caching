import ActivatableBase = require("sekoia/ActivatableBase");
import rx = require("rx");
import ko = require("knockout");
import CacheBuilder = require("sekoia/CacheBuilder");

class Caching extends ActivatableBase
{
    public values1 = ko.observableArray<string[]>();
    public values2 = ko.observableArray<string[]>();
    public refresh: () => void;
    public pushNextValue: () => void;
    public subscribe1: () => void;
    public unsubscribe1: () => void;
    public subscribe2: () => void;
    public unsubscribe2: () => void;

    public getById: (id: string) => any;
    public refreshValue: (id: string) => void;

    public activate()
    {
        var values = new rx.ReplaySubject<string>(3);
        let nextValue = 0;
        this.pushNextValue = () => values.onNext(`${nextValue++}`);
        this.pushNextValue();
        this.pushNextValue();
        this.pushNextValue();

        var cb = CacheBuilder.for<string>()
            .withKeyExtractor(s => this.getKey(s))
            .withElementRetriever(s =>
            {
                console.log(`elementRetriever(${s})`);
                return rx.Observable
                    .return("[" + s + "|" + new Date().getTime() + "]")
                    .doOnNext(v => console.log("value pushed: " + v));
            }).withElementMaxAge(600000).withArrayMaxAge(600000);

        var getByIdCache: { [id: string]: KnockoutObservable<string> } = { };
        this.getById = id =>
        {
            if (id === "unsubscribed")
                return id;

            if (!getByIdCache[id])
                getByIdCache[id] = cb.elementCache.get(this.getKey(id)).toKoObservable();

            return getByIdCache[id];
        };

        this.refreshValue = id =>
        {
            if (id === "unsubscribed")
                return;

            cb.elementCache.refresh(this.getKey(id));
        };

        var query = cb.arrayCaches.singleValue(() =>
        {
            this.pushNextValue();
            console.log(`queryRetriever()`);
            return values.take(3)
                .doOnNext(v => console.log(`queryRetriever: values pushed: ${v}`))
                .doOnCompleted(() => console.log("queryRetriever completed"));
        });

        this.refresh = () => query.refresh();

        var querySubscription1 = new rx.SerialDisposable();
        this.addDetachCleanup(querySubscription1);
        this.subscribe1 = () => querySubscription1.setDisposable(query.get().subscribe(v => this.values1.push(v)));
        this.unsubscribe1 = () =>
        {
            querySubscription1.setDisposable(null);
            this.values1.push(["unsubscribed"]);
        };

        var querySubscription2 = new rx.SerialDisposable();
        this.addDetachCleanup(querySubscription2);
        this.subscribe2 = () => querySubscription2.setDisposable(query.get().subscribe(v => this.values2.push(v)));
        this.unsubscribe2 = () =>
        {
            querySubscription2.setDisposable(null);
            this.values2.push(["unsubscribed"]);
        };
    }

    public getKey(v: string): string
    {
        if (v[0] !== "[")
            return v;

        return v.substring(1).split("|")[0];
    }
}

export = Caching;