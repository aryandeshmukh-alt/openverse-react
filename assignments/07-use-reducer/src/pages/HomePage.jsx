import { Link } from 'react-router-dom';
import { PAGE_SIZE } from '../api/todos';
import { useTodos } from '../hooks/useTodos';
import { useTodoFilters } from '../hooks/useTodoFilters';
import { FilterBar } from '../components/FilterBar';
import { Pagination } from '../components/Pagination';
import { colors, typography } from '../styles/colors';

export function HomePage() {
  const { search, setSearch, sort, setSort, status, setStatus, page, setPage, params } =
    useTodoFilters();
  const { data, isPending, isError, error, isPlaceholderData } = useTodos(params);

  if (isPending) {
    return <div style={styles.center}>Loading...</div>;
  }

  if (isError) {
    return <div style={styles.center}>{error.message}</div>;
  }

  const totalPages = Math.max(1, Math.ceil(data.total / PAGE_SIZE));

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

      {data.todos.length === 0 ? (
        <p style={styles.empty}>No todos found.</p>
      ) : (
        <ul style={{ ...styles.list, opacity: isPlaceholderData ? 0.6 : 1 }}>
          {data.todos.map((todo) => (
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

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={setPage}
        disabled={isPlaceholderData}
      />
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
