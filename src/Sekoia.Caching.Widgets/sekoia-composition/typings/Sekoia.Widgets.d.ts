declare module "sekoia/ActivatableBase" {
    import CompositableBase = require("sekoia/CompositableBase");

    class ActivatableBase extends CompositableBase<{ }> {
        /**
         * Allows the new object to execute custom activation logic.
         */
        public activate(): void|JQueryPromise<any>;

        /**
         * Allows the new object to cancel activation.
         */
        public canActivate(): boolean|JQueryPromise<boolean>;

        /**
         * Enables the new object to return a custom view.
         */
        public getView(): string;

        /**
         * Allows the new object to cancel activation.
         */
        public canDeactivate(): boolean|JQueryPromise<boolean>;

        /**
         * Allows the previous object to cancel deactivation.
         */
        public deactivate();
    }

    export = ActivatableBase;
}﻿declare module Sekoia {
    export interface IAssertions {
        /**
         * Asserts that the parameter truthy is is equivalent to true.
         */
        that(truthy: any, errorMessage: string): void;

        /**
         * Asserts that the specificed object is not null. This means not null and not undefined, so not the same as checking for false.
         */
        parameterCannotBeNull(value: any, parameterName?: string): void;

        /**
         * Asserts that a string is not null or whitespace.
         */
        parameterCannotBeNullOrWhitespace(value: string, parameterName?: string): void;

        /**
         * Asserts that value is an string that is not null and not the empty string.
         */
        parameterCannotBeNullOrEmpty(value: string, parameterName?: string): any;

        /**
         * Asserts that value is an array that is not null and not empty.
         */
        parameterCannotBeNullOrEmpty<T>(value: T[], parameterName?: string): any;

        /**
         * Asserts that value is an KnockoutObservable
         */
        parameterMustBeAKnockoutObservable(value: any, parameterName?: string): void;

        /**
         * Asserts that value is a writeable KnockoutObservable
         */
        parameterMustBeAWriteableKnockoutObservable(value: any, parameterName?: string): void;
    }
}﻿declare module "sekoia/assertions" {
    class Assertions implements Sekoia.IAssertions {
        constructor(helpers: Sekoia.IHelpers);

        public parameterCannotBeNull(value: any, parameterName?: string);

        public parameterCannotBeNullOrWhitespace(value: string, parameterName?: string);

        public parameterCannotBeNullOrEmpty(value: string, parameterName?: string);

        public parameterCannotBeNullOrEmpty<T>(value: T[], parameterName?: string);

        public parameterMustBeAKnockoutObservable(value: any, parameterName?: string);

        public parameterMustBeAWriteableKnockoutObservable(value: any, parameterName?: string);

        public that(truthy: any, errorMessage: string);
    }

    export = Assertions;
}﻿declare module "sekoia/CompositableBase" {
    class CompositableBase<TSettings> {
        /**
          * Allows the new object to execute custom activation logic.
          */
        public activate(settings: TSettings): JQueryPromise<any>|void;

        /**
         * Notifies the new object immediately before databinding occurs.
         */
        public binding();

        /**
         * Notifies the new object immediately after databinding occurs.
         */
        public bindingComplete();

        /**
         * Notifies the new object when its view is attached to its parent DOM node.
         */
        public attached();

        /**
         * Notifies the new object when the composition it participates in is complete.
         */
        public compositionComplete();

        /**
         * Notifies a composed object when its view is removed from the DOM.
         * Make sure to call super.detached() if overriding to use the detach-cleanup feature.
         */
        public detached();

        /**
         * Adds an object with dispose method to a collection that is cleaned up when this instance is detached.
         * @param cleanup 
         * @returns {} 
         */
        public addDetachCleanup(cleanup: { dispose(): void });
    }

    export = CompositableBase;
}﻿declare module "sekoia/DialogBase"
{
    import CompositableBase = require("sekoia/CompositableBase");

    class DialogBase<TSettings> extends CompositableBase<TSettings>
    {
        protected prepareDialogViewModel(viewModelConstructor: Function, settings: any);
    }

    export = DialogBase;
}﻿declare module Sekoia {
    export interface IHelpers {
        assert: IAssertions;

        isNull(o: any): boolean;

        isNullOrWhitespace(s: string): boolean;

        defaultIfNullOrWhitespace(s: string, defaultValue?: string): any;

        escapeForRegexp(s: string): string;

        /**
         * Tests that the specified object was created from the specified constructor.
         */
        testCreatingConstructor(obj: any, expectedConstructor: any): boolean;

        whenAll<T>(promises: JQueryGenericPromise<T>[]): JQueryPromise<T>;

        sensibleEquals<T>(value1: T, value2: T): boolean;
        
        textWidth(text: string | HTMLElement): number;
        
        scrollBarWidth(): number;

        naturalSort(a: string|number, b: string|number, options?: INaturalSortOptions): number;
        
        tabOverride(textarea: HTMLTextAreaElement): void;

        isElementVisible(el: HTMLElement, viewportElement?: HTMLElement): boolean;
        
        makeElementVisible(el: HTMLElement, viewportElement?: HTMLElement): void;

        trimArrayOfNodes(nodes: Node[]): Node[];
    }
    
    export interface INaturalSortOptions {
        // descending order
        desc?: boolean;
        // caseInsensitive sorting
        insensitive?: boolean;
    }
}﻿declare module "sekoia/helpers" {
    var theModule: Sekoia.IHelpers;
    export = theModule;
}﻿declare module Sekoia {
    export interface IHttpStatusCodes {
        nameOf(httpStatusCode: number): string;
        numberOf(httpStatusCode: string): number;

        pseudo: {
            HostUnreachable: number;
            Timeout: number;
        };

        // ReSharper disable InconsistentNaming
        Continue: number;
        SwitchingProtocols: number;
        Processing: number;
        Checkpoint: number;
        Ok: number;
        Created: number;
        Accepted: number;
        NonAuthoritativeInformation: number;
        NoContent: number;
        ResetContent: number;
        PartialContent: number;
        MultipleStatus: number;
        ImUsed: number;
        MultipleChoices: number;
        MovedPermanently: number;
        Found: number;
        SeeOther: number;
        NotModified: number;
        UseProxy: number;
        SwitchProxy: number;
        TemporaryRedirect: number;
        ResumeIncomplete: number;
        BadRequest: number;
        Unauthorized: number;
        PaymentRequired: number;
        Forbidden: number;
        NotFound: number;
        MethodNotAllowed: number;
        NotAcceptable: number;
        ProxyAuthenticationRequired: number;
        RequestTimeout: number;
        Conflict: number;
        Gone: number;
        LengthRequired: number;
        PreconditionFailed: number;
        RequestEntityTooLarge: number;
        RequestUriTooLong: number;
        UnsupportedMediaType: number;
        RequestedRangeNotSatisfiable: number;
        ExpectationFailed: number;
        ImATeapot: number;
        EnhanceYourCalm: number;
        UnprocessableEntity: number;
        Locked: number;
        FailedDependency: number;
        UnorderedCollection: number;
        UpgradeRequired: number;
        TooManyRequests: number;
        NoResponse: number;
        RetryWith: number;
        BlockedByWindowsParentalControls: number;
        ClientClosedRequest: number;
        InternalServerError: number;
        NotImplemented: number;
        BadGateway: number;
        ServiceUnavailable: number;
        GatewayTimeout: number;
        HttpVersionNotSupported: number;
        VariantAlsoNegotiates: number;
        InsufficientStorage: number;
        BandwidthLimitExceeded: number;
        NotExtended: number;
        // ReSharper restore InconsistentNaming
    }
}﻿declare module "sekoia/HttpStatusCodes" {
    var theModule: Sekoia.IHttpStatusCodes;
    export = theModule;
}declare module Sekoia.InputBase
{
    export interface IInputBase<TValue>
    {
        value: KnockoutObservable<string>;
        inputMask: KnockoutObservable<string>;
        inputHasFocus: KnockoutObservable<boolean>;
        autofocus: boolean;

        dispose(): any;
    }

    export interface IParts
    {
        info?: NodeList;
        error?: HTMLElement[];
        prefix?: HTMLElement;
        suffix?: HTMLElement;
        templateNodes?: Array<HTMLElement|Text>;
    }

    export interface IParams<TValue>
    {
        value: TValue | KnockoutObservable<TValue> | IValidationProperty<TValue>;
        tooltipPlacement?: string;
        tooltipViewport?: string | HTMLElement | { selector: string, padding: number };
        inputHasFocus?: KnockoutObservable<boolean>;
        inputMask?: string;
        inputMaskPlaceholder?: KnockoutObservable<string> | string;
        showErrorsWhileTyping?: boolean;
        validationMode?: 'aside' | 'tooltip';
        required?: KnockoutObservable<boolean> | boolean;
        readonly?: KnockoutObservable<boolean> | boolean;
        autofocus?: boolean;
    }

    export interface IComponentInfo
    {
        element: HTMLElement;
        templateNodes: Array<HTMLElement>;
    }

    interface TooltipOptions {
        container?: string | boolean | HTMLElement;
        animation?: boolean;
        html?: boolean;
        placement?: string | Function;
        selector?: string;
        title?: string | Function;
        trigger?: string;
        template?: string;
        delay?: number | Object;
        viewport?: string | Function | Object;
    }

    interface PopoverOptions {
        container?: string | boolean | HTMLElement;
        animation?: boolean;
        html?: boolean;
        placement?: string | Function;
        selector?: string;
        trigger?: string;
        title?: string | Function;
        template?: string;
        content?: any;
        delay?: number | Object;
        viewport?: string | Function | Object;
    }
    
    export interface ExtendedBootstrap extends JQuery {
        tooltip(options?: TooltipOptions): JQuery;
        tooltip(command: string): JQuery;

        popover(options?: PopoverOptions): JQuery;
        popover(command: string): JQuery;
    }
}declare module "sekoia/InputBase"
{
    abstract class InputBase<TValue> implements Sekoia.InputBase.IInputBase<TValue>
    {
        public inputMask: KnockoutObservable<string>;
        public inputHasFocus: KnockoutObservable<boolean>;
        public value: KnockoutObservable<string>;
        public containerElement: HTMLElement;
        public autofocus: boolean;

        constructor(params: Sekoia.InputBase.IParams<TValue>, parts: Sekoia.InputBase.IParts, element: HTMLElement);

        public dispose();
        public setAutofocus();

        protected addDetachCleanup(cleanup: Rx.IDisposable);

        protected getInputElement(containerElement: HTMLElement): HTMLInputElement | HTMLTextAreaElement;

        protected abstract convertToValueType(inputValue: string): TValue;

        protected abstract convertFromValueType(value: TValue): string;
    }

    export = InputBase;
}

