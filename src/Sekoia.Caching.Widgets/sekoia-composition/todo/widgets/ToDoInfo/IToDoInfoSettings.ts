interface IToDoInfoSettings {
    toDoId: string|KnockoutObservable<string>;
    isLoading: KnockoutObservable<boolean>;
}

export = IToDoInfoSettings;