using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.RegularExpressions;
using NuGet;
using Sekoia.ServiceModel;

namespace Sekoia.Caching.Widgets.api.ToDo
{
    public class ToDoServiceEntryPoint : IServiceEntryPoint
    {
        private static readonly Random _rnd = new Random();

        public void Initialize(IRegistry registry)
        {
            var modulePath = "/api/todos/";
            var dataStore = new ToDoDataStore();

            CreateRandomToDos(dataStore);

            registry.RegisterNancyEndPoint(() => new CreateToDoEndPoint(modulePath, dataStore));
            registry.RegisterNancyEndPoint(() => new CompleteToDoEndPoint(modulePath, dataStore));
            registry.RegisterNancyEndPoint(() => new UpdateToDoEndPoint(modulePath, dataStore));
            registry.RegisterNancyEndPoint(() => new DeleteToDoEndPoint(modulePath, dataStore));
            registry.RegisterNancyEndPoint(() => new GetToDoesEndPoint(modulePath, dataStore));
        }

        private static void CreateRandomToDos(ToDoDataStore dataStore)
        {
            foreach (var thingToDo in GetRandomThingsToDo())
            {
                var toDo = dataStore.Create(thingToDo);

                if (_rnd.NextDouble() < 0.5)
                    dataStore.Complete(toDo.Id);
            }
        }

        private static IEnumerable<string> GetRandomThingsToDo()
        {
            string content;
            using (var response = WebRequest.CreateHttp("http://www.randomthingstodo.com")
                                            .GetResponse())
            using (var responseStream = response.GetResponseStream())
                content = responseStream.ReadToEnd();

            var startMarker = @"<div class='listLine text-left'><p>";
            var endMarker = "</p><div";

            var matches = Regex.Matches(content, startMarker + @"\d+\)(?<thingToDo>.*?)" + endMarker);
            var thingsToDo = matches.Cast<Match>()
                                          .Select(m => m.Groups["thingToDo"].Value.Trim())
                                          .ToList();
            return thingsToDo;
        }
    }
}