declare module "text!./Template.html" {
    var text: string;
    export = text;
}

declare module "text!./TemplateTreeview.html" {
    var text: string;
    export = text;
}﻿declare module Sekoia {
    export interface IRestClient {
        /**
         * Creates a request builder for a GET request.
         * @param url The URL to request.
         * @param attachDefaultRetryBehavior Determines whether to attach default retry behavior (retry on error that isn't in 400 range). Defaults to true.
         * @returns A request builder.
         */
        get(url: string, attachDefaultRetryBehavior?: boolean): IRequestBuilder;

        /**
         * Creates a request builder for a HEAD request.
         * @param url The URL to request.
         * @param attachDefaultRetryBehavior Determines whether to attach default retry behavior (retry on error that isn't in 400 range). Defaults to true.
         * @returns A request builder.
         */
        head(url: string, attachDefaultRetryBehavior?: boolean): IRequestBuilder;

        /**
         * Creates a request builder for a POST request.
         * @param url The URL to request.
         * @param attachDefaultRetryBehavior Determines whether to attach default retry behavior (retry on error that isn't in 400 range). Defaults to false.
         * @returns A request builder.
         */
        post(url: string, attachDefaultRetryBehavior?: boolean): IRequestBuilder;

        /**
         * Creates a request builder for a PUT request.
         * @param url The URL to request.
         * @param attachDefaultRetryBehavior Determines whether to attach default retry behavior (retry on error that isn't in 400 range). Defaults to false.
         * @returns A request builder.
         */
        put(url: string, attachDefaultRetryBehavior?: boolean): IRequestBuilder;

        /**
         * Creates a request builder for a REMOVE request.
         * @param url The URL to request.
         * @param attachDefaultRetryBehavior Determines whether to attach default retry behavior (retry on error that isn't in 400 range). Defaults to false.
         * @returns A request builder.
         */
        remove(url: string, attachDefaultRetryBehavior?: boolean): IRequestBuilder;

        /**
         * Creates a request builder with no HTTP method set yet.
         * @returns A request builder.
         */
        request(): INoMethodRequestBuilder;

        /**
         * Creates a rest client with automatic track-n-trace handling.
         * @param trackTraceScopeContainer The container to use to store unresolved track-n-trace IDs.
         * @returns A track-n-trace enabled rest client.
         */
        enterTrackTraceScope(trackTraceScopeContainer?: ITrackTraceScopeContainer): ITrackTraceRestClient;
    }

    export interface ITrackTraceRestClient extends IRestClient {
        /**
         * Creates a request builder for a GET request.
         * @param url The URL to request.
         * @param attachDefaultRetryBehavior Determines whether to attach default retry behavior (retry on error that isn't in 400 range). Defaults to true.
         * @param includeTrackTraceId Determines whether to include stored rack-n-trace IDs in request. Defaults to true.
         * @returns A request builder.
         */
        get(url: string, attachDefaultRetryBehavior?: boolean, includeTrackTraceId?: boolean): IRequestBuilder;

        /**
         * Creates a request builder for a HEAD request.
         * @param url The URL to request.
         * @param attachDefaultRetryBehavior Determines whether to attach default retry behavior (retry on error that isn't in 400 range). Defaults to true.
         * @param includeTrackTraceId Determines whether to include stored rack-n-trace IDs in request. Defaults to true.
         * @returns A request builder.
         */
        head(url: string, attachDefaultRetryBehavior?: boolean, includeTrackTraceId?: boolean): IRequestBuilder;

        /**
         * Creates a request builder for a POST request.
         * @param url The URL to request.
         * @param attachDefaultRetryBehavior Determines whether to attach default retry behavior (retry on error that isn't in 400 range). Defaults to false.
         * @param includeTrackTraceId Determines whether to include stored rack-n-trace IDs in request. Defaults to false.
         * @returns A request builder.
         */
        post(url: string, attachDefaultRetryBehavior?: boolean, includeTrackTraceId?: boolean): IRequestBuilder;

        /**
         * Creates a request builder for a PUT request.
         * @param url The URL to request.
         * @param attachDefaultRetryBehavior Determines whether to attach default retry behavior (retry on error that isn't in 400 range). Defaults to false.
         * @param includeTrackTraceId Determines whether to include stored rack-n-trace IDs in request. Defaults to false.
         * @returns A request builder.
         */
        put(url: string, attachDefaultRetryBehavior?: boolean, includeTrackTraceId?: boolean): IRequestBuilder;

        /**
         * Creates a request builder for a REMOVE request.
         * @param url The URL to request.
         * @param attachDefaultRetryBehavior Determines whether to attach default retry behavior (retry on error that isn't in 400 range). Defaults to false.
         * @param includeTrackTraceId Determines whether to include stored rack-n-trace IDs in request. Defaults to false.
         * @returns A request builder.
         */
        remove(url: string, attachDefaultRetryBehavior?: boolean, includeTrackTraceId?: boolean): IRequestBuilder;
    }

    export interface INoMethodRequestBuilder {
        as(method: string): INoUrlRequestBuilder;
    }

    export interface INoUrlRequestBuilder {
        for(url: string): IRequestBuilder;
    }

    export interface IRequestBuilder {
        withBody(body: any): IRequestBuilder;
        withFormData(formData: FormData): IRequestBuilder;
        withTimeout(timeoutInMilliseconds: number): IRequestBuilder;
        withDataType(dataType: string): IRequestBuilder;
        withContentType(contentType: string): IRequestBuilder;
        withDefaultRetryBehavior(enable?: boolean): IRequestBuilder;
        withTrackTrace(trackTraceInfo: TrackTraceInfo | (() => TrackTraceInfo)): IRequestBuilder;

        queryString: IRequestQueryBuilder;
        headers: IRequestHeadersBuilder;

        /**
         * Executes request as command (subscribe to result of toObservableCommand() with the specified parameters).
         */
        executeCommand(onError?: (exception: any) => void, onCompleted?: () => void): Rx.IDisposable;
        toObservableCommand(): Rx.IVoidObservable;
        toObservable<T>(): Rx.Observable<T>;
        executeToPromise(): JQueryPromise<any>;
    }

    export interface IRequestHeadersBuilder {
        set(key: string, value?: string | (() => string)): IRequestBuilder;
    }

    export interface IRequestQueryBuilder {
        replace(queryString: string | (() => string)): IRequestBuilder;
        add(key: string, value?: string | (() => string)): IRequestBuilder;
    }

    export interface ITrackTraceScopeContainer {
        get(): TrackTraceInfo;
        set(trackTraceInfo: TrackTraceInfo): void;
    }

    type TrackTraceId = string | { trackTraceId: string | string[]; };
    type TrackTraceInfo = TrackTraceId | TrackTraceId[];
}﻿declare module "sekoia/rest" {
    var theModule: Sekoia.IRestClient;
    export = theModule;
}﻿declare module Sekoia {
    export class RestError implements IRestError {
        public statusCode: number;
        public statusMessage: string;
        public body: string;
        public isLikelyIntermittent: boolean;
        public isInputError: boolean;

        constructor(statusCode: number, statusMessage: string, body: string, isLikelyIntermittent: boolean, isInputError: boolean);
    }

    export interface IRestError {
        statusCode: number;
        statusMessage: string;
        body: string;
        isLikelyIntermittent: boolean;
        isInputError: boolean;
    }
}﻿declare module "sekoia/RestError" {
    class theModule extends Sekoia.RestError {
    }

    export = theModule;
}﻿declare module Sekoia {
    export interface IRxx {
        createObservable<TInput, TOutput>(source: TInput|KnockoutObservable<TInput>,
                                          observableFactory: (input: TInput) => Rx.Observable<TOutput>,
                                          isLoading?: () => void,
                                          sourceFilter?: (source: Rx.Observable<TInput>) => Rx.Observable<TInput>,
                                          notifyAlways?: boolean,
                                          ignoreNullAndEmptyInput?: boolean): Rx.Observable<{ input: TInput; output: TOutput }>;

        asKnockoutObservable<T>(source: T|KnockoutObservable<T>): KnockoutObservable<T>;
    }
}﻿declare module "sekoia/rxx" {
    var theModule: Sekoia.IRxx;
    export = theModule;
}declare module Sekoia.StringInputBase
{
    export interface IStringParams extends InputBase.IParams<string>
    {
    }
}﻿declare module "sekoia/StringInputBase"
{
    import InputBase = require("sekoia/InputBase");

    class StringInputBase extends InputBase<string> implements Sekoia.InputBase.IInputBase<string>
    {
        constructor(params: Sekoia.StringInputBase.IStringParams, parts: Sekoia.InputBase.IParts, element: HTMLElement);

        protected convertToValueType(inputValue: string): string;

        protected convertFromValueType(value: string): string;
    }

    export = StringInputBase;
}﻿declare module Sekoia.Trees
{
    export interface ITreeBuilderWithSourceType<T>
    {
        withTagsSelector(tagsSelector: (v: T, i: ITreeItem) => KnockoutObservable<any> | any): ITreeBuilderWithTagsSelector<T>;
    }

    export interface ITreeBuilderWithTagsSelector<T>
    {
        withTypeSelector(typeSelector: (v: T, i: ITreeItem) => KnockoutObservable<string> | string): ITreeBuilderWithTypeSelector<T>
    }

    export interface IAsyncChildrenResult
    {
        loading: KnockoutObservable<boolean>;
        hasAnyChildren: KnockoutObservable<boolean>;
        children: KnockoutObservable<ITreeItem[]>;
    }

    export type ChildrenBuilder<T> = (v: T, i: ITreeItem, b: ITreeItemsBuilder<T>) => KnockoutObservable<ITreeItem[]> | ITreeItem[] | IAsyncChildrenResult;

    export interface ITreeBuilderWithTypeSelector<T>
    {
        withChildrenBuilder(childrenBuilder: ChildrenBuilder<T>): ITreeBuilderWithRequiredParts<T>
    }

    export interface ITreeBuilderWithRequiredParts<T>
    {
        withIsCheckedTracker(checkedTracker: KnockoutObservableArray<ITreeItem>): ITreeBuilderWithRequiredParts<T>;
        withIsCheckedFactory(isCheckedFactory: IFeatureFactory<T>): ITreeBuilderWithRequiredParts<T>;
        withIsOpenFactory(isOpenFactory: IFeatureFactory<T>): ITreeBuilderWithRequiredParts<T>;
        withIsEnabledFactory(isEnabledFactory: IFeatureFactory<T>): ITreeBuilderWithRequiredParts<T>;
        withSorterByTypeSelector(sorterByTypeSelector: (type: string) => ISorter): ITreeBuilderWithRequiredParts<T>;
        withDefaultChildrenSorter(defaultChildrenSorter: ISorter): ITreeBuilderWithRequiredParts<T>;

        create(): ITree;
    }

    export interface ITree extends Rx.IDisposable
    {
        root: ITreeItem;

        visit(visitor: (i: ITreeItem) => void, visitorStrategy?: IVisitorStrategy, fromTheseAndDown?: ITreeItem[]): any;
        visit(visitor: (i: ITreeItem) => void, visitorStrategy?: IVisitorStrategy, fromThisAndDown?: ITreeItem): any;

        dispose(): any;
    }

    export interface ITreeItem extends Rx.IDisposable
    {
        isChecked: KnockoutObservable<boolean>;
        isOpen: KnockoutObservable<boolean>;
        isEnabled: KnockoutObservable<boolean>;
        tags: KnockoutObservable<any>;
        item: any;
        allChildren: KnockoutObservable<ITreeItem[]>;
        type: KnockoutObservable<string>;
        hasAnyChildren: KnockoutObservable<boolean>;
        parent: ITreeItem;
        depth: KnockoutObservable<number>;
        root: KnockoutComputed<ITreeItem>;
        loading: KnockoutObservable<boolean>;

        children(recursively?: boolean, onlyEnabled?: boolean): KnockoutObservable<ITreeItem[]>;
        childrenOfType(type: string, recursively?: boolean, onlyEnabled?: boolean): KnockoutObservable<ITreeItem[]>;
        childrenWhere(predicate: (i: ITreeItem) => boolean, recursively?: boolean, onlyEnabled?: boolean): KnockoutObservable<ITreeItem[]>;

        hasChildren(recursively?: boolean, onlyEnabled?: boolean): KnockoutObservable<boolean>;
        hasChildrenOfType(type: string, recursively?: boolean, onlyEnabled?: boolean): KnockoutObservable<boolean>;
        hasChildrenWhere(predicate: (i: ITreeItem) => boolean, recursively?: boolean, onlyEnabled?: boolean, sorterSelector?: string): KnockoutObservable<boolean>;

        forEachChild(action: (i: ITreeItem) => void, recursively?: boolean, onlyEnabled?: boolean): Rx.Observable<any>;
        forEachChildOfType(action: (i: ITreeItem) => void, type: string, recursively?: boolean, onlyEnabled?: boolean): Rx.Observable<any>;
        forEachChildWhere(action: (i: ITreeItem) => void, predicate: (i: ITreeItem) => boolean, recursively?: boolean, onlyEnabled?: boolean): Rx.Observable<any>;

        dispose(): void;
    }

    export interface IFeatureFactory<T>
    {
        (v: T, i: ITreeItem): KnockoutObservable<boolean>;
    }

    export interface IVisitorStrategy
    {
        visit(tree: ITreeItem[], visitor: (i: ITreeItem) => void): any;
    }

    export interface ISorter
    {
        (items: ITreeItem[]): ITreeItem[];
    }

    export interface ITreeItemsBuilder<T>
    {
        build(items: T[]): ITreeItem[];
    }

    /**
     * Defines the contract for a helper class used to track state of tree items
     * when it isn't enough to keep that information in the item itself.
     * Useful when wanting to keep state across multiple reloads of the tree.
     */
    export interface IExternalStateTracker
    {
        /**
         * Add the specified item to the list of items.
         */
        add(item: ITreeItem): any;

        /**
         * Remove the specified item from the list of items.
         */
        remove(item: ITreeItem): any;

        /**
         * Get a value indicating whether the specified item is.
         */
        is(item: ITreeItem): boolean;

        /**
         * Used to reapply state when the tree has been reloaded.
         */
        reapply(): any;
    }

    export class SorterByTypeBuilder
    {
        constructor(sorterLookup: (type: string) => ISorter);

        public add(type: string, sorter: ISorter): SorterByTypeBuilder;

        public sorterSelector(): (type: string) => ISorter;

        public static empty(): SorterByTypeBuilder;
    }

    export interface IFeatureFactories
    {
        /** Factory that is true if all factories are true. */
        and<T>(...factories: IFeatureFactory<T>[]): IFeatureFactory<T>;

        /** Factory that is true if any factory are true. */
        or<T>(...factories: IFeatureFactory<T>[]): IFeatureFactory<T>;

        /**
         * Builder for a feature factory that selects the actual feature factory by the type of the tree item. 
         * @param defaultIfTypeNotFound Feature factory to use for fallback for tree item types that haven't been explicitly added.
         */
        switchByType<T>(defaultIfTypeNotFound?: IFeatureFactory<T>): ISwitchByTypeFeatureFactoryBuilder<T>;

        /** Factory that keeps hold of open locations, such that when updating, previously open locations will stay open */
        trackedExternally: (externalStateTracker: IExternalStateTracker) => IFeatureFactory<any>;

        /** Factory that is true if the only has a few nodes. */
        trueIfTreeHasFewNodes: (maxNodeCount: number, type?: string, onlyEnabled?: boolean) => IFeatureFactory<any>;

        /** Factory that simply creates a writable boolean observable that's initially false */
        manualInitiallyFalse: IFeatureFactory<any>;

        /** Factory that simply creates a writable boolean observable that's initially true */
        manualInitiallyTrue: IFeatureFactory<any>;

        /** Factory that simply creates a writable boolean observable that's initially true */
        manualOrRootInitiallyTrue: IFeatureFactory<any>;

        /** Factory that simply creates a writable boolean observable that's initially false */
        manualOrRootInitiallyFalse: IFeatureFactory<any>;

        /** Factory that creates a writable computed boolean observable 
          * that is true if all children are checked, and affects all 
          * children when written. */
        recursive: (propertySelector: (i: ITreeItem) => KnockoutObservable<boolean>) => IFeatureFactory<any>;

        /** Factory-factory that creates a writable computed boolean observable 
          * that is true if all children of specific type are checked, and affects all 
          * children when written. */
        recursiveByType: (propertySelector: (i: ITreeItem) => KnockoutObservable<boolean>, type: string) => IFeatureFactory<any>;

        /** Factory-factory that creates a writable computed boolean observable 
          * that is true if all children of specific type are checked, and affects all 
          * children when written. */
        recursiveByTypeIfNotLeaf: (propertySelector: (i: ITreeItem) => KnockoutObservable<boolean>, type: string) => IFeatureFactory<any>;

        isChecked: IsCheckedFeatureFactories;

        isOpen: IsOpenFeatureFactories;
    }

    export interface IsCheckedFeatureFactories
    {
        /** Factory that creates a writable computed boolean observable 
          * that is true if all children are checked, and affects all 
          * children when written. */
        recursive(): IFeatureFactory<any>;

        /** Factory-factory that creates a writable computed boolean observable 
          * that is true if all children of specific type are checked, and affects all 
          * children when written. */
        recursiveByType(type: string): IFeatureFactory<any>;

        /** Factory-factory that creates a writable computed boolean observable 
          * that is true if all children of specific type are checked, and affects all 
          * children when written. */
        recursiveByTypeIfNotLeaf(type: string): IFeatureFactory<any>;
    }

    export interface IsOpenFeatureFactories
    {
        /** Factory that creates a writable computed boolean observable 
          * that is true if any children are is checked, but can be overriden
          * by being written.
          */
        openIfOpenOrChildIsChecked: IFeatureFactory<any>;
    }

    export interface ISwitchByTypeFeatureFactoryBuilder<T>
    {
        add(type: string, featureFactory: IFeatureFactory<T>): ISwitchByTypeFeatureFactoryBuilder<T>;
        create(): IFeatureFactory<T>;
    }

    export interface IVisitor
    {
        (i: ITreeItem, stopVisitor: KnockoutObservable<boolean>): void;
    }

    export interface IVisitorStrategies
    {
        depthFirstVisitorStrategy: IVisitorStrategy;
        breadthFirstVisitorStrategy: IVisitorStrategy;
    }
}﻿declare module "sekoia/trees"
{
    export class TreeBuilder
    {
        public static for<TSource>(): Sekoia.Trees.ITreeBuilderWithSourceType<TSource>;
    }

    export var featureFactories: Sekoia.Trees.IFeatureFactories;

    export class GeneratedKeyBasedExternalStateTracker<TKey> implements Sekoia.Trees.IExternalStateTracker
    {
        constructor(keyGenerator: (i: Sekoia.Trees.ITreeItem) => TKey, statesObservable?: KnockoutObservableArray<TKey> | KnockoutObservable<Array<TKey>>);

        public add(item: Sekoia.Trees.ITreeItem);
        public remove(item: Sekoia.Trees.ITreeItem);
        public is(item: Sekoia.Trees.ITreeItem): boolean;
        public reapply();
    }

    export class SingleItemSelectedExternalStateTracker<TKey> implements Sekoia.Trees.IExternalStateTracker
    {
        constructor(keyGenerator: (i: Sekoia.Trees.ITreeItem) => TKey, statesObservable: KnockoutObservable<TKey>);

        public add(item: Sekoia.Trees.ITreeItem);
        public remove(item: Sekoia.Trees.ITreeItem);
        public is(item: Sekoia.Trees.ITreeItem): boolean;
        public reapply();
    }
}﻿declare module Sekoia
{
    export interface IValidationPropertySetFactory
    {
        createSet(): IValidationPropertySet;

        forValueOf<T>(valueContainer?: KnockoutObservable<T>): IValidationPropertyBuilder<T>;
        forArrayOf<T>(valueContainer?: KnockoutObservable<T[]>): IArrayValidationPropertyBuilder<T>;

        isValidationProperty(obj: any): boolean;
    }

    export interface IValidationPropertySet
    {
        allAreValid: KnockoutComputed<boolean>;
        showAllAsValid: KnockoutComputed<boolean>;
        allErrors: KnockoutComputed<string[]>;
        allErrorsToShow: KnockoutComputed<string[]>;
        checkIsAllValid: () => Promise<boolean>;

        forValueOf<T>(valueContainer?: KnockoutObservable<T>): IValidationPropertyBuilder<T>;
        forArrayOf<T>(valueContainer?: KnockoutObservable<T[]>): IArrayValidationPropertyBuilder<T>;
    }

    export interface IValidationPropertyCore
    {
        isValid: KnockoutComputed<boolean>;
        checkIsValid: () => Promise<boolean>;
        error: KnockoutComputed<string>;
        showAsValid: KnockoutComputed<boolean>;
        errorToShow: KnockoutComputed<string>;
        isValidating: KnockoutComputed<boolean>;
        hasInput: KnockoutComputed<boolean>;
    }

    export interface IValidationProperty<T> extends IValidationPropertyCore
    {
        value: KnockoutObservable<T>;
    }

    export interface IConvertedOutputValidationProperty<T, TOutput> extends IValidationProperty<T>
    {
        output: KnockoutObservable<TOutput>;
    }

    export interface IArrayValidationProperty<T> extends IValidationProperty<T[]>
    {
        add(value: T): void;
        remove(value: T): void;
    }

    export interface IConvertedOutputArrayValidationProperty<T, TOutput> extends IArrayValidationProperty<T>, IConvertedOutputValidationProperty<T[], TOutput[]>
    {
    }

    export interface IValidationPropertyBuilder<T>
    {
        addValidator(validator: (value: T) => StringOrObservableString, delayInMilliseconds?: number): IValidationPropertyBuilder<T>;
        validWhen(predicate: (value: T) => boolean, error?: string): IValidationPropertyBuilder<T>;

        convertOutput<TOutput>(converter: (input: T) => TOutput, defaultWhenInvalid?: TOutput): IConvertedOutputValidationProperty<T, TOutput>;
        create(): IValidationProperty<T>;
    }

    export interface IArrayValidationPropertyBuilder<T>
    {
        addValidator(validator: (value: T[]) => StringOrObservableString, delayInMilliseconds?: number): IArrayValidationPropertyBuilder<T>;
        validWhen(predicate: (value: T[]) => boolean, error?: string): IArrayValidationPropertyBuilder<T>;

        convertOutput<TOutput>(converter: (input: T[]) => TOutput[], defaultWhenInvalid?: TOutput[]): IConvertedOutputArrayValidationProperty<T, TOutput>;
        create(): IArrayValidationProperty<T>;
    }

    type StringOrObservableString = string|Rx.Observable<string>;
}﻿declare module "sekoia/ValidationProperty" {
    var theModule: Sekoia.IValidationPropertySetFactory;
    export = theModule;
}// @TODO: Remove when we update to Typescript > 2.0
interface HTMLCanvasElement {
    toBlob(callback: (result?: Blob) => void, type?: string, ...arguments: any[]): void;
}﻿interface KnockoutBindingHandlers {
    capitalize: KnockoutBindingHandler;
}interface KnockoutBindingHandlers {
    comparerChecked: KnockoutBindingHandler;
}﻿interface KnockoutBindingHandlers {
    date: KnockoutBindingHandler;
}﻿interface KnockoutBindingHandlers {
    datepicker: KnockoutBindingHandler;
}// Type definitions for es6-promise
// Project: https://github.com/jakearchibald/ES6-Promise
// Definitions by: François de Campredon <https://github.com/fdecampredon/>, vvakame <https://github.com/vvakame>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped

