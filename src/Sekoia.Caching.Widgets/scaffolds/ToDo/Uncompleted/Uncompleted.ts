import ActivatableBase = require("sekoia/ActivatableBase");
import ko = require("knockout");

class Uncompleted extends ActivatableBase {
    public refresh = ko.observable(0);
}

export = Uncompleted;