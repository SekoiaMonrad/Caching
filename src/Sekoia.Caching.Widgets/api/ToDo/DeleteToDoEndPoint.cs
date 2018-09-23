using System;
using JetBrains.Annotations;
using Nancy;
using Nancy.ModelBinding;

namespace Sekoia.Caching.Widgets.api.ToDo
{
    public class DeleteToDoEndPoint : NancyModule
    {
        private readonly ToDoDataStore _dataStore;

        public DeleteToDoEndPoint(string modulePath, [NotNull] ToDoDataStore dataStore)
            : base(modulePath)
        {
            if (dataStore == null)
                throw new ArgumentNullException(nameof(dataStore));

            _dataStore = dataStore;

            Delete["{id}"] = _ => Handle(this.Bind<DeleteToDoRequest>());
        }

        private HttpStatusCode Handle([NotNull] DeleteToDoRequest request)
        {
            if (request.Id.IsNullOrWhitespace())
                return HttpStatusCode.BadRequest;

            _dataStore.Delete(request.Id);
            return HttpStatusCode.NoContent;
        }

        public class DeleteToDoRequest
        {
            public string Id { get; set; }
        }
    }
}