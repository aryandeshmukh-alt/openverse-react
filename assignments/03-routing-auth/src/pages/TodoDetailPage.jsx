import { useParams, Link } from 'react-router-dom';
import { useFetch } from '../hooks/useFetch';

export function TodoDetailPage() {
  const { id } = useParams();
  const { data: todo, loading, error } = useFetch(
    id ? `https://jsonplaceholder.typicode.com/todos/${id}` : null
  );

  if (loading) {
    return <div style={styles.message}>⏳ Loading...</div>;
  }

  if (error) {
    return <div style={styles.error}>❌ Error: {error}</div>;
  }

  if (!todo) {
    return <div style={styles.message}>❌ Todo not found</div>;
  }

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>
        ← Back to todos
      </Link>

      <div style={styles.card}>
        <div style={styles.status}>
          <input
            type="checkbox"
            checked={todo.completed}
            readOnly
            style={styles.checkbox}
          />
          <span style={styles.badge}>
            {todo.completed ? '✅ Completed' : '⏳ Pending'}
          </span>
        </div>

        <h1>{todo.title}</h1>

        <div style={styles.details}>
          <div style={styles.detail}>
            <strong>ID:</strong> {todo.id}
          </div>
          <div style={styles.detail}>
            <strong>User ID:</strong> {todo.userId}
          </div>
          <div style={styles.detail}>
            <strong>Status:</strong>{' '}
            {todo.completed ? 'Completed ✓' : 'Pending'}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '600px',
    margin: '0 auto',
    padding: '1rem',
  },
  backLink: {
    color: '#61dafb',
    textDecoration: 'none',
    fontSize: '1rem',
    marginBottom: '1.5rem',
    display: 'inline-block',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  },
  status: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  checkbox: {
    width: '24px',
    height: '24px',
    cursor: 'pointer',
  },
  badge: {
    padding: '0.25rem 0.75rem',
    borderRadius: '20px',
    fontSize: '0.9rem',
    fontWeight: 'bold',
    backgroundColor: '#eee',
  },
  details: {
    marginTop: '1.5rem',
    paddingTop: '1.5rem',
    borderTop: '1px solid #eee',
  },
  detail: {
    padding: '0.75rem 0',
    fontSize: '1rem',
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
};
