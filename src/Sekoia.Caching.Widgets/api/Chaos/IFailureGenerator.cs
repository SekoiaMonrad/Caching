using System.Threading;
using System.Threading.Tasks;
using Nancy;

namespace Sekoia.WidgetsTester.Api.Chaos
{
    public interface IFailureGenerator
    {
        Task<Failure> GenerateFailureAsync(NancyContext ctx, CancellationToken ct);
    }
}