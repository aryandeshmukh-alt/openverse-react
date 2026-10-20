import { Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';
import { useAuth } from '../context/AuthContext';

export function HomePage() {
  const { isLoggedIn } = useAuth();
  const { data: todos, loading, error } = useFetch(
    'https://jsonplaceholder.typicode.com/todos?_limit=10'
  );

  if (loading) {
    return <div style={styles.message}> Loading todos...</div>;
  }

  if (error) {
    return <div style={styles.error}>❌ Error: {error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>📝 My Todos</h1>
        {isLoggedIn && (
          <Link to="/add-todo" style={styles.addButton}>
            ➕ Add New Todo
          </Link>
        )}
      </div>

      {!todos || todos.length === 0 ? (
        <p style={styles.message}>No todos yet</p>
      ) : (
        <div style={styles.todoList}>
          {todos.map((todo) => (
            <Link
              key={todo.id}
              to={`/todos/${todo.id}`}
              style={styles.todoItem}
            >
              <div style={styles.todoContent}>
                <input
                  type="checkbox"
                  checked={todo.completed}
                  readOnly
                  style={styles.checkbox}
                />
                <span
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#999' : '#000',
                  }}
                >
                  {todo.title}
                </span>
              </div>
              <span style={styles.arrow}>→</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: '1rem',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
  },
  addButton: {
    backgroundColor: '#61dafb',
    color: '#282c34',
    padding: '0.75rem 1.5rem',
    borderRadius: '4px',
    textDecoration: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  todoList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  todoItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px',
    border: '1px solid #eee',
    textDecoration: 'none',
    color: '#000',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  todoContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    flex: 1,
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
  },
  message: {
    textAlign: 'center',
    color: '#666',
    fontSize: '1.1rem',
    padding: '2rem',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c00',
    padding: '1rem',
    borderRadius: '4px',
    textAlign: 'center',
  },
  arrow: {
    color: '#999',
    fontSize: '1.5rem',
  },
};
