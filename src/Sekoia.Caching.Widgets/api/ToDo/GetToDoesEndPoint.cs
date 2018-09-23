using System;
using System.Linq;
using JetBrains.Annotations;
using Nancy;
using Nancy.ModelBinding;
using Nancy.Responses.Negotiation;

namespace Sekoia.Caching.Widgets.api.ToDo
{
    public class GetToDoesEndPoint : NancyModule
    {
        private readonly ToDoDataStore _dataStore;

        public GetToDoesEndPoint(string modulePath, [NotNull] ToDoDataStore dataStore)
            : base(modulePath)
        {
            if (dataStore == null)
                throw new ArgumentNullException(nameof(dataStore));

            _dataStore = dataStore;

            Get["{id}"] = _ => GetById(this.Bind<GetByIdRequest>());
            Get["/uncompleted"] = _ => GetAllUncompleted();
            Get["/completed"] = _ => GetAllCompleted();
        }

        private ToDoResponse[] GetAllCompleted()
        {
            return _dataStore.GetAllCompleted()
                             .Select(ToDoResponse.From)
                             .ToArray();
        }

        private ToDoResponse[] GetAllUncompleted()
        {
            return _dataStore.GetAllUncompleted()
                             .Select(ToDoResponse.From)
                             .ToArray();
        }

        private Negotiator GetById(GetByIdRequest request)
        {
            if (request.Id.IsNullOrWhitespace())
                return Negotiate.WithStatusCode(HttpStatusCode.BadRequest);

            var todo = _dataStore.FindById(request.Id);
            if (todo == null)
                return Negotiate.WithStatusCode(HttpStatusCode.NotFound);

            return Negotiate.WithModel(ToDoResponse.From(todo))
                            .WithStatusCode(HttpStatusCode.OK);
        }

        public class GetByIdRequest
        {
            public string Id { get; set; }
        }

        public class ToDoResponse
        {
            public string Id { get; set; }
            public bool IsCompleted { get; set; }
            public string Title { get; set; }

            public static ToDoResponse From(ToDo todo)
            {
                return new ToDoResponse
                       {
                           Id = todo.Id,
                           Title = todo.Title,
                           IsCompleted = todo.IsCompleted
                       };
            }
        }
    }
}