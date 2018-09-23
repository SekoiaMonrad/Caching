import rx = require("rx");
import evnts = require("compass/events");
import CompositableBase = require("sekoia/CompositableBase");

class EventList extends CompositableBase<any> {
    private _subscription = new rx.SerialDisposable();

    public compositionComplete()
    {
        var sub = rx.Observable.interval(1000)
            .subscribe(i =>
            {
                this.sendWithBody(i);
            });
        this.addDetachCleanup(sub);
    }

    private sendWithBody(i: number)
    {
        evnts.build()
            .withId("some-module/some-time")
            .addPayload("time", i)
            .publish();
    }
}

export = EventList;