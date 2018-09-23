declare module ToDo {
    export interface IToDoManager {
        create(title: string): Rx.IVoidObservable;
        update(id: string, newTitle: string): Rx.IVoidObservable;
        remove(id: string): Rx.IVoidObservable;
        complete(id: string): Rx.IVoidObservable;

        getById(id: string): Rx.Observable<IToDo>;
        getAllCompleted(forceRefresh?: boolean): Rx.Observable<IToDo[]>;
        getAllUncompleted(forceRefresh?: boolean): Rx.Observable<IToDo[]>;
    }

    export interface IToDo {
        id: string;
        title: string;
        isCompleted: boolean;
    }
}