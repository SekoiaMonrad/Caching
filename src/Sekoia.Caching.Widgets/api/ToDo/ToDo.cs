using System;

namespace Sekoia.Caching.Widgets.api.ToDo
{
    public class ToDo
    {
        public string Id { get; }
        public bool IsCompleted { get; set; }
        public string Title { get; set; }

        public ToDo(string id = null)
        {
            Id = id ?? Guid.NewGuid().ToString();
        }
    }
}