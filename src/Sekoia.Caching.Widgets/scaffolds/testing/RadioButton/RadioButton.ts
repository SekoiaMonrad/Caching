import ko = require("knockout");

class RadioButton
{
    public radioValue = ko.observable<string>("I'm checked!");
    public radioCheckedValue = ko.observable<string>();
}

export = RadioButton;