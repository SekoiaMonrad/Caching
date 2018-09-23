import helpers = require("sekoia/helpers");
import CompositableBase = require("sekoia/CompositableBase");
import ko = require("knockout");
import ICompleteToDoLauncherSettings = require("./ICompleteToDoLauncherSettings");
import rxx = require("sekoia/rxx");
import manager = require("todo/ToDoManager");

class CompleteToDoLauncher extends CompositableBase<ICompleteToDoLauncherSettings> {
    public canLaunch = ko.observable(false);
    public launch: () => void = () => { };

    private _widgetSet: string;

    /**
     * Allows the new object to execute custom activation logic.
     */
    public activate(settings: ICompleteToDoLauncherSettings)
    {
        this._widgetSet = helpers.defaultIfNullOrWhitespace(settings.widgetSet);

        var subscription: any = rxx.createObservable(
                settings.toDoId,
                id => manager.getById(id),
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
                    if (!v.isCompleted)
                        this.activateLauncherWithToDoId(v.input);
                };
                this.canLaunch(!v.isCompleted);
            });
        this.addDetachCleanup(subscription);
    }

    private activateLauncherWithToDoId(toDoId: string)
    {
        manager.complete(toDoId)
            .subscribe();
    }
}

export = CompleteToDoLauncher;