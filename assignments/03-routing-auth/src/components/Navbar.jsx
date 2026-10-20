import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Navbar() {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.navContent}>
        <Link to="/" style={styles.logo}>
          📝 TodoApp
        </Link>
        <div style={styles.links}>
          <Link to="/" style={styles.link}>
            Home
          </Link>
          {isLoggedIn && (
            <>
              <span style={styles.username}>
                👤 {user.username}
              </span>
              <button
                onClick={handleLogout}
                style={styles.button}
              >
                Logout
              </button>
            </>
          )}
          {!isLoggedIn && (
            <Link to="/login" style={styles.link}>
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    backgroundColor: '#282c34',
    padding: '1rem 0',
    marginBottom: '2rem',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  navContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    color: '#61dafb',
    fontSize: '1.5rem',
    fontWeight: 'bold',
    textDecoration: 'none',
  },
  links: {
    display: 'flex',
    gap: '1.5rem',
    alignItems: 'center',
  },
  link: {
    color: '#fff',
    textDecoration: 'none',
    fontSize: '1rem',
  },
  username: {
    color: '#61dafb',
    fontSize: '1rem',
  },
  button: {
    backgroundColor: '#ff6b6b',
    color: '#fff',
    border: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '1rem',
  },
};
