declare module "compass/events" {
    var theModule: Compass.ICompassEventsModule;
    export = theModule;
}﻿declare module Compass {
    export interface ICompassEventsModule {
        publish(event: IEvent): void;

        build(): IEventBuilder;

        get(eventId: string): Rx.Observable<IEvent>;
        get(eventIds: string[]): Rx.Observable<IEvent>;
        get(): Rx.Observable<IEvent>;

        /**
         * Register the specified event replayer.
         * @param replayer Is an object that when given a sink replays all events (filtered by eventIds).
         * @returns A disposable object which removes the replayer from the system.
         */
        registerEventReplayer(replayer: IEventReplayer): Rx.IDisposable;
    }

    export interface IEventReplayer {
        (sink: Rx.IObserver<IEvent>, eventIds: string[]): void;
    }

    export interface IEvent {
        id: string;
        timestamp: Date;
        payload: any;
    }

    export interface IEventBuilder {
        withId(id: string): IPublishableEventBuilder;
        setPayload(payload: any): IEventBuilder;
        addPayload(name: string, value: any): IEventBuilder;
    }

    export interface IPublishableEventBuilder extends IEventBuilder {
        setPayload(payload: any): IPublishableEventBuilder;
        addPayload(name: string, value: any): IPublishableEventBuilder;

        publish(): void;
        toEvent(): IEvent;
    }
}﻿declare module Compass {
    export interface ICompassModalsModule {
        /**
         * Shows a dialog via the dialog plugin.
         * @param {object|string} obj The object (or moduleId) to display as a dialog.
         * @param {object} [activationData] The data that should be passed to the object upon activation.
         * @param {string} [context] The name of the dialog context to use. Uses the default context if none is specified.
         * @returns {Promise} A promise that resolves when the dialog is closed and returns any data passed at the time of closing.
        */
        showDialog(obj: any, activationData?: any, context?: string): JQueryPromise<any>;

        /**
         * Closes the dialog associated with the specified object. via the dialog plugin.
         * @param {object} obj The object whose dialog should be closed.
         * @param {object} results* The results to return back to the dialog caller after closing.
         */
        closeDialog(obj: any, ...results): void;

        /**
         * Shows a message box via the dialog plugin.
         * @param {string} message The message to display in the dialog.
         * @param {string} [title] The title message.
         * @param {string[]} [options] The options to provide to the user.
         * @param {boolean} [autoclose] Automatically close the the message box when clicking outside?
         * @param {Object} [settings] Custom settings for this instance of the messsage box, used to change classes and styles.
         * @returns {Promise} A promise that resolves when the message box is closed and returns the selected option.
         */
        showMessage(message: string, title?: string, options?: string[], autoclose?: boolean, settings?: Object): JQueryPromise<string>;

        /**
         * Shows a message box.
         * @param {string} message The message to display in the dialog.
         * @param {string} [title] The title message.
         * @param {DialogButton[]} [options] The options to provide to the user.
         * @param {boolean} [autoclose] Automatically close the the message box when clicking outside?
         * @param {Object} [settings] Custom settings for this instance of the messsage box, used to change classes and styles.
         * @returns {Promise} A promise that resolves when the message box is closed and returns the selected option.
         */
        showMessage(message: string, title?: string, options?: DialogButton[], autoclose?: boolean, settings?: Object): JQueryPromise<any>;
    }
}﻿declare module "compass/modals" {
    var theModule: Compass.ICompassModalsModule;
    export = theModule;
}﻿declare module Compass {
    export interface ICompassNotificationModule {
        bigBox(title: string, content: string, color: number, timeout: number, icon: string): void;
        smallBox(title: string, htmlContent: string, color: string, timeout: number, icon: string): void;
        smallBox_info(title: string, htmlContent: string, timeout: number, icon: string): void;
        smallBox_warning(title: string, htmlContent: string, timeout: number, icon: string): void;
        smallBox_danger(title: string, htmlContent: string, timeout: number, icon: string): void;
        smallBox_success(title: string, htmlContent: string, timeout: number, icon: string): void;
    }
}﻿declare module "compass/notifications" {
    var theModule: Compass.ICompassNotificationModule;
    export = theModule;
} declare module Compass.TagsInput
{
    export interface ITagItem
    {
        text: string;
        value: string;
        cssClass?: string;
        readOnly?: boolean;
    }
}