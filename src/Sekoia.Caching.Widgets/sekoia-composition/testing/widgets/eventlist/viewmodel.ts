import rx = require("rx");
import evnts = require("compass/events");
import ko = require("knockout");
import CompositableBase = require("sekoia/CompositableBase");

class EventList extends CompositableBase<any> {
    public items = ko.observableArray<Compass.IEvent>();

    private _subscription = new rx.SerialDisposable();

    public activate()
    {
        var subscription = evnts.get()
            .subscribe(e => this.items.unshift(e));
        this.addDetachCleanup(subscription);
    }

    public getKeyValues(obj: any): { key: string; value: any }[]
    {
        var kvps = new Array<{ key: string; value: any }>();

        for (var member in obj)
        {
            if (!obj.hasOwnProperty(member))
                continue;

            kvps.push({
                key: member,
                value: obj[member]
            });
        }

        return kvps;
    }
}

export = EventList;