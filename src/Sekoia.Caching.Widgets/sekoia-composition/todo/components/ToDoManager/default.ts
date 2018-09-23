import CacheBuilder = require("sekoia/CacheBuilder");
import rest = require("sekoia/rest");
import IToDo = ToDo.IToDo;

class DefaultToDoManager implements ToDo.IToDoManager
{
    public static Instance: ToDo.IToDoManager = new DefaultToDoManager();

    private _todoCache: Sekoia.Caching.IElementCache<ToDo.IToDo>;
    private _completedTodosCache: Sekoia.Caching.ISingleArrayCache<ToDo.IToDo>;
    private _uncompletedTodosCache: Sekoia.Caching.ISingleArrayCache<ToDo.IToDo>;

    constructor()
    {
        const cacheBuilder = CacheBuilder.for<IToDo>()
            .withKeyExtractor(e => e.id)
            .withElementRetriever(id => this.getByIdFromServer(id));
        this._todoCache = cacheBuilder.elementCache;
        this._completedTodosCache = cacheBuilder.arrayCaches.singleValue(() => this.getByQueryFromServer(Query.Completed));
        this._uncompletedTodosCache = cacheBuilder.arrayCaches.singleValue(() => this.getByQueryFromServer(Query.Uncompleted));
    }

    public create(title: string): Rx.IVoidObservable
    {
        const observable = rest.post("/api/todos")
            .withBody({
                title: title
            })
            .toObservable<any>()
            .doOnFinished(() =>
            {
                this._uncompletedTodosCache.refresh();
            });
        return observable.toVoidObservable();
    }

    public update(id: string, newTitle: string): Rx.IVoidObservable
    {
        const observable = rest.put(`/api/todos/${id}`)
            .withBody({
                newTitle: newTitle
            })
            .toObservable<any>()
            .doOnFinished(() =>
            {
                this._todoCache.refresh(id);
            });
        return observable.toVoidObservable();
    }

    public remove(id: string): Rx.IVoidObservable
    {
        const observable = rest.remove(`/api/todos/${id}`)
            .toObservable<any>()
            .doOnFinished(() =>
            {
                this._completedTodosCache.refresh();
                this._uncompletedTodosCache.refresh();
                this._todoCache.remove(id);
            });
        return observable.toVoidObservable();
    }

    public complete(id: string): Rx.IVoidObservable
    {
        const observable = rest.put(`/api/todos/${id}/complete`)
            .toObservable<any>()
            .doOnFinished(() =>
            {
                this._completedTodosCache.refresh();
                this._uncompletedTodosCache.refresh();
            });
        return observable.toVoidObservable();
    }

    public getById(id: string): Rx.Observable<ToDo.IToDo>
    {
        return this._todoCache.get(id);
    }

    public getAllCompleted(forceRefresh: boolean = false): Rx.Observable<ToDo.IToDo[]>
    {
        if (forceRefresh)
            this._completedTodosCache.refresh();

        return this._completedTodosCache.get();
    }

    public getAllUncompleted(forceRefresh: boolean = false): Rx.Observable<ToDo.IToDo[]>
    {
        if (forceRefresh)
            this._uncompletedTodosCache.refresh();

        return this._uncompletedTodosCache.get();
    }

    private getByIdFromServer(id: string): Rx.Observable<IToDo>
    {
        return rest.get(`/api/todos/${id}`)
            .toObservable<IToDoEntity>()
            .select(e => this.fromEntity(e));
    }

    private getByQueryFromServer(query: Query): Rx.Observable<IToDo>
    {
        let requestBuilder: Sekoia.IRequestBuilder;

        switch (query)
        {
            case Query.Completed:
                requestBuilder = rest.get(`/api/todos/completed`);
                break;
            case Query.Uncompleted:
                requestBuilder = rest.get(`/api/todos/uncompleted`);
                break;
            default:
                throw new Error(`Unknown query: ${query}.`);
        }

        return requestBuilder.toObservable<IToDoEntity>()
            .select(e => this.fromEntity(e));
    }

    private fromEntity(entity: IToDoEntity): IToDo
    {
        return entity;
    }
}

interface IToDoEntity
{
    id: string;
    title: string;
    isCompleted: boolean;
}

enum Query
{
    Completed,
    Uncompleted
}

var instance = DefaultToDoManager.Instance;
export = instance;