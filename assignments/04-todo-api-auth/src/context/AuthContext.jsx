import { createContext, useContext, useState } from 'react';
const AuthContext = createContext();

export function AuthProvider ( {children} ) {
    const [ isLoggedIn, setIsLoggedIn] = useState(false);
    const [ user, setUser] = useState(null);
    const [ token, setToken] = useState(null);
    const [ refreshToken, setRefreshToken] = useState(null);
    const [ loading, setLoading] = useState(false);
    const [ error, setError] = useState(null);

    const login = async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            if (email === 'test@test.com' && password === '123456') {
                setIsLoggedIn(true);
                setUser({ email });
                setToken('fake-token-123');
                setRefreshToken('fake-refresh-token');
                return true;
            } else {
                throw new Error('Invalid credentials');
            }
        } catch (err) {
            setError(err.message);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
        setToken(null);
        setRefreshToken(null);
        setError(null);
    }

    const refreshAccessToken = async () => {
        if (!refreshToken) {
            logout(null);
            return null;
        }
        try {
            const response = await fetch('/api/auth/refresh', {
                method: 'POST',
                headers: { 'Content-Type' : 'application/json'},
                body: JSON.stringify( { refreshToken }),
            });
            if (!response.ok) {
                logout();
                return null;
            }
            const data = await response.json();
            setToken(data.accessToken);
            return data.accessToken;
        } catch (err) {
            logout();
            return null;
        }
    };

    const value = {
        isLoggedIn,
        user,
        token,
        loading,
        error,
        login,
        logout,
        refreshAccessToken,
    }
    
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth () {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}