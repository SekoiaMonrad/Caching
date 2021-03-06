﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Reactive.Concurrency;
using System.Reactive.Linq;
using System.Reactive.Threading.Tasks;
using System.Threading;
using System.Threading.Tasks;
using Caching.Test;
using JetBrains.Annotations;
using Xunit;
using Xunit.Abstractions;

namespace Sekoia.Caching.Test
{
    public class ArrayCacheConcurrentRefreshesTest
    {
        private readonly ITestOutputHelper _testOutputHelper;

        public ArrayCacheConcurrentRefreshesTest([NotNull] ITestOutputHelper testOutputHelper)
        {
            _testOutputHelper = testOutputHelper ?? throw new ArgumentNullException(nameof(testOutputHelper));
        }

        [Theory]
        [AutoMoqData]
        public void TestConcurrentRefreshesArePerformedSequentially(string[] keys)
        {
            int elementRetrieverCalls = 0;
            var mutex = new object();
            var waitHandleContinueInRetriever = new ManualResetEvent(false);
            var waitHandleInsideRetrieverMutexZone = new ManualResetEvent(false);
            var mutexZoneWasViolated = false;

            var arrayCache = CacheBuilder.For<string>()
                                         .WithIdExtractor(v => v)
                                         .WithElementRetriever(v => Task.FromResult($"{v}-{Interlocked.Increment(ref elementRetrieverCalls)}"))
                                         .GetArrayCache<string[]>(keys2 =>
                                                                  {
                                                                      return Task.Run(() =>
                                                                                      {
                                                                                          var tryEnter = Monitor.TryEnter(mutex);
                                                                                          if (!tryEnter)
                                                                                              mutexZoneWasViolated = true;

                                                                                          Assert.True(tryEnter, "Unable to get elementer retriever mutex.");
                                                                                          try
                                                                                          {
                                                                                              waitHandleInsideRetrieverMutexZone.Set();
                                                                                              waitHandleContinueInRetriever.WaitOne();

                                                                                              return keys2.ToObservable()
                                                                                                          .Select(key => $"{key}-{Interlocked.Increment(ref elementRetrieverCalls)}");
                                                                                          }
                                                                                          finally
                                                                                          {
                                                                                              Monitor.Exit(mutex);
                                                                                          }
                                                                                      })
                                                                                 .ToObservable()
                                                                                 .SelectMany(x => x);
                                                                  });

            var values = new List<IEnumerable<string>>();
            Exception exception = null;

            using (arrayCache.Get(keys)
                             .SubscribeOn(TaskPoolScheduler.Default)
                             .ObserveOn(TaskPoolScheduler.Default)
                             .Subscribe(v => { values.Add(v); },
                                        e => exception = e))
            {
                waitHandleContinueInRetriever.Set();
                while (values.Count == 0)
                    Thread.Sleep(100);
                Assert.Single(values);

                waitHandleContinueInRetriever.Reset();
                waitHandleInsideRetrieverMutexZone.Reset();

                arrayCache.Refresh(keys);
                arrayCache.Refresh(keys);
                arrayCache.Refresh(keys);
                arrayCache.Refresh(keys);
                arrayCache.Refresh(keys);

                Assert.Null(exception);
                Assert.False(mutexZoneWasViolated);

                waitHandleInsideRetrieverMutexZone.WaitOne();
                waitHandleContinueInRetriever.Set();

                while (values.Count < 2 && exception == null)
                {
                    Thread.Sleep(100);
                }

                Assert.Null(exception);
                Assert.True(values.Count > 1);
                Assert.False(mutexZoneWasViolated);

                Assert.Equal(keys.Select(key => $"{key}-{elementRetrieverCalls}")
                                 .Last(),
                             values.Last()
                                   .Last());
            }

            //_testOutputHelper.WriteLine($"values: {values.Select(i => i.Join("|")) .Join(", ")}");
        }

        [Theory]
        [AutoMoqData]
        public void TestConcurrentRefreshesArePerformedSequentially_Continously(string[] keys)
        {
            for (int i = 0; i < 30; i++)
            {
                TestConcurrentRefreshesArePerformedSequentially(keys);
            }
        }
    }
}
