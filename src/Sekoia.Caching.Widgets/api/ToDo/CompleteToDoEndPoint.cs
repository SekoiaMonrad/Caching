using System;
using JetBrains.Annotations;
using Nancy;
using Nancy.ModelBinding;

namespace Sekoia.Caching.Widgets.api.ToDo
{
    public class CompleteToDoEndPoint : NancyModule
    {
        private readonly ToDoDataStore _dataStore;

        public CompleteToDoEndPoint(string modulePath, [NotNull] ToDoDataStore dataStore)
            : base(modulePath)
        {
            if (dataStore == null)
                throw new ArgumentNullException(nameof(dataStore));

            _dataStore = dataStore;

            Put["{id}/complete"] = _ => Handle(this.Bind<CompleteToDoRequest>());
        }

        private HttpStatusCode Handle([NotNull] CompleteToDoRequest request)
        {
            if (request.Id.IsNullOrWhitespace())
                return HttpStatusCode.BadRequest;

            _dataStore.Complete(request.Id);
            return HttpStatusCode.NoContent;
        }

        public class CompleteToDoRequest
        {
            public string Id { get; set; }
        }
    }
}