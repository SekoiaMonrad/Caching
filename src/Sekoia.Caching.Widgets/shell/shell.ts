import router = require("plugins/router");
import IMenu = require("./IMenu");
import ko = require("knockout");
import rest = require("sekoia/rest");

class Shell {
    public router = router;
    public menus = ko.observable<IMenu[]>(<Array<any>>[]);

    public activate()
    {
        return rest.get("/api/menu")
            .toObservable<IMenu>()
            .toArray()
            .subscribe((menus: IMenu[]) =>
            {
                this.menus(menus);

                var routes: DurandalRouteConfiguration[] = [
                    {
                        route: "",
                        title: "Home",
                        moduleId: "home/home",
                        nav: true
                    },
                    {
                        route: "ui-comp",
                        title: "UI Composition",
                        moduleId: "home/ui-comp/configuration/configuration",
                        nav: true
                    }
                ];

                for (var i = 0; i < menus.length; i++)
                {
                    var menu = menus[i];
                    for (var j = 0; j < menu.pages.length; j++)
                    {
                        var page = menu.pages[j];

                        routes.push({
                            route: page.route,
                            title: page.name,
                            moduleId: page.moduleId,
                            nav: true
                        });
                    }
                }

                router.map(routes)
                    .buildNavigationModel();

                return router.activate();
            });
    }
}

export = Shell;