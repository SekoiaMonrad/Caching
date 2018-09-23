declare module UiComposition {
    export interface IWidgetPackage {
        id: string;
        version: string;
        componentImplementationSets: IComponentImplementationSet[];
    }

    export interface IComponentImplementationSet {
        name: string;
        components: IComponentImplementation[];
    }

    export interface IComponentImplementation {
        name: string;
        value: string;
    }

    export interface IUiCompositionConfiguration {
        allowPrereleaseVersions: boolean;
        skipUiCompositionPackage: boolean;
        packageTag: string;
        rootPath: string;
        repositories: string[];
        devRepository: string;
        widgetPackages: IWidgetPackage[];
    }

    export interface IManager {
        getConfiguration(): Rx.Observable<IUiCompositionConfiguration>;
        updateConfiguration(configuration: IUiCompositionConfiguration): JQueryPromise<string>;

        getPackageVersions(packageId: string, currentVersion?: string): Rx.Observable<string>;
        getAvailablePackages(): Rx.Observable<string>;
    }
}﻿declare module "ui-comp/manager" {
    var theModule: UiComposition.IManager;
    export = theModule;
}﻿declare module UiComposition {
    export interface IManagerConfiguration {
        restPrefix: string;
    }
}﻿declare module "ui-comp/managerConfiguration" {
    var theModule: UiComposition.IManagerConfiguration;
    export = theModule;
}﻿declare module UiComposition
{
    export interface ICacheBusterStrategy
    {
        (url: string): string;
    }
}

declare module "text"
{
    export function get(url: any, callback: any, errback: any, headers: any);
}﻿declare module UiComposition
{
    export interface IPackageInitializer
    {
        initialize(context: IPackageInitializerContext): JQueryPromise<any>
    }
}declare module UiComposition
{
    export interface IPackageInitializerContext
    {
        pathPrefix: string;
        requirejs: Require;

        namePackage(packageName: string): void;

        componentImplementations(componentName: string, defaultImplementation?: string): string;

        registerWidget(name: string): void;
        registerComponent(componentName: string, componentPath?: string, defaultImplementation?: string): void;
        registerExtension(extensionName: string, extensionPath?: string, defaultImplementation?: string): void;
        registerService(serviceName: string, servicePath?: string, defaultImplementation?: string): void;

        registerUIComponent(uiComponentName: string, uiComponentPath?: string, loadCssStylesheet?: boolean): void;
        registerUIComponent(uiComponentName: string, loadCssStylesheet: boolean): void;
    }
}