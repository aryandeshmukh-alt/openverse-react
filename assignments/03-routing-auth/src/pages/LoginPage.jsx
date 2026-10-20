import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export function LoginPage () {
    const [ username, setUsername] = useState('');
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUsername(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username.trim()) {
            login(username);
            setTimeout( () => {
                navigate('/');
            }, 600);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h1> Login </h1>
                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.formGroup}>
                            <label htmlFor="username"> Username: </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={handleChange}
                                placeholder="Enter any username: "
                                style={styles.input}
                                disabled={loading}
                            />
                        </div>
                        <button
                            type="submit"
                            style={styles.button}
                            disabled={loading || !username.trim()}
                        >
                            {loading? 'Logging in ... ' : 'Login'}    
                        </button>
                    </form>
                    <p style={styles.hint}> Try: "john", "jane" or any other name </p>
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
    maxWidth: '400px',
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
  input: {
    padding: '0.75rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem',
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
  hint: {
    fontSize: '0.9rem',
    color: '#666',
    textAlign: 'center',
    marginTop: '1rem',
  },
};