interface Thenable<T> {
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Thenable<U>;
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => void): Thenable<U>;
}

declare class Promise<T> implements Thenable<T> {
	/**
	 * If you call resolve in the body of the callback passed to the constructor,
	 * your promise is fulfilled with result object passed to resolve.
	 * If you call reject your promise is rejected with the object passed to reject.
	 * For consistency and debugging (eg stack traces), obj should be an instanceof Error.
	 * Any errors thrown in the constructor callback will be implicitly passed to reject().
	 */
	constructor(callback: (resolve : (value?: T | Thenable<T>) => void, reject: (error?: any) => void) => void);

	/**
	 * onFulfilled is called when/if "promise" resolves. onRejected is called when/if "promise" rejects.
	 * Both are optional, if either/both are omitted the next onFulfilled/onRejected in the chain is called.
	 * Both callbacks have a single parameter , the fulfillment value or rejection reason.
	 * "then" returns a new promise equivalent to the value you return from onFulfilled/onRejected after being passed through Promise.resolve.
	 * If an error is thrown in the callback, the returned promise rejects with that error.
	 *
	 * @param onFulfilled called when/if "promise" resolves
	 * @param onRejected called when/if "promise" rejects
	 */
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => U | Thenable<U>): Promise<U>;
    then<U>(onFulfilled?: (value: T) => U | Thenable<U>, onRejected?: (error: any) => void): Promise<U>;

	/**
	 * Sugar for promise.then(undefined, onRejected)
	 *
	 * @param onRejected called when/if "promise" rejects
	 */
	catch<U>(onRejected?: (error: any) => U | Thenable<U>): Promise<U>;
}

declare namespace Promise {
	/**
	 * Make a new promise from the thenable.
	 * A thenable is promise-like in as far as it has a "then" method.
	 */
	function resolve<T>(value?: T | Thenable<T>): Promise<T>;

	/**
	 * Make a promise that rejects to obj. For consistency and debugging (eg stack traces), obj should be an instanceof Error
	 */
	function reject(error: any): Promise<any>;
	function reject<T>(error: T): Promise<T>;

	/**
	 * Make a promise that fulfills when every item in the array fulfills, and rejects if (and when) any item rejects.
	 * the array passed to all can be a mixture of promise-like objects and other objects.
	 * The fulfillment value is an array (in order) of fulfillment values. The rejection value is the first rejection value.
	 */
	function all<T1, T2, T3, T4, T5, T6, T7, T8, T9, T10>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable <T4>, T5 | Thenable<T5>, T6 | Thenable<T6>, T7 | Thenable<T7>, T8 | Thenable<T8>, T9 | Thenable<T9>, T10 | Thenable<T10>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9, T10]>;
    function all<T1, T2, T3, T4, T5, T6, T7, T8, T9>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable <T4>, T5 | Thenable<T5>, T6 | Thenable<T6>, T7 | Thenable<T7>, T8 | Thenable<T8>, T9 | Thenable<T9>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8, T9]>;
    function all<T1, T2, T3, T4, T5, T6, T7, T8>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable <T4>, T5 | Thenable<T5>, T6 | Thenable<T6>, T7 | Thenable<T7>, T8 | Thenable<T8>]): Promise<[T1, T2, T3, T4, T5, T6, T7, T8]>;
    function all<T1, T2, T3, T4, T5, T6, T7>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable <T4>, T5 | Thenable<T5>, T6 | Thenable<T6>, T7 | Thenable<T7>]): Promise<[T1, T2, T3, T4, T5, T6, T7]>;
    function all<T1, T2, T3, T4, T5, T6>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable <T4>, T5 | Thenable<T5>, T6 | Thenable<T6>]): Promise<[T1, T2, T3, T4, T5, T6]>;
    function all<T1, T2, T3, T4, T5>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable <T4>, T5 | Thenable<T5>]): Promise<[T1, T2, T3, T4, T5]>;
    function all<T1, T2, T3, T4>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>, T4 | Thenable <T4>]): Promise<[T1, T2, T3, T4]>;
    function all<T1, T2, T3>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>, T3 | Thenable<T3>]): Promise<[T1, T2, T3]>;
    function all<T1, T2>(values: [T1 | Thenable<T1>, T2 | Thenable<T2>]): Promise<[T1, T2]>;
    function all<T>(values: (T | Thenable<T>)[]): Promise<T[]>;

	/**
	 * Make a Promise that fulfills when any item fulfills, and rejects if any item rejects.
	 */
	function race<T>(promises: (T | Thenable<T>)[]): Promise<T>;
}

