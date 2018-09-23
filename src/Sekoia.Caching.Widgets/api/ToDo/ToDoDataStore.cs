using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;

namespace Sekoia.Caching.Widgets.api.ToDo
{
    public class ToDoDataStore
    {
        private readonly ConcurrentDictionary<string, ToDo> _todos = new ConcurrentDictionary<string, ToDo>();

        public void Complete(string id)
        {
            ToDo todo;
            if (!_todos.TryGetValue(id, out todo))
                throw new ArgumentOutOfRangeException(nameof(id));

            todo.IsCompleted = true;
        }

        public ToDo Create(string title)
        {
            var todo = new ToDo
                       {
                           Title = title
                       };
            _todos[todo.Id] = todo;

            return todo;
        }

        public void Delete(string id)
        {
            ToDo todo;
            _todos.TryRemove(id, out todo);
        }

        public ToDo FindById(string id)
        {
            ToDo todo;
            _todos.TryGetValue(id, out todo);
            return todo;
        }

        public IEnumerable<ToDo> GetAllCompleted()
        {
            return _todos.Values
                         .Where(t => t.IsCompleted)
                         .Execute();
        }

        public IEnumerable<ToDo> GetAllUncompleted()
        {
            return _todos.Values
                         .Where(t => !t.IsCompleted)
                         .Execute();
        }

        public void Update(string id, string newTitle)
        {
            ToDo todo;
            if (!_todos.TryGetValue(id, out todo))
                throw new ArgumentOutOfRangeException(nameof(id));

            todo.Title = newTitle;
        }
    }
}