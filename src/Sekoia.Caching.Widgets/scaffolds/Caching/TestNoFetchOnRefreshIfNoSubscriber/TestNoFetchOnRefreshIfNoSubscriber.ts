import ActivatableBase = require("sekoia/ActivatableBase");
import ko = require("knockout");
import rx = require("rx");
import CacheBuilder = require("sekoia/CacheBuilder");

class TestNoFetchOnRefreshIfNoSubscriber extends ActivatableBase
{
    public log = ko.observableArray<string>();

    private _callsToGetPerson = 0;

    public activate()
    {
        this.log.push("starting");

        const cb = CacheBuilder.for<Person>()
            .withKeyExtractor(t => t.id)
            .withElementRetriever(id => this.getPerson(id));

        const personCache = cb.elementCache;

        this.log.push('calling personCache.get("bob")');
        const personObservable = personCache.get("bob");

        const personSubscription1 = new rx.SerialDisposable();
        personSubscription1.setDisposable(personObservable.subscribe(p =>
        {
            this.log.push("inside personSubscription1: " + JSON.stringify(p));

            personSubscription1.dispose();

            personCache.refresh("bob");

            rx.Observable.interval(1000)
                .first()
                .subscribe(() =>
                {
                    this.log.push("at this point (1) and (2) should still have appeared once each");
                });
        }));
    }

    private getPerson(id: string): Rx.Observable<Person>
    {
        this._callsToGetPerson++;
        const callsToGetPerson = this._callsToGetPerson;

        this.log.push("(1) getPerson(" + id + ")#" + callsToGetPerson + ": method entry");
        const person = new Person();
        person.id = id;
        person.name = id + " " + callsToGetPerson;

        return rx.Observable.timer(500)
            .first()
            .select(() =>
            {
                this.log.push("(2) getPerson(" + id + ")#" + callsToGetPerson + ": returning person from observable");
                return person;
            });
    }
}

class Person
{
    public id: string;
    public name: string;
}

export = TestNoFetchOnRefreshIfNoSubscriber;