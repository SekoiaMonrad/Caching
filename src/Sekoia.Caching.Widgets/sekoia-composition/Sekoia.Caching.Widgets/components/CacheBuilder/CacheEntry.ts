import rx = require("rx");
import helpers = require("sekoia/helpers");
import moment = require("moment");

class CacheEntry<TKey, TValue> implements rx.IDisposable
{
    private _isRefreshing: boolean;
    private _observable: Rx.Observable<TValue>;
    private _refreshFromElementRetrieverObserver: Rx.IObserver<any>;
    private _externalElementUpdateObserver: Rx.IObserver<ITimedValue<TValue>>;
    private _baseSubscription = new rx.SerialDisposable();

    public get id(): TKey
    {
        return this._id;
    }

    public get observable(): Rx.Observable<TValue>
    {
        return this._observable;
    }

    constructor(private _id: TKey,
                elementRetriever: () => Rx.Observable<TValue>,
                private _maxAgeInMilliseconds: () => number)
    {
        helpers.assert.parameterCannotBeNull(_id, "_id");
        helpers.assert.parameterCannotBeNull(elementRetriever, "elementRetriever");
        helpers.assert.parameterCannotBeNull(_maxAgeInMilliseconds, "_maxAgeInMilliseconds");

        // Used to indicate that an update from the retriever is necessary
        var refreshFromElementRetrieverSubject = new rx.ReplaySubject<any>(1);

        // Used to inject a new value from an external source (i.e. query cache)
        var externalElementUpdateObservable = new rx.BehaviorSubject<ITimedValue<TValue>>({
                value: null,
                cacheTime: moment({
                        year: 1,
                        month: 1,
                        day: 1
                    })
            });

        this._refreshFromElementRetrieverObserver = refreshFromElementRetrieverSubject;
        this._externalElementUpdateObserver = externalElementUpdateObservable;

        this._observable = this.createObservable(
            refreshFromElementRetrieverSubject,
            elementRetriever,
            externalElementUpdateObservable);
    }

    public refresh()
    {
        this._isRefreshing = true;
        this._externalElementUpdateObserver.onNext(null);
        this._refreshFromElementRetrieverObserver.onNext(1);
    }

    public dispose()
    {
        this._refreshFromElementRetrieverObserver.onCompleted();
        this._externalElementUpdateObserver.onCompleted();
        this._baseSubscription.dispose();
    }

    public setCachedValue(value: TValue)
    {
        this._isRefreshing = true;
        this._externalElementUpdateObserver
            .onNext({
                    value: value,
                    cacheTime: moment()
                });
    }

    /**
     * Creates an Rx observable for the this instance.
     * @param refreshFromElementRetrieverObservable An observable that emits an event each time the element should be fetched from the retriever.
     * @param elementRetriever The retriever to use when fetching an element.
     * @param externalElementUpdateObservable An observable that emits an event each time the element is updated externally.
     * @returns {} An observable that remains up to date when timing out and responds to external updates.
     */
    private createObservable(refreshFromElementRetrieverObservable: Rx.Observable<any>,
                             elementRetriever: () => Rx.Observable<TValue>,
                             externalElementUpdateObservable: Rx.BehaviorSubject<ITimedValue<TValue>>): Rx.Observable<TValue>
    {
        let externalSubscribers = 0;

        // Creates an observable that retrieves an element and emits it each time the
        // refreshFromElementRetrieverObservable emits an event, regardless of value.
        let retrieveElementOnRefreshObservable = refreshFromElementRetrieverObservable
            .selectSwitch(() =>
            {
                // If there aren't actually anyone using this entry we don't fetch it
                if (externalSubscribers === 0)
                {
                    // Reset refreshing to allow refreshing later
                    this._isRefreshing = false;
                    return rx.Observable.empty<ITimedValue<TValue>>();
                }

                return elementRetriever()
                    .select(v =>
                    {
                        return {
                                value: v,
                                cacheTime: moment()
                            };
                    });
            });

        // Creates an observable that emits an event each time a refresh is requested
        // or the element is updated externally.
        let retrievedOrExternallyUpdated = retrieveElementOnRefreshObservable
            .merge(externalElementUpdateObservable);

        const replayingObservable = retrievedOrExternallyUpdated
            .replay(undefined, 1); // Replay value if not first subscriber, starting with an empty value

        this._baseSubscription.setDisposable(replayingObservable.connect());

        // Creates an observable that simply wraps replayingObservable above
        // to perform a refresh when timed out, if not already refreshing.
        let timeoutHandlingObservable = replayingObservable
            .where(v =>
            {
                // If value hasn't timed out, use it
                if (v && !this.hasTimedOut(v.cacheTime))
                {
                    // Reset refreshing as a new value has been seen
                    this._isRefreshing = false;
                    return true;
                }

                // If value has timed out, ignore it and refresh if not currently refreshing
                if (!this._isRefreshing)
                    this.refresh();

                return false;
            })
            .select(v =>
            {
                return v.value;
            });

        const externalSubscriberTrackingObservable = rx.Observable
            .create<TValue>(o =>
            {
                // Increase refCount of external interesants
                externalSubscribers++;

                const subscription = timeoutHandlingObservable.subscribe(o);
                return rx.Disposable
                    .create(() =>
                    {
                        subscription.dispose();

                        // Increase refCount of external interesants
                        externalSubscribers--;
                        if (externalSubscribers === 0)
                            this._isRefreshing = false;
                    });
            });

        return externalSubscriberTrackingObservable;
    }

    private age(cacheTime: moment.Moment): number
    {
        return moment().diff(cacheTime);
    }

    private hasTimedOut(cacheTime: moment.Moment): boolean
    {
        return this.age(cacheTime) > this._maxAgeInMilliseconds();
    }
}

interface ITimedValue<TValue>
{
    value: TValue;
    cacheTime: moment.Moment;
}

export = CacheEntry;