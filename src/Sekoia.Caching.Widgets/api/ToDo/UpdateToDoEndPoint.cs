using System;
using JetBrains.Annotations;
using Nancy;
using Nancy.ModelBinding;

namespace Sekoia.Caching.Widgets.api.ToDo
{
    public class UpdateToDoEndPoint : NancyModule
    {
        private readonly ToDoDataStore _dataStore;

        public UpdateToDoEndPoint(string modulePath, [NotNull] ToDoDataStore dataStore)
            : base(modulePath)
        {
            if (dataStore == null)
                throw new ArgumentNullException(nameof(dataStore));

            _dataStore = dataStore;

            Put["{id}"] = _ => Handle(this.Bind<UpdateToDoRequest>());
        }

        private HttpStatusCode Handle([NotNull] UpdateToDoRequest request)
        {
            if (request.Id.IsNullOrWhitespace())
                return HttpStatusCode.BadRequest;
            if (request.NewTitle.IsNullOrWhitespace())
                return HttpStatusCode.BadRequest;

            _dataStore.Update(request.Id, request.NewTitle);
            return HttpStatusCode.NoContent;
        }

        public class UpdateToDoRequest
        {
            public string Id { get; set; }
            public string NewTitle { get; set; }
        }
    }
}