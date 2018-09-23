import ActivatableBase = require("sekoia/ActivatableBase");
import ko = require("knockout");

class UncompletedAndCompleted extends ActivatableBase {
    public refresh = ko.observable(0);
}

export = UncompletedAndCompleted;