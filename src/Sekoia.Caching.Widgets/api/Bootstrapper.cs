using System;
using System.Collections.Generic;
using Autofac;
using log4net.Config;
using Nancy.Bootstrapper;
using Nancy.Responses;
using Sekoia.Caching.Widgets.api.ToDo;
using Sekoia.CodeToggling.Api;
using Sekoia.Nancy.TestUtilities;
using Sekoia.ServiceModel.NancyAutofac;
using Sekoia.Services.UiComposition.Compass;
using Sekoia.WidgetsTester.Api.Chaos;

namespace Sekoia.Caching.Widgets.api
{
    public class Bootstrapper : TestBootstrapperBase
    {
        protected override IEnumerable<Type> ServiceEntryPointTypes
        {
            get
            {
                yield return typeof(UiCompositionServiceEntryPoint);
                yield return typeof(ToDoServiceEntryPoint);
                yield return typeof(CodeTogglingApiServiceEntryPoint);
            }
        }

        static Bootstrapper()
        {
            XmlConfigurator.Configure();
        }

        protected override void ApplicationStartup(ILifetimeScope container, IPipelines pipelines)
        {
            base.ApplicationStartup(container, pipelines);

            pipelines.AfterRequest.AddItemToEndOfPipeline(context =>
                                                          {
                                                              if (context.Request.Path == "/" || context.Request.Path == "/index.html")
                                                                  context.Response = new GenericFileResponse(".\\index.html", context);
                                                          });
        }

        protected override void ConfigureApplicationContainer(ILifetimeScope container)
        {
            base.ConfigureApplicationContainer(container);

            var containerBuilder = new ContainerBuilder();

            containerBuilder.RegisterModule<DefaultServiceModelAutofacModule>();
            containerBuilder.RegisterModule<ChaosProviderAutofacModule>();

            containerBuilder.RegisterType<UnrestrictedAccessValidator>()
                            .As<IAccessValidator>()
                            .SingleInstance();

#pragma warning disable 618
            containerBuilder.Update(container.ComponentRegistry);
#pragma warning restore 618
        }

        protected override bool IncludeInAutomaticNancyModuleDiscovery(Type type)
        {
            return type.Assembly == GetType()
                       .Assembly
                   && type.FullName.IndexOf("ToDo", StringComparison.Ordinal) == -1;
        }
    }
}
