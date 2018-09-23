requirejs.config({
    waitSeconds: 5 * 60,
    paths: {
        "durandal": "//sekoiadata.blob.core.windows.net/web/cdn/durandal/2.1.0",
        "plugins": "//sekoiadata.blob.core.windows.net/web/cdn/durandal/2.1.0/plugins",
        "transitions": "//sekoiadata.blob.core.windows.net/web/cdn/durandal/2.1.0/transitions",
        "knockout": "//cdnjs.cloudflare.com/ajax/libs/knockout/3.3.0/knockout-min",
        "jquery": "//code.jquery.com/jquery-2.1.4.min",
        "jqueryui": "//ajax.googleapis.com/ajax/libs/jqueryui/1.11.4/jquery-ui.min",
        "bootstrap": "//maxcdn.bootstrapcdn.com/bootstrap/3.3.4/js/bootstrap.min",
        "linqjs": "//az509936.vo.msecnd.net/web/administration/js/plugin/linq/3.0.4-Beta5/linq.min",
        
        "plugins/bootstrapModal": "/Scripts/durandal/plugins/bootstrapModal",
        "plugins/dialog.sekoia": "/Scripts/durandal/plugins/dialog.sekoia",

        "rx": "//cdnjs.cloudflare.com/ajax/libs/rxjs/2.5.2/rx.all.min",
        "moment": "//cdnjs.cloudflare.com/ajax/libs/moment.js/2.13.0/moment-with-locales.min",
        "moment-timezone": "//cdnjs.cloudflare.com/ajax/libs/moment-timezone/0.5.3/moment-timezone-with-data",
        "i18next": "//cdn.jsdelivr.net/i18next/1.8.0/i18next.min",
        "fuse": "//cdnjs.cloudflare.com/ajax/libs/fuse.js/2.2.0/fuse.min"

    },
    shim: {
        "jquery-ui": {
            exports: "$",
            deps: ["jquery"]
        },
        "i18next": {
            exports: "i18n",
            deps: ["jquery"]
        },
        "moment-timezone": {
            deps: ["moment"]
        },
        "bootstrap": {
            deps: ["jquery", "jqueryui", "i18next"]
        }
    },
    map: {
        '*': {
            "plugins/dialog": "plugins/dialog.sekoia",
        }
    }
});

define(function(require)
    {
        var system = require("durandal/system");
        var app = require("durandal/app");
        var i18n = require("i18next");
        var binder = require("durandal/binder");
        var $ = require("jquery");
        var moment = require("moment-timezone");
        require("bootstrap");

        moment.locale("da");

        system.debug(true);

        app.title = "Widgets tester";

        app.configurePlugins({
            router: true,
            'dialog.sekoia': true,
            'bootstrapModal': true,
            widget: true
        });

        // ReSharper disable once InconsistentNaming
        // Is actually a class
        var PackagesInitializer = require("sekoia-composition/Sekoia.Services.UiComposition.Compass.Widgets/loading/PackagesInitializer");

        var initializePromise = $.when();
        try
        {
            // Request to ensure backend starts
            $.ajax("/api/ui-comp/packages-to-compose");

            initializePromise = new PackagesInitializer().initialize("sekoia-composition", requirejs);
        }
        catch (e)
        {
            console.error("package initializer error: " + e);
        }

        initializePromise.then(function()
                {
                    var i18NOptions = {
                        lng: "dev",
                        resGetPath: "localizations/__lng__/__ns__.json",
                        debug: true,
                        sendMissing: true,
                        missingKeyHandler: function(lng, ns, key, fallbackValue)
                        {
                            console.error("Missing localization key: language: " + lng + ", namespace: " + ns + ", key: " + key + ", (fallback value: " + fallbackValue + ").");
                        }
                    };

                    i18n.init(i18NOptions,
                        function()
                            {
                                binder.binding = function(obj, view)
                                {
                                    $(view).i18n();
                                };

                                app.start()
                                    .then(function()
                                        {
                                            app.setRoot("shell/shell");
                                        });
                            });

                    // extend i18n.loadnamespace to return deferred
                    var i18Extended = (function(old)
                    {
                        function extendLoadNamespaces(namespaces, callback)
                        {
                            var i18NCallback = $.Deferred();
                            var args = [];
                            args.push(namespaces);
                            args.push(function()
                                {
                                    if (callback)
                                        callback();
                                    i18NCallback.resolve();
                                });
                            old.apply(namespaces, args);
                            return i18NCallback;
                        }

                        return extendLoadNamespaces;
                    })(i18n.loadNamespaces);
                    i18n.loadNamespaces = i18Extended;
                    i18n.loadNamespace = (function(ns, cb)
                    {
                        return i18n.loadNamespaces([ns], cb);
                    });
                    //# sourceMappingURL=i18next.sekoia.js.map
                })
            .fail(function()
                {
                    console.error("error in startup", arguments);
                });
    });