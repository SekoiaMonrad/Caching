import helpers = require("sekoia/helpers");
import DialogBase = require("sekoia/DialogBase");
import Dialog = require("./Dialog");
import evnts = require("compass/events");
import modals = require("compass/modals");
import ICreateUpdateToDoDialogSettings = require("./ICreateUpdateToDoDialogSettings");

class CreateUpdateToDoDialog extends DialogBase<ICreateUpdateToDoDialogSettings> {
    private _widgetSet: string;

    public activate(settings: ICreateUpdateToDoDialogSettings)
    {
        super.prepareDialogViewModel(Dialog, settings);

        this._widgetSet = helpers.defaultIfNullOrWhitespace(settings.widgetSet);

        var subscription = evnts.get("todo/create-todo")
            .where(e => helpers.sensibleEquals(e.payload.widgetSet, settings.widgetSet))
            .subscribe(e => modals.showDialog(new Dialog()));
        this.addDetachCleanup(subscription);

        subscription = evnts.get("todo/edit-todo")
            .where(e => helpers.sensibleEquals(e.payload.widgetSet, settings.widgetSet))
            .subscribe(e => modals.showDialog(new Dialog(e.payload.toDoId)));
        this.addDetachCleanup(subscription);
    }
}

export = CreateUpdateToDoDialog;