using System;
using System.IO;
using System.Linq;
using JetBrains.Annotations;
using Nancy;
using Sekoia.ServiceModel;

namespace Sekoia.WidgetsTester.Api
{
    public class MenuModule : NancyModule
    {
        private readonly IWebAppRootProvider _rootPathProvider;

        public MenuModule(IWebAppRootProvider rootPathProvider)
            : base("/api/menu")
        {
            if (rootPathProvider == null)
                throw new ArgumentNullException(nameof(rootPathProvider));

            _rootPathProvider = rootPathProvider;
            Get[""] = GetMenu;
        }

        private object GetMenu(object arg)
        {
            var scaffoldsRoot = Path.Combine(_rootPathProvider.GetRootPath(), @"scaffolds");

            var scaffoldsRootDirInfo = new DirectoryInfo(scaffoldsRoot);
            if (!scaffoldsRootDirInfo.Exists)
                scaffoldsRootDirInfo.Create();

            return scaffoldsRootDirInfo.GetDirectories()
                                       .Select(md => new Menu
                                                     {
                                                         Name = md.Name,
                                                         Pages = md.GetDirectories()
                                                                   .Select(pd => new MenuItem
                                                                                 {
                                                                                     Name = pd.Name,
                                                                                     Route = md.Name + "/" + pd.Name,
                                                                                     ModuleId = "scaffolds/" + md.Name + "/" + pd.Name + "/" + pd.Name
                                                                                 })
                                                                   .ToArray()
                                                     })
                                       .ToArray();
        }

        private class Menu
        {
            public string Name
            {
                [UsedImplicitly]
                get;
                set;
            }

            public MenuItem[] Pages
            {
                [UsedImplicitly]
                get;
                set;
            }
        }

        private class MenuItem
        {
            public string ModuleId
            {
                [UsedImplicitly]
                get;
                set;
            }

            public string Name
            {
                [UsedImplicitly]
                get;
                set;
            }

            public string Route
            {
                [UsedImplicitly]
                get;
                set;
            }
        }
    }
}