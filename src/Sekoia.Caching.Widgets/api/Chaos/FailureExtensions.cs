using System.Threading;
using System.Threading.Tasks;
using Nancy;

namespace Sekoia.WidgetsTester.Api.Chaos
{
    public static class FailureExtensions
    {
        public static async Task ExecuteIfRelevantAsync(this Failure failure, FailureTime currentTime, NancyContext ctx, CancellationToken ct)
        {
            if (failure == null)
                return;

            if (failure.Time != currentTime)
                return;

            await failure.Type.ExecuteAsync(ctx, ct);
        }
    }
}