import $ = require("jquery");

class PackageInitializer implements UiComposition.IPackageInitializer {
    public initialize(context: UiComposition.IPackageInitializerContext): JQueryPromise<any>
    {
        console.log("initialize called with pathPrefix '" + context.pathPrefix + "'");

        context.namePackage("testing");

        context.registerWidget("eventlist");
        context.registerWidget("AuthManager");

        context.registerUIComponent("RadioButton", true);

        return $.when();
    }
}

export = PackageInitializer;