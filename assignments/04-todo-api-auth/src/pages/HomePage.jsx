import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTodos } from '../api/todos';
import { colors, typography } from '../styles/colors';

export function HomePage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, refreshAccessToken, logout } = useAuth();

  useEffect(() => {
    async function fetchTodos() {
      try {
        const data = await getTodos(token);
        setTodos(data);
      } catch (err) {
        if (err.message === 'UNAUTHORIZED') {
          const newToken = await refreshAccessToken();
          if (newToken) {
            try {
              const data = await getTodos(newToken);
              setTodos(data);
            } catch (retryErr) {
              setError('Failed to load todos');
            }
          } else {
            logout();
          }
        } else {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    }

    fetchTodos();
  }, []);

  if (loading) {
    return <div style={styles.center}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.center}>{error}</div>;
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>My Todos</h1>
        <Link to="/add" style={styles.addButton}>
          Add Todo
        </Link>
      </div>

      {todos.length === 0 ? (
        <p style={styles.empty}>No todos yet. Add one above.</p>
      ) : (
        <ul style={styles.list}>
          {todos.map((todo) => (
            <li key={todo.id} style={styles.item}>
              <Link to={`/todos/${todo.id}`} style={styles.itemLink}>
                <span style={styles.itemTitle}>{todo.title}</span>
                {todo.dueDate && (
                  <span style={styles.dueDate}>Due: {todo.dueDate}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '24px 16px',
    fontFamily: typography.fontFamily,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  title: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.gray800,
    margin: 0,
  },
  addButton: {
    padding: '8px 16px',
    backgroundColor: colors.primary.main,
    color: colors.neutral.white,
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
  },
  list: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  item: {
    backgroundColor: colors.neutral.white,
    border: `1px solid ${colors.neutral.gray300}`,
    borderRadius: '6px',
  },
  itemLink: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
    textDecoration: 'none',
  },
  itemTitle: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray800,
  },
  dueDate: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.gray600,
  },
  empty: {
    color: colors.neutral.gray600,
    fontSize: typography.fontSize.base,
    textAlign: 'center',
    marginTop: '48px',
  },
  center: {
    textAlign: 'center',
    marginTop: '48px',
    color: colors.neutral.gray600,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.base,
  },
};
