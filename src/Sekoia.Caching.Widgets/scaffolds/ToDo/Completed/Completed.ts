import ActivatableBase = require("sekoia/ActivatableBase");
import ko = require("knockout");

class Completed extends ActivatableBase {
    public refresh = ko.observable(0);
}

export = Completed;