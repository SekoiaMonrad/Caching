import helpers = require("sekoia/helpers");
import CompositableBase = require("sekoia/CompositableBase");
import ko = require("knockout");
import evnts = require("compass/events");
import ICreateToDoLauncherSettings = require("./ICreateToDoLauncherSettings");

class CreateToDoLauncher extends CompositableBase<ICreateToDoLauncherSettings> {
    public canLaunch = ko.observable(true);

    private _widgetSet: string;

    public launch()
    {
        evnts.build()
            .withId("todo/create-todo")
            .addPayload("widgetSet", this._widgetSet)
            .publish();
    }

    public activate(settings: ICreateToDoLauncherSettings)
    {
        this._widgetSet = helpers.defaultIfNullOrWhitespace(settings.widgetSet);
    }
}

export = CreateToDoLauncher;