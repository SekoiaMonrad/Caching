using System.Threading;
using System.Threading.Tasks;
using Nancy;

namespace Sekoia.WidgetsTester.Api.Chaos
{
    public interface IFailureStrategy
    {
        Task ExecuteAsync(NancyContext ctx, CancellationToken ct);
    }
}