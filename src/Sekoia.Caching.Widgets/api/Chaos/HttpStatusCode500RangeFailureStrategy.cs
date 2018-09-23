using System;
using System.Collections.Immutable;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Nancy;
using Nancy.Responses;

namespace Sekoia.WidgetsTester.Api.Chaos
{
    public class HttpStatusCode500RangeFailureStrategy : IFailureStrategy
    {
        private static readonly ImmutableList<HttpStatusCode> _relevantHttpStatusCodes = Enum.GetValues(typeof(HttpStatusCode))
                                                                                             .Cast<HttpStatusCode>()
                                                                                             .Where(hsc => (int)hsc >= 500 && (int)hsc < 600)
                                                                                             .ToImmutableList();

        private static readonly Random _rnd = new Random();

        public Task ExecuteAsync(NancyContext ctx, CancellationToken ct)
        {
            ctx.Response = new JsonResponse(new
                                            {
                                                error = "chaos generated",
                                                timestamp = DateTimeOffset.Now
                                            },
                                            new DefaultJsonSerializer())
                           {
                               StatusCode = GetRandomHttpStatusCode()
                           };
            return Task.FromResult(ctx.Response);
        }

        private static HttpStatusCode GetRandomHttpStatusCode()
        {
            return _relevantHttpStatusCodes[_rnd.Next(_relevantHttpStatusCodes.Count)];
        }
    }
}