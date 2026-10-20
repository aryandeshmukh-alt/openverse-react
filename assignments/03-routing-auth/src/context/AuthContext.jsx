import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider ({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const login = ( username ) => {
        setLoading(true);
        setTimeout( () => {
            setIsLoggedIn(true);
            setUser({username, id: 1});
            setLoading(false);
        }, 500);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    const value = {
        isLoggedIn,
        user,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}