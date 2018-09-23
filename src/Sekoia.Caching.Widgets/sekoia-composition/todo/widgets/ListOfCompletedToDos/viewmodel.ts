import helpers = require("sekoia/helpers");
import ko = require("knockout");
import CompositableBase = require("sekoia/CompositableBase");
import IListOfCompletedToDosSettings = require("./IListOfCompletedToDosSettings");
import rx = require("rx");
import manager = require("todo/ToDoManager");

class ListOfCompletedToDos extends CompositableBase<IListOfCompletedToDosSettings> {
    public items = ko.observableArray<string>();
    public isLoading = ko.observable(true);

    private _orderBy: (u1: ToDo.IToDo, u2: ToDo.IToDo) => number;
    private _listSubscription = new rx.SerialDisposable();

    public activate(settings: IListOfCompletedToDosSettings)
    {
        helpers.assert.parameterCannotBeNull(settings, "settings");

        this.isLoading = settings.isLoading || this.isLoading;
        this._orderBy = this.getOrderByOption(settings);

        this.addDetachCleanup(this._listSubscription);

        if (settings.refresh)
            this.addDetachCleanup(settings.refresh.subscribe(() => this.refetch(true)));

        this.refetch();
    }

    private refetch(forceRefresh: boolean = false)
    {
        this.isLoading(true);

        let subscription = manager.getAllCompleted(forceRefresh)
            .select(v => v.sort(this._orderBy).map(toDo => toDo.id))
            .distinctUntilChanged(v => this.getDistinctKey(v))
            .subscribe(items =>
            {
                this.items(items);
                this.isLoading(false);
            });
        this._listSubscription.setDisposable(subscription);
    }

    private getOrderByOption(settings: IListOfCompletedToDosSettings): (u1: ToDo.IToDo, u2: ToDo.IToDo) => number
    {
        let orderBy: (u1: ToDo.IToDo, u2: ToDo.IToDo) => number;
        if (settings.orderBy && typeof settings.orderBy === "function")
            orderBy = <(u1: ToDo.IToDo, u2: ToDo.IToDo) => number>(settings.orderBy);
        else if (settings.orderBy)
        {
            var orderByProperty = settings.orderBy.toString();
            orderBy = (todo1, todo2) => (todo1[orderByProperty] + "").localeCompare(todo2[orderByProperty]);
        }
        else
            orderBy = (todo1, todo2) => (todo1.title + "").localeCompare(todo2.title);

        return orderBy;
    }

    private getDistinctKey(toDoIds: string[])
    {
        return toDoIds.join("|");
    }
}

export = ListOfCompletedToDos;