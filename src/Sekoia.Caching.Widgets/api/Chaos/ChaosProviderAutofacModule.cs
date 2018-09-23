using Autofac;

namespace Sekoia.WidgetsTester.Api.Chaos
{
    public class ChaosProviderAutofacModule : Module
    {
        protected override void Load(ContainerBuilder builder)
        {
            builder.RegisterAssemblyTypes(GetType().Assembly)
                   .Where(t => typeof(IFailureStrategy).IsAssignableFrom(t))
                   .As<IFailureStrategy>();

            builder.RegisterType<DefaultFailureGenerator>().As<IFailureGenerator>();
        }
    }
}