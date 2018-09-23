import ko = require("knockout");
import manager = require("todo/ToDoManager");
import rxx = require("sekoia/rxx");
import helpers = require("sekoia/helpers");
import CompositableBase = require("sekoia/CompositableBase");
import RestError = require("sekoia/RestError");
import IToDoInfoSettings = require("./IToDoInfoSettings");

class ToDoInfo extends CompositableBase<IToDoInfoSettings> {
    public isLoading = ko.observable(true);
    public item = ko.observable<ToDo.IToDo>();
    public error = ko.observable<any>();
    public isUnknown = ko.observable<boolean>();

    public activate(settings: IToDoInfoSettings)
    {
        helpers.assert.parameterCannotBeNull(settings, "settings");

        if (helpers.isNull(settings.toDoId))
            throw new Error("Settings must contain non-null property toDoId.");

        this.isLoading = settings.isLoading || this.isLoading;
        this.isLoading(true);

        let subscription = rxx.createObservable(
                settings.toDoId,
                sti => manager.getById(sti),
                this.isLoading)
            .distinctUntilChanged(v => this.getDistinctKey(v.output))
            .subscribe(st =>
                {
                    this.item(st.output);
                    this.isLoading(false);
                },
                (e: any|RestError) =>
                {
                    this.item({
                        id: ko.unwrap(settings.toDoId),
                        title: null,
                        isCompleted: false
                    });
                    this.isLoading(false);

                    if (e instanceof RestError && e.statusCode === 404)
                        this.isUnknown(true);
                    else
                        this.error(e);
                },
                () => { this.isLoading(false); });
        this.addDetachCleanup(subscription);
    }

    private getDistinctKey(sti: ToDo.IToDo)
    {
        return sti.id
            + "|" + sti.title
            + "|" + sti.isCompleted;
    }
}

export = ToDoInfo;