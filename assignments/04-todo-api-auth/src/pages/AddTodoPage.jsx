import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createTodo } from '../api/todos';
import { colors, typography } from '../styles/colors';

export function AddTodoPage() {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { token, refreshAccessToken } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'title') setTitle(value);
    if (name === 'dueDate') setDueDate(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await createTodo(title, dueDate, token);
      navigate('/');
    } catch (err) {
      if (err.message === 'UNAUTHORIZED') {
        const newToken = await refreshAccessToken();
        if (newToken) {
          try {
            await createTodo(title, dueDate, newToken);
            navigate('/');
          } catch (retryErr) {
            setError('Failed to create todo after authentication refresh');
            setLoading(false);
          }
        } else {
          setError('Session expired. Please login again.');
          navigate('/login');
        }
      } else {
        setError(err.message);
        setLoading(false);
      }
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create New Todo</h1>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="title" style={styles.label}>
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              style={styles.input}
              disabled={loading}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="dueDate" style={styles.label}>
              Due Date
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              value={dueDate}
              onChange={handleChange}
              style={styles.input}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading || !title.trim() || !dueDate}
          >
            {loading ? 'Creating...' : 'Create Todo'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 'calc(100vh - 80px)',
    backgroundColor: colors.neutral.gray50,
    padding: '16px',
  },
  card: {
    backgroundColor: colors.neutral.white,
    padding: '24px',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.12)',
    width: '100%',
    maxWidth: '500px',
  },
  title: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.gray800,
    marginBottom: '24px',
    fontFamily: typography.fontFamily,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral.gray800,
    fontFamily: typography.fontFamily,
  },
  input: {
    padding: '10px 12px',
    border: `1px solid ${colors.neutral.gray300}`,
    borderRadius: '4px',
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily,
  },
  button: {
    padding: '10px 16px',
    backgroundColor: colors.primary.main,
    color: colors.neutral.white,
    border: 'none',
    borderRadius: '4px',
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    fontFamily: typography.fontFamily,
  },
  error: {
    backgroundColor: '#ffebee',
    color: colors.error.main,
    padding: '12px',
    borderRadius: '4px',
    marginBottom: '16px',
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily,
  },
};
