import ActivatableBase = require("sekoia/ActivatableBase");
import ko = require("knockout");
import rx = require("rx");
import CacheBuilder = require("sekoia/CacheBuilder");

class TestCacheEntryNotFetchingOnSubscribeIfNotTimedOut extends ActivatableBase
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
        var personObservable = personCache.get("bob")
            .delay(10); // delaying to ensure subscribe returns before first onNext call

        this.log.push("calling personSubscription1 = personObservable.subscribe");
        var personSubscription1 = personObservable.subscribe(p =>
        {
            this.log.push("inside personSubscription1: " + JSON.stringify(p));

            this.log.push("calling personSubscription2 = personObservable.subscribe");
            var personSubscription2 = personObservable.subscribe(p =>
            {
                this.log.push("inside personSubscription2: " + JSON.stringify(p));

                this.log.push("at this point (1) and (2) should have appeared once each");

                this.log.push("disposing both subscriptions");
                personSubscription1.dispose();
                personSubscription2.dispose();


                this.log.push("calling personSubscription1 = personObservable.subscribe");
                personSubscription1 = personObservable.subscribe(p =>
                {
                    this.log.push("inside personSubscription1: " + JSON.stringify(p));
                    this.log.push("disposing personSubscription1");
                    personSubscription1.dispose();

                    this.log.push("calling personSubscription2 = personObservable.subscribe");
                    personSubscription2 = personObservable.subscribe(p =>
                    {
                        this.log.push("inside personSubscription2: " + JSON.stringify(p));

                        this.log.push("disposing personSubscription2");
                        personSubscription2.dispose();


                        this.log.push("at this point (1) and (2) should still have appeared once each");
                    });
                });
            });
        });
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

export = TestCacheEntryNotFetchingOnSubscribeIfNotTimedOut;