import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addTodo } from '../api/todos';

export function AddTodoPage() {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      setLoading(true);
      setError(null);
      await addTodo(title);
      navigate('/');
    } catch (err) {
      setError('Failed to add todo. Try again.');
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1>➕ Add New Todo</h1>

        {error && <div style={styles.error}>❌ {error}</div>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="title">Todo Title:</label>
            <textarea
              id="title"
              value={title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              style={styles.textarea}
              rows="4"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            style={styles.button}
            disabled={loading || !title.trim()}
          >
            {loading ? '⏳ Adding...' : '✅ Add Todo'}
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
    backgroundColor: '#f5f5f5',
  },
  card: {
    backgroundColor: '#fff',
    padding: '2rem',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    width: '100%',
    maxWidth: '500px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  textarea: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
    fontFamily: 'inherit',
    resize: 'vertical',
  },
  button: {
    padding: '0.75rem',
    backgroundColor: '#61dafb',
    color: '#282c34',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  error: {
    backgroundColor: '#fee',
    color: '#c00',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem',
  },
};
