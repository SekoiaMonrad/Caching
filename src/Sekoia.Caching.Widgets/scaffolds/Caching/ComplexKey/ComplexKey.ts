import rx = require("rx");
import ko = require("knockout");
import ActivatableBase = require("sekoia/ActivatableBase");
import CacheBuilder = require("sekoia/CacheBuilder");

class ComplexKey extends ActivatableBase
{
    private _people: IPerson[] = [];
    private _elementCache: Sekoia.Caching.IElementCache<IPerson>;
    private _queryCache: Sekoia.Caching.IArrayCache<{
            name: string,
            age: number
        },
        IPerson>;

    private _queryRefresher = ko.observable(0);

    public people = ko.pureComputed(() => this._people);
    public searchResult: KnockoutObservable<any[]>;
    public nameQuery = ko.observable<string>();
    public ageQuery = ko.observable(100);

    public activate()
    {
        this._people.push({
            id: "1",
            name: "Bob Hund",
            age: 2
        });
        this._people.push({
            id: "2",
            name: "Hans Hest",
            age: 76
        });
        this._people.push({
            id: "3",
            name: "Hans Høst",
            age: 24
        });
        this._people.push({
            id: "4",
            name: "Bente Blomst",
            age: 22
        });
        this._people.push({
            id: "5",
            name: "Bente Blomme",
            age: 12
        });
        this._people.push({
            id: "6",
            name: "Birthe Bur",
            age: 50
        });

        const cb = CacheBuilder.for<IPerson>()
            .withKeyExtractor(p => p.id)
            .withElementRetriever(id =>
            {
                return rx.Observable.timer(1000, 1000)
                    .first()
                    .select(() =>
                    {
                        const person = this._people.filter(p => p.id === id)[0];
                        return person;
                    });
            });

        this._elementCache = cb.elementCache;
        this._queryCache = cb.arrayCaches.multiValue<{
            name: string,
            age: number
        }>(query =>
            {
                return rx.Observable.timer(1000, 1000)
                    .first()
                    .selectSwitch(() =>
                    {
                        const people = this._people.filter(p =>
                        {
                            return p.name.toLocaleLowerCase().indexOf(query.name.toLocaleLowerCase()) !== -1 && p.age < query.age;
                        });
                        return rx.Observable.fromArray(people);
                    });
            },
            (k1, k2) =>
            {
                return k1.name === k2.name && k1.age === k2.age;
            });

        this.searchResult = ko.pureComputed(() =>
            {
                return this.getQuery();
            })
            .toObservable()
            .selectSwitch(q =>
            {
                return this._queryCache.get(q);
            })
            .doOnNext(r => console.log("search result updated: " + r.map(p => "{ " + p.id + ", " + p.name + ", " + p.age + " }").join(", ")))
            .toKoObservable(e =>
                {
                    console.error("onError", e);
                },
                () =>
                {
                    console.log("onCompleted");
                });

        this.addDetachCleanup(this.searchResult.subscribe(r => console.log("ko search result updated: " + r.map(p => "{ " + p.id + ", " + p.name + ", " + p.age + " }").join(", "))));
    }

    public refreshQuery()
    {
        this._queryCache.refresh(this.getQuery());
    }

    public refreshElement(id: string)
    {
        this._elementCache.refresh(id);
    }

    private getQuery()
    {
        return {
            name: this.nameQuery(),
            age: this.ageQuery()
        };
    }
}

interface IPerson
{
    id: string;
    name: string;
    age: number;
}

export = ComplexKey;