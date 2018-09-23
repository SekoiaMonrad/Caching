import $ = require("jquery");

class PackageInitializer implements UiComposition.IPackageInitializer {
    public initialize(context: UiComposition.IPackageInitializerContext): JQueryPromise<any>
    {
        console.log("initialize called with pathPrefix '" + context.pathPrefix + "'");

        // Give the package a name (i.e. ui-comp)
        context.namePackage("common");

        context.registerWidget("loading");

        return $.when();
    }
}

export = PackageInitializer;