import ko = require("knockout");
import helpers = require("sekoia/helpers");
import manager = require("todo/ToDoManager");
import modals = require("compass/modals");
import ValidationProperty = require("sekoia/ValidationProperty");
import RestError = require("sekoia/RestError");

class Dialog {
    public parameters = ValidationProperty.createSet();
    public title = this.parameters.forValueOf<string>()
        .addValidator(title => helpers.isNullOrWhitespace(title) ? "TitleRequired" : null)
        .create();

    public error = ko.observable<string>(null);
    public isLoading = ko.observable(false);
    public isEditDialog = ko.pureComputed(() => this._toDoId !== null);

    private _toDoId: string;

    constructor(toDoId?: string)
    {
        toDoId = helpers.defaultIfNullOrWhitespace(toDoId, null);

        this._toDoId = toDoId;

        if (helpers.isNullOrWhitespace(this._toDoId))
            return;

        this.isLoading(true);
        manager.getById(this._toDoId)
            .first()
            .subscribe(t =>
            {
                this.title.value(t.title);
                this.isLoading(false);
            });
    }

    public cancel()
    {
        modals.closeDialog(this);
    }

    public save()
    {
        if (!this.parameters.allAreValid())
            return;

        this.isLoading(true);

        let commandObservable: Rx.IVoidObservable;
        if (this.isEditDialog())
        {
            commandObservable = manager.update(
                this._toDoId,
                this.title.value());
        }
        else
        {
            commandObservable = manager.create(
                this.title.value());
        }

        commandObservable
            .subscribe(
                (e: any|RestError) =>
                {
                    console.error("Error creating ToDo.", e);

                    try
                    {
                        var error = JSON.parse(e.body).error;
                        this.error(helpers.defaultIfNullOrWhitespace(error, "Unknown"));
                    }
                    catch (_)
                    {
                        this.error("Unknown");
                    }

                    this.isLoading(false);
                },
                () => modals.closeDialog(this));
    }
}

export = Dialog;