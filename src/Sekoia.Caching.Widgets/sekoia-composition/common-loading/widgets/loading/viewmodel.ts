import i18n = require("i18next");

class Loading
{
    public activate()
    {
        return i18n.loadNamespace("common-loading");
    }
}

export = Loading;