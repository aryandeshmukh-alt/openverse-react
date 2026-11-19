import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTodoById } from '../api/todos';
import { colors, typography } from '../styles/colors';

export function TodoDetailPage() {
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const { token, refreshAccessToken, logout } = useAuth();

  useEffect(() => {
    async function fetchTodo() {
      try {
        const data = await getTodoById(id, token);
        setTodo(data);
      } catch (err) {
        if (err.message === 'UNAUTHORIZED') {
          const newToken = await refreshAccessToken();
          if (newToken) {
            try {
              const data = await getTodoById(id, newToken);
              setTodo(data);
            } catch (retryErr) {
              setError('Failed to load todo');
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

    fetchTodo();
  }, [id]);

  if (loading) {
    return <div style={styles.center}>Loading...</div>;
  }

  if (error) {
    return <div style={styles.center}>{error}</div>;
  }

  if (!todo) {
    return <div style={styles.center}>Todo not found.</div>;
  }

  return (
    <div style={styles.container}>
      <Link to="/" style={styles.backLink}>
        Back to todos
      </Link>

      <div style={styles.card}>
        <h1 style={styles.title}>{todo.title}</h1>

        <div style={styles.row}>
          <span style={styles.label}>Status</span>
          <span style={todo.completed ? styles.completed : styles.pending}>
            {todo.completed ? 'Completed' : 'Pending'}
          </span>
        </div>

        {todo.dueDate && (
          <div style={styles.row}>
            <span style={styles.label}>Due Date</span>
            <span style={styles.value}>{todo.dueDate}</span>
          </div>
        )}
      </div>
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
  backLink: {
    display: 'inline-block',
    marginBottom: '16px',
    color: colors.primary.main,
    textDecoration: 'none',
    fontSize: typography.fontSize.base,
  },
  card: {
    backgroundColor: colors.neutral.white,
    border: `1px solid ${colors.neutral.gray300}`,
    borderRadius: '8px',
    padding: '24px',
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.gray800,
    marginBottom: '24px',
    marginTop: 0,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderTop: `1px solid ${colors.neutral.gray100}`,
  },
  label: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray600,
    fontWeight: typography.fontWeight.medium,
  },
  value: {
    fontSize: typography.fontSize.base,
    color: colors.neutral.gray800,
  },
  completed: {
    fontSize: typography.fontSize.sm,
    color: colors.secondary.dark,
    backgroundColor: '#e8f5e9',
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: typography.fontWeight.medium,
  },
  pending: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.gray600,
    backgroundColor: colors.neutral.gray100,
    padding: '4px 10px',
    borderRadius: '12px',
    fontWeight: typography.fontWeight.medium,
  },
  center: {
    textAlign: 'center',
    marginTop: '48px',
    color: colors.neutral.gray600,
    fontFamily: typography.fontFamily,
    fontSize: typography.fontSize.base,
  },
};
