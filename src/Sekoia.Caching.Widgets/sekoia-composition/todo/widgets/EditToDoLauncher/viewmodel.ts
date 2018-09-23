import evnts = require("compass/events");
import helpers = require("sekoia/helpers");
import CompositableBase = require("sekoia/CompositableBase");
import ko = require("knockout");
import IEditToDoLauncherSettings = require("./IEditToDoLauncherSettings");
import rxx = require("sekoia/rxx");
import rx = require("rx");

class EditToDoLauncher extends CompositableBase<IEditToDoLauncherSettings> {
    public canLaunch = ko.observable(false);
    public launch: () => void = () => { };

    private _widgetSet: string;

    /**
     * Allows the new object to execute custom activation logic.
     */
    public activate(settings: IEditToDoLauncherSettings)
    {
        this._widgetSet = helpers.defaultIfNullOrWhitespace(settings.widgetSet);

        var subscription: any = rxx.createObservable(
                settings.toDoId,
                id => rx.Observable.return(id),
                () =>
                {
                    this.canLaunch(false);
                },
                null,
                null,
                false)
            .subscribe((v: any): void =>
            {
                this.launch = () =>
                {
                    this.activateLauncherWithToDoId(v.input);
                };
                this.canLaunch(true);
            });
        this.addDetachCleanup(subscription);
    }

    private activateLauncherWithToDoId(toDoId: string)
    {
        evnts.build()
            .withId("todo/edit-todo")
            .addPayload("toDoId", toDoId)
            .addPayload("widgetSet", this._widgetSet)
            .publish();
    }
}

export = EditToDoLauncher;