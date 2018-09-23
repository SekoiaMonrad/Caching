import $ = require("jquery");

class PackageInitializer implements UiComposition.IPackageInitializer
{
    public initialize(context: UiComposition.IPackageInitializerContext): JQueryPromise<any>
    {
        console.log("initialize called with pathPrefix '" + context.pathPrefix + "'");

        // Give the package a name (i.e. ui-comp)
        context.namePackage("sekoia");

        // Register components
        context.registerComponent("CacheBuilder");

        // Register widgets
        //context.registerWidget("configuration");
        //context.registerWidget("versionSelector");
        //context.registerWidget("packageSelector");

        // Register services
        //context.registerService("some-service");

        return $.when();
    }
}

export = PackageInitializer;