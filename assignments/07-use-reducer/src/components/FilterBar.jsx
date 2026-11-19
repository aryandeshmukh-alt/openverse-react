import { colors, typography } from '../styles/colors';

export function FilterBar({ search, sort, status, onSearchChange, onSortChange, onStatusChange }) {
  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search todos..."
        value={search}
        onChange={(e) => onSearchChange(e.target.value)}
        style={styles.input}
      />

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value)}
        style={styles.select}
      >
        <option value="id">Sort by ID</option>
        <option value="title">Sort by Title</option>
      </select>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value)}
        style={styles.select}
      >
        <option value="all">All</option>
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
    flexWrap: 'wrap',
  },
  input: {
    flex: 1,
    minWidth: '180px',
    padding: '8px 12px',
    border: `1px solid ${colors.neutral.gray300}`,
    borderRadius: '6px',
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily,
    color: colors.neutral.gray800,
    outline: 'none',
  },
  select: {
    padding: '8px 12px',
    border: `1px solid ${colors.neutral.gray300}`,
    borderRadius: '6px',
    fontSize: typography.fontSize.base,
    fontFamily: typography.fontFamily,
    color: colors.neutral.gray800,
    backgroundColor: colors.neutral.white,
    cursor: 'pointer',
  },
};
