import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { colors, typography } from '../styles/colors';

export function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();

  return (
    <nav style={styles.nav}>
      <div style={styles.inner}>
        <Link to="/" style={styles.brand}>
          Todos
        </Link>

        <div style={styles.actions}>
          {isLoggedIn ? (
            <>
              {user && (
                <span style={styles.userText}>{user.email}</span>
              )}
              <button onClick={logout} style={styles.logoutButton}>
                Sign Out
              </button>
            </>
          ) : (
            <Link to="/login" style={styles.loginLink}>
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: colors.neutral.white,
    borderBottom: `1px solid ${colors.neutral.gray300}`,
    height: '60px',
    display: 'flex',
    alignItems: 'center',
  },
  inner: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '0 16px',
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brand: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.primary.main,
    textDecoration: 'none',
    fontFamily: typography.fontFamily,
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
  },
  userText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.gray600,
    fontFamily: typography.fontFamily,
  },
  logoutButton: {
    padding: '6px 14px',
    backgroundColor: 'transparent',
    color: colors.neutral.gray600,
    border: `1px solid ${colors.neutral.gray300}`,
    borderRadius: '4px',
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily,
    cursor: 'pointer',
  },
  loginLink: {
    padding: '6px 14px',
    backgroundColor: colors.primary.main,
    color: colors.neutral.white,
    borderRadius: '4px',
    textDecoration: 'none',
    fontSize: typography.fontSize.sm,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeight.medium,
  },
};
