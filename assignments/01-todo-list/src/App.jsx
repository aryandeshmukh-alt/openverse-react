import { useState } from "react";
import "./App.css";

function App () {
  
  const [todos, setTodos] = useState([
    {
      id: 1,
      title: "Learn React",
      completed: false,
    },
    {
      id: 2,
      title: "Learn Go",
      completed: false,
    },
    {
      id: 3,
      title: "Learn RoR",
      completed: false,
    },
  ]);

  function toggleTodo (id) {
    setTodos(
      todos.map((todo) => 
        todo.id === id
          ? { ...todo, completed: !todo.completed}
          : todo
      )
    );
  }

  function deleteTodo (id) {
    setTodos(todos.filter((todo) => todo.id !== id));
  }

  return (
    <div className="app">
      <div className="todo-container">
        <h1> Todo List </h1>
        <div className="todo-list">
          {todos.map((todo) => (
            <div className="todo-item" key={todo.id}>
              <div className="todo-content">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                />
                <span className={todo.completed ? "completed" : ""}>
                  {todo.title}
                </span>
              </div>
              <button onClick={ () => deleteTodo(todo.id)}>
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;