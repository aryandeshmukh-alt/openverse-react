import { colors, typography } from '../styles/colors';

export function Pagination({ page, totalPages, onPageChange, disabled }) {
  return (
    <div style={styles.container}>
      <button
        type="button"
        style={styles.button}
        onClick={() => onPageChange(page - 1)}
        disabled={disabled || page <= 1}
      >
        Previous
      </button>

      <span style={styles.info}>
        Page {page} of {totalPages}
      </span>

      <button
        type="button"
        style={styles.button}
        onClick={() => onPageChange(page + 1)}
        disabled={disabled || page >= totalPages}
      >
        Next
      </button>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '16px',
    marginTop: '24px',
  },
  button: {
    padding: '6px 14px',
    backgroundColor: colors.neutral.white,
    color: colors.neutral.gray800,
    border: `1px solid ${colors.neutral.gray300}`,
    borderRadius: '4px',
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily,
    cursor: 'pointer',
  },
  info: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.gray600,
    fontFamily: typography.fontFamily,
  },
};
