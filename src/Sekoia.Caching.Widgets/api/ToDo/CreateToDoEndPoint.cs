using System;
using JetBrains.Annotations;
using Nancy;
using Nancy.ModelBinding;

namespace Sekoia.Caching.Widgets.api.ToDo
{
    public class CreateToDoEndPoint : NancyModule
    {
        private readonly ToDoDataStore _dataStore;

        public CreateToDoEndPoint(string modulePath, [NotNull] ToDoDataStore dataStore)
            : base(modulePath)
        {
            if (dataStore == null)
                throw new ArgumentNullException(nameof(dataStore));

            _dataStore = dataStore;

            Post[""] = _ => Handle(this.Bind<CreateToDoRequest>());
        }

        private HttpStatusCode Handle([NotNull] CreateToDoRequest request)
        {
            if (request.Title.IsNullOrWhitespace())
                return HttpStatusCode.BadRequest;

            _dataStore.Create(request.Title);
            return HttpStatusCode.NoContent;
        }

        public class CreateToDoRequest
        {
            public string Title { get; set; }
        }
    }
}