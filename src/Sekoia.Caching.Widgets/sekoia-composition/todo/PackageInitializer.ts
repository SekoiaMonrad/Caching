import $ = require("jquery");

class PackageInitializer implements UiComposition.IPackageInitializer {
    public initialize(context: UiComposition.IPackageInitializerContext): JQueryPromise<any>
    {
        console.log("initialize called with pathPrefix '" + context.pathPrefix + "'");

        // Give the package a name (i.e. ui-comp)
        context.namePackage("todo");

        // Register components
        context.registerComponent("ToDoManager");
        //context.registerComponent("manager");

        // Register widgets
        context.registerWidget("CompleteToDoLauncher");
        context.registerWidget("CreateToDoLauncher");
        context.registerWidget("CreateUpdateToDoDialog");
        context.registerWidget("EditToDoLauncher");
        context.registerWidget("ListOfCompletedToDos");
        context.registerWidget("ListOfUncompletedToDos");
        context.registerWidget("ToDoInfo");

        // Register services
        //context.registerService("some-service");

        return $.when();
    }
}

export = PackageInitializer;