import ko = require("knockout");

class RadioButton
{
    public value: string;
    public checkedValue: KnockoutObservable<string>;
    public name: string;

    constructor(params: IRadioButton)
    {
        if (!params.value)
            throw new Error("A RadioButton must have a value");
        if (!ko.isObservable(params.checkedValue))
            throw new Error("A RadioButton must have a observable checkedValue");

        this.value = params.value;
        this.checkedValue = params.checkedValue;

        this.name = name
                    ? name
                    : "";
    }
}

interface IRadioButton
{
    value: string;
    checkedValue: KnockoutObservable<string>;
    name?: string;
}

export = RadioButton;