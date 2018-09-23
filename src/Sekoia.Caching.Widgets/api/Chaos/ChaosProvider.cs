using System;
using System.Configuration;
using System.Threading;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Nancy;
using Nancy.Bootstrapper;

namespace Sekoia.WidgetsTester.Api.Chaos
{
    public class ChaosProvider : IApplicationStartup
    {
        private readonly IFailureGenerator _failureGenerator;

        private static bool IsChaosEnabled
        {
            get
            {
                var chaosSetting = ConfigurationManager.AppSettings["Chaos"];
                bool isChaosEnabled;
                bool.TryParse(chaosSetting, out isChaosEnabled);
                return isChaosEnabled;
            }
        }

        public ChaosProvider([NotNull] IFailureGenerator failureGenerator)
        {
            if (failureGenerator == null)
                throw new ArgumentNullException(nameof(failureGenerator));

            _failureGenerator = failureGenerator;
        }

        public void Initialize(IPipelines pipelines)
        {
            if (!IsChaosEnabled)
                return;

            pipelines.BeforeRequest.AddItemToStartOfPipeline(StartOfBeforeRequest);
            pipelines.BeforeRequest.AddItemToEndOfPipeline(EndOfBeforeRequest);
            pipelines.AfterRequest.AddItemToStartOfPipeline(StartOfAfterRequest);
            pipelines.AfterRequest.AddItemToEndOfPipeline(EndOfAfterRequest);
        }

        private async Task<Response> StartOfBeforeRequest(NancyContext ctx, CancellationToken ct)
        {
            ctx.SetFailure(await _failureGenerator.GenerateFailureAsync(ctx, ct));

            await ctx.GetFailure().ExecuteIfRelevantAsync(FailureTime.StartOfBeforeRequest, ctx, ct);
            return ctx.Response;
        }

        private static async Task EndOfAfterRequest(NancyContext ctx, CancellationToken ct)
        {
            await ctx.GetFailure().ExecuteIfRelevantAsync(FailureTime.EndOfAfterRequest, ctx, ct);
        }

        private static async Task<Response> EndOfBeforeRequest(NancyContext ctx, CancellationToken ct)
        {
            await ctx.GetFailure().ExecuteIfRelevantAsync(FailureTime.EndOfBeforeRequest, ctx, ct);
            return ctx.Response;
        }

        private static async Task StartOfAfterRequest(NancyContext ctx, CancellationToken ct)
        {
            await ctx.GetFailure().ExecuteIfRelevantAsync(FailureTime.StartOfAfterRequest, ctx, ct);
        }
    }
}