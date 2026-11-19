import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTodos } from '../api/todos';
import { useFilter } from '../hooks/useFilter';
import { useCopyToClipboard } from '../hooks/useCopyToClipboard';
import { FilterBar } from '../components/FilterBar';
import { colors, typography } from '../styles/colors';

function CopyButton({ text }) {
  const [copied, copy] = useCopyToClipboard(text);

  return (
    <button type="button" onClick={copy} style={styles.copyButton}>
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}

export function HomePage() {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { token, refreshAccessToken, logout } = useAuth();
  const { search, setSearch, sort, setSort, status, setStatus, filteredTodos } =
    useFilter(todos);

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

      <FilterBar
        search={search}
        sort={sort}
        status={status}
        onSearchChange={setSearch}
        onSortChange={setSort}
        onStatusChange={setStatus}
      />

      {filteredTodos.length === 0 ? (
        <p style={styles.empty}>No todos found.</p>
      ) : (
        <ul style={styles.list}>
          {filteredTodos.map((todo) => (
            <li key={todo.id} style={styles.item}>
              <Link to={`/todos/${todo.id}`} style={styles.itemLink}>
                <span style={styles.itemTitle}>{todo.title}</span>
                {todo.dueDate && (
                  <span style={styles.dueDate}>Due: {todo.dueDate}</span>
                )}
              </Link>
              <CopyButton text={todo.title} />
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
    display: 'flex',
    alignItems: 'center',
    paddingRight: '12px',
  },
  copyButton: {
    padding: '4px 12px',
    backgroundColor: 'transparent',
    color: colors.neutral.gray600,
    border: `1px solid ${colors.neutral.gray300}`,
    borderRadius: '4px',
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily,
    cursor: 'pointer',
  },
  itemLink: {
    flex: 1,
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