declare module 'es6-promise' {
	var foo: typeof Promise; // Temp variable to reference Promise in local context
	namespace rsvp {
		export var Promise: typeof foo;
		export function polyfill(): void;
	}
	export = rsvp;
}
interface KnockoutBindingHandlers
{
    i18n: KnockoutBindingHandler;
}﻿interface KnockoutSubscribable<T> {
    /**
     * Applies the extension { rateLimit: { timeout: delayInMilliseconds, method: "notifyWhenChangesStop" } }.
     */
    throttle(delayInMilliseconds: number): KnockoutSubscribable<T>
}

interface KnockoutObservable<T> {
    /**
     * Applies the extension { rateLimit: { timeout: delayInMilliseconds, method: "notifyWhenChangesStop" } }.
     */
    throttle(delayInMilliseconds: number): KnockoutObservable<T>
}

interface KnockoutComputed<T> {
    /**
     * Applies the extension { rateLimit: { timeout: delayInMilliseconds, method: "notifyWhenChangesStop" } }.
     */
    throttle(delayInMilliseconds: number): KnockoutComputed<T>
}﻿interface KnockoutSubscribableFunctions<T> {
    /**
     * Converts this Knockout subscribable to an Reactive Extension observable.
     */
    toObservable(withReplyLatest?: boolean): Rx.Observable<T>;
}

