using System;
using System.Collections.Generic;
using System.Collections.Immutable;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using JetBrains.Annotations;
using Nancy;
using Nancy.Extensions;

namespace Sekoia.WidgetsTester.Api.Chaos
{
    public class DefaultFailureGenerator : IFailureGenerator
    {
        private static readonly Random _rnd = new Random();
        private readonly double _failureRate;
        private readonly ImmutableList<Func<NancyContext, CancellationToken, IFailureStrategy>> _failureStrategyFactories;

        private readonly ImmutableList<FailureTime> _failureTimes = Enum.GetValues(typeof(FailureTime))
                                                                        .Cast<FailureTime>()
                                                                        .ToImmutableList();

        public DefaultFailureGenerator([NotNull] IEnumerable<Func<NancyContext, CancellationToken, IFailureStrategy>> failureStrategyFactories, double failureRate = 0.05)
        {
            _failureRate = failureRate;
            if (failureStrategyFactories == null)
                throw new ArgumentNullException(nameof(failureStrategyFactories));

            _failureStrategyFactories = failureStrategyFactories.ToImmutableList();
        }

        public Task<Failure> GenerateFailureAsync(NancyContext ctx, CancellationToken ct)
        {
            return Task.FromResult(GenerateFailure(ctx, ct));
        }

        private Failure GenerateFailure(NancyContext ctx, CancellationToken ct)
        {
            if (!ctx.IsAjaxRequest())
                return null;
            if (ctx.Request.Url.Path.StartsWith("/api/testing"))
                return null;

            if (_rnd.NextDouble() > _failureRate)
                return null;

            var failureStrategyFactory = GetRandomFailureStrategyFactory();

            var failure = new Failure(GetRandomFailureTime(),
                                      failureStrategyFactory(ctx, ct));
            return failure;
        }

        private Func<NancyContext, CancellationToken, IFailureStrategy> GetRandomFailureStrategyFactory()
        {
            return _failureStrategyFactories[_rnd.Next(_failureStrategyFactories.Count)];
        }

        private FailureTime GetRandomFailureTime()
        {
            return _failureTimes[_rnd.Next(_failureTimes.Count)];
        }
    }
}