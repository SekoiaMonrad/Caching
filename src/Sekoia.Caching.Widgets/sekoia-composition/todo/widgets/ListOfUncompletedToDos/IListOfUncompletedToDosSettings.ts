interface IListOfUncompletedToDosSettings {
    orderBy: ((u1: ToDo.IToDo, u2: ToDo.IToDo) => number)|string;
    isLoading: KnockoutObservable<boolean>;
    refresh: Rx.Observable<any>;
}

export = IListOfUncompletedToDosSettings;