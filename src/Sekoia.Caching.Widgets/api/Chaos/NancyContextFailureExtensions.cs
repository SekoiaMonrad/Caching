using System;
using JetBrains.Annotations;
using Nancy;

namespace Sekoia.WidgetsTester.Api.Chaos
{
    public static class NancyContextFailureExtensions
    {
        private static readonly string _failureKey = typeof(NancyContextFailureExtensions).AssemblyQualifiedName;

        public static Failure GetFailure([NotNull] this NancyContext ctx)
        {
            if (ctx == null)
                throw new ArgumentNullException(nameof(ctx));

            return ctx.Items[_failureKey] as Failure;
        }

        public static void SetFailure([NotNull] this NancyContext ctx, [NotNull] Failure failure)
        {
            if (ctx == null)
                throw new ArgumentNullException(nameof(ctx));

            ctx.Items[_failureKey] = failure;
        }
    }
}