import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function ProtectedPage () {
    const { user } = useAuth();
    
    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1> Protected Page </h1>
                    <p style={styles.subtitle}>
                        Only logged in users can see this page!
                    </p>
                        <div style={styles.content}>
                            <p>
                                Welcome, <strong> {user.username} </strong>
                            </p>
                            <p>
                                This is protected page, if you ain't logged in then you will be redirected.
                            </p>
                        </div>
                            <Link to="/" style={styles.link}>
                                Back to Home
                            </Link>

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
    maxWidth: '500px',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '2rem',
  },
  content: {
    backgroundColor: '#f0f8ff',
    padding: '1.5rem',
    borderRadius: '4px',
    marginBottom: '1.5rem',
  },
  link: {
    color: '#61dafb',
    textDecoration: 'none',
  },
};