interface KnockoutObservableFunctions<T> {
    /**
     * Converts this Knockout subscribable to an Reactive Extension observable.
     */
    toObservableWithReplyLatest(): Rx.Observable<T>;

    /**
     * Converts this Knockout subscribable to an Reactive Extension observable.
     */
    toSubject(): Rx.ISubject<T>;
}

interface KnockoutComputedFunctions<T> {
    /**
     * Converts this Knockout subscribable to an Reactive Extension observable.
     */
    toObservableWithReplyLatest(): Rx.Observable<T>;
}﻿interface KnockoutBindingHandlers {
    let: KnockoutBindingHandler;
}﻿interface KnockoutBindingHandlers
{
    appendText: KnockoutBindingHandler;
    prependText: KnockoutBindingHandler;
    hidden: KnockoutBindingHandler;
    toggle: KnockoutBindingHandler;
    onceIf: KnockoutBindingHandler;
}declare module Pica {
    export interface IPica {
        resizeCanvas(from: HTMLCanvasElement|HTMLImageElement, to: HTMLCanvasElement, options: IPicaResizeCanvasOptions, callback: (err) => void): void;

        terminate(task_id: number): void;

        WW: boolean;
        WEBGL: boolean;
    }

    interface IPicaResizeCanvasOptions {
        quality?: number;
        alpha?: boolean;
        unsharpAmount?: number;
        unsharpRadius?: number;
        unsharpThreshold?: number;
    }
}

declare module "pica" {
    var theModule: Pica.IPica;
    export = theModule;
}﻿declare module Rx {
    export interface Observable<T> {
        /**
         * Creates an observable that accumlates all values from the source and replays all of them when a new value arrives.
         */
        accumulate(initiallyEmitEmptyArray?: boolean): Rx.Observable<T[]>;
    }

}﻿declare module Rx {
    export interface Observable<T> {
        /**
         * Retries on error by resubscribing. Note that duplicates may occur. If this is unacceptable use retryOnErrorNoDuplicates.
         * @param retryCount The max number of times to retry. Defaults to 3.
         * @param backoffStrategy The backoff strategy to use. Defaults to exponential backoff.
         * @param retryOnErrorPredicate A predicate determining on which errors to retry.
         * @param scheduler The scheduler to retry on.
         * @returns Observable 
         */
        retryOnError(
            retryCount?: number,
            backoffStrategy?: (n: number) => number,
            retryOnErrorPredicate?: (exception: any) => boolean,
            scheduler?: Rx.Scheduler): Observable<T>;

        /**
         * Retries on error by resubscribing. Note that all items are buffered to ensure no duplicates occur in case of an error.
         * @param retryCount The max number of times to retry. Defaults to 3.
         * @param backoffStrategy The backoff strategy to use. Defaults to exponential backoff.
         * @param retryOnErrorPredicate A predicate determining on which errors to retry.
         * @param scheduler The scheduler to retry on.
         * @returns Observable 
         */
        retryOnErrorNoDuplicates(
            retryCount?: number,
            backoffStrategy?: (n: number) => number,
            retryOnErrorPredicate?: (exception: any) => boolean,
            scheduler?: Rx.Scheduler): Observable<T>;

        /**
         * Caches the underlying observable for the specified number of milliseconds (or forever if not specified), such 
         * that subsequent subscriptions get a replay or causes a retry sbuscription to the underlying observable 
         * if expired.
         * @param expirationInMilliseconds The number of milliseconds to cache the result.
         * @param scheduler The scheduler to use to clear the cache.
         * @param cacheStore The store to use for the cached observable. The purpose of supporting this is primarily to provide support for clearing the cache externally.
         * @returns Observable
         */
        cache(
            expirationInMilliseconds?: number,
            scheduler?: IScheduler,
            cacheStore?: ICacheStore<T>): Observable<T>;

        /**
         * Combination of doOnError and doOnCompleted. 
         * @param onFinished The callback. First parameter indicates whether this is onErro or onCompleted.
         * @param thisArg Value to treat as this.
         * @returns The augmented observable.
         */
        doOnFinished(onFinished: (isOnError: boolean, exception: any) => void, thisArg?: any): Observable<T>;

        /**
         * Converts observable instance to a type that is easier to work with when the only expected events are Error and Completed.
         */
        toVoidObservable(): IVoidObservable;
    }

    interface Subject<T> {
        /**
         * Retries on error by resubscribing. Note that duplicates may occur. If this is unacceptable use retryOnErrorNoDuplicates.
         * @param retryCount The max number of times to retry. Defaults to 3.
         * @param backoffStrategy The backoff strategy to use. Defaults to exponential backoff.
         * @param retryOnErrorPredicate A predicate determining on which errors to retry.
         * @param scheduler The scheduler to retry on.
         * @returns Observable 
         */
        retryOnError(
            retryCount?: number,
            backoffStrategy?: (n: number) => number,
            retryOnErrorPredicate?: (exception: any) => boolean,
            scheduler?: Rx.Scheduler): Observable<T>;

        /**
         * Retries on error by resubscribing. Note that all items are buffered to ensure no duplicates occur in case of an error.
         * @param retryCount The max number of times to retry. Defaults to 3.
         * @param backoffStrategy The backoff strategy to use. Defaults to exponential backoff.
         * @param retryOnErrorPredicate A predicate determining on which errors to retry.
         * @param scheduler The scheduler to retry on.
         * @returns Observable 
         */
        retryOnErrorNoDuplicates(
            retryCount?: number,
            backoffStrategy?: (n: number) => number,
            retryOnErrorPredicate?: (exception: any) => boolean,
            scheduler?: Rx.Scheduler): Observable<T>;

        /**
         * Caches the underlying observable for the specified number of milliseconds (or forever if not specified), such 
         * that subsequent subscriptions get a replay or causes a retry sbuscription to the underlying observable 
         * if expired.
         * @param expirationInMilliseconds The number of milliseconds to cache the result.
         * @param scheduler The scheduler to use to clear the cache.
         * @param cacheStore The store to use for the cached observable. The purpose of supporting this is primarily to provide support for clearing the cache externally.
         * @returns Observable
         */
        cache(
            expirationInMilliseconds?: number,
            scheduler?: IScheduler,
            cacheStore?: ICacheStore<T>): Observable<T>;

        /**
         * Combination of doOnError and doOnCompleted. 
         * @param onFinished The callback. First parameter indicates whether this is onErro or onCompleted.
         * @param thisArg Value to treat as this.
         * @returns The augmented observable.
         */
        doOnFinished(onFinished: (isOnError: boolean, exception: any) => void, thisArg?: any): Observable<T>;

        /**
         * Converts observable instance to a type that is easier to work with when the only expected events are Error and Completed.
         */
        toVoidObservable(): IVoidObservable;
    }

    /**
     * Used to store the cache obseravable used by the cache operator. 
     */
    export interface ICacheStore<T> {
        /**
         * Gets a previously stored value.
         */

        get(): Rx.ReplaySubject<T>;
        /**
         * The the stored value.
         */
        set(value: Rx.ReplaySubject<T>): any;
    }

    export interface IVoidObservable {
        subscribe(onError?: (exception: any) => void, onCompleted?: () => void): IDisposable;

        subscribeOnError(onError: (exception: any) => void, thisArg?: any): IDisposable;
        subscribeOnCompleted(onCompleted: () => void, thisArg?: any): IDisposable;

        toObservable(): Rx.Observable<any>;
    }
}﻿declare module Rx {
    export interface Observable<T> {
        /**
         * Turns this instance into a Knockout observable (specifically a read-only pureComputed observable).
         */
        toKoObservable(onError?: (exception: any) => void, onCompleted?: () => void): KnockoutObservable<T>;
    }

    export interface Subject<T> {
        /**
         * Turns this instance into a Knockout observable (specifically a read-only pureComputed observable).
         */
        toKoObservable(onError?: (exception: any) => void, onCompleted?: () => void): KnockoutObservable<T>;
    }
}interface KnockoutBindingHandlers
{
    progress: KnockoutBindingHandler;
    fadeVisible: KnockoutBindingHandler;
    slideVisible: KnockoutBindingHandler;
}declare module Sekoia.Checkbox {
    export interface ICheckboxParams
    {
        value: KnockoutObservable<string> | string;
        checked: KnockoutObservable<boolean> | Sekoia.IArrayValidationProperty<string> | Sekoia.IValidationProperty<any>;
        readonly?: KnockoutObservable<boolean> | boolean;
        checkboxAlignment?: KnockoutObservable<string> | string;
    }
}declare module "sekoia/Checkbox" {
    class Checkbox {
        public value: KnockoutObservable<string>;
        public checked: KnockoutObservable<string>;
        public isBinding: KnockoutObservable<boolean>;

        constructor(params: Sekoia.Checkbox.ICheckboxParams);
    }

    export = Checkbox;
}declare module Sekoia.Dropdown
{
    export interface IDropdownParams
    {
        optionTextProperty?: string;
        optionValueProperty?: string;
        enableSearch?: boolean;
        labelText: KnockoutObservable<string> | string;
        items: KnockoutObservable<IDropdownItem[]>;
        value: KnockoutObservable<string>;
        treeView?: boolean;
    }

    export interface IDropdownItem
    {
        text: string;
        value: string;
        selected: KnockoutObservable<boolean>;
        disabled: KnockoutObservable<boolean>;
    }
}declare module "sekoia/Dropdown" {
    class Dropdown
    {
        public value: KnockoutObservable<string>;
        public selectedValueText: KnockoutObservable<string>;
        public processedItems: KnockoutComputed<Sekoia.Dropdown.IDropdownItem>;

        constructor(params: Sekoia.Dropdown.IDropdownParams);
    }

    export = Dropdown;
}declare module Sekoia.MovePicture
{
    export interface IMovePictureParams
    {
        viewPortWidth: KnockoutObservable<number>;
        viewPortHeight: KnockoutObservable<number>;
        screenRatioX: KnockoutObservable<number>;
        screenRatioY: KnockoutObservable<number>;
        finalImageWidth: KnockoutObservable<number>;
        finalImageHeight: KnockoutObservable<number>;
    }
}﻿declare module Sekoia.PictureEditor
{
    export interface IPictureEditorSettings
    {
        blobToSave: KnockoutObservable<Blob>;
        viewPortWidth: KnockoutObservable<number>;
        viewPortHeight: KnockoutObservable<number>;
        screenRatioX: KnockoutObservable<number>;
        screenRatioY: KnockoutObservable<number>;
        finalImageWidth: KnockoutObservable<number>;
        finalImageHeight: KnockoutObservable<number>;
    }

    export interface IParts {
        save?: HTMLElement;
        cancel?: HTMLElement;
        unknownimage?: HTMLElement;
        selectimage?: HTMLElement;
    }
}declare module Sekoia.RadioButton
{
    export interface IRadioButtonParams
    {
        checked: KnockoutObservable<string>;
        checkedValue?: string;
        checkedText?: string;
        items: KnockoutObservable<IRadioButtonItem[]>;
        name?: string;
        value?: string;
        readonly?: KnockoutObservable<boolean> | boolean;
        container?: ContainerType;
    }

    export interface IRadioButtonItem
    {
        text: string;
        value: string;
    }

    export type ContainerType = "ol" | "ul" | "";
}declare module "sekoia/RadioButton" {
    class RadioButton
    {
        public checkedValue: KnockoutObservable<string>;
        public name: string;
        public value: string;
        public checked: KnockoutObservable<string>;
        public processedItems: KnockoutComputed<Sekoia.RadioButton.IRadioButtonItem>;

        constructor(params: Sekoia.RadioButton.IRadioButtonParams);
    }

    export = RadioButton;
}

declare module "text!./RadioButtonList.html" {
    var text: string;
    export = text;
}

declare module "text!./RadioButtonSingle.html" {
    var text: string;
    export = text;
}declare module Sekoia.Select
{
    export interface ISelectParams
    {
        optionTextProperty?: string;
        optionValueProperty?: string;
        items: KnockoutObservable<ISelectItem[]>;
        value: KnockoutObservable<string>;
        readonly?: KnockoutObservable<boolean> | boolean;
    }

    export interface ISelectItem
    {
        text: string;
        value: string;
    }
}declare module "sekoia/Select" {
    class Select
    {
        public value: KnockoutObservable<string>;;
        public processedItems: KnockoutComputed<Sekoia.Select.ISelectItem>;

        constructor(params: Sekoia.Select.ISelectParams);
    }

    export = Select;
}declare module Sekoia.Table
{
    export interface ITableParams
    {
        data: KnockoutObservable<any>;
        typeSelector?: string;
        clickRowHandler?: Function;
        isLoading?: KnockoutObservable<boolean>;
    }
}