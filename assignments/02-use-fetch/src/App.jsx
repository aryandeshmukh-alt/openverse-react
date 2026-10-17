import { useCallback } from "react";
import { getTodos } from "./api/todos";
import useFetch from "./hooks/useFetch";
import "./App.css";

function App() {
  const fetchTodos = useCallback(() => {
    return getTodos();
  }, []);

  const { data: todos, loading, error } = useFetch(fetchTodos);

  if (loading) {
    return (
      <div className="app">
        <h1>Todo List</h1>
        <p className="loader">Loading todos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <h1>Todo List</h1>
        <div className="error-banner">Failed to fetch todos. Please try again.</div>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Todo List</h1>

      <ul className="todo-list">
        {todos.map((todo) => (
          <li key={todo.id} className="todo-item">
            <input type="checkbox" checked={todo.completed} readOnly />
            <span className={todo.completed ? "completed" : ""}>{todo.title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;