declare module CodeToggling {
    export interface IToggleManager {
        /**
         * Gets an object representing the specified toggle.
         * @param toggleName The name of the toggle to get.
         * @param defaultState The default state for the toggle if not explicitly configured.
         */
        get(toggleName: string, defaultState?: boolean): Rx.Observable<IToggle>;

        /**
         * Gets an object representing the specified toggle.
         * @param toggleName The name of the toggle to get.
         * @param defaultState The default state for the toggle if not explicitly configured.
         */
        getAsKo(toggleName: string, defaultState?: boolean): KnockoutObservable<IToggle>;

        /**
         * Gets all toggles.
         */
        getAll(): Rx.Observable<IToggle>;

        /**
         * Gets whether the specified toggle is disabled
         * @param toggleName The name of the toggle to check.
         * @param defaultState The default state for the toggle if not explicitly configured.
         *                     Note that this is not the value to be returned if not specified: 
         *                          This is the state of the toggle if not explicitly configured.
         *                          Thus calling IsDisabled(toggleName, true) will return false 
         *                          if not explicitly configured, and IsDisabled(toggleName, false) 
         *                          will return true if not explicitly configured.
         */
        isDisabled(toggleName: string, defaultState?: boolean): Rx.Observable<boolean>;
        /**
         * Gets whether the specified toggleName is enabled.
         * @param toggleName The name of the toggle to check.
         * @param defaultState The default state for the toggle if not explicitly configured.
         * @returns {} 
         */
        isEnabled(toggleName: string, defaultState?: boolean): Rx.Observable<boolean>;
    }

    export interface IToggle {
        /**
         * Gets whether the specified toggle is enabled.
         */
        isEnabled(): boolean;

        /**
         * Get the name of the toggle represented by this object.
         */
        name(): string;
    }
}﻿declare module "codeToggling/toggleManager" {
    var theModule: CodeToggling.IToggleManager;
    export = theModule;
}