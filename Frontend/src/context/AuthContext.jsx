// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../service/api'; // Use our new api client

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This effect runs on initial load to verify the token
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            // Here you could add a call to a '/verify' endpoint on your backend
            // to ensure the token is still valid. For now, we'll trust it.
            setToken(storedToken);
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await api.post('/auth/login', { email, password });
        const { token } = response.data;
        localStorage.setItem('token', token);
        setToken(token);
        setIsAuthenticated(true);
    };

    const register = async (email, password) => {
        await api.post('/auth/register', { email, password });
        // Optionally log them in directly after registering
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setIsAuthenticated(false);
    };

    const googleLogin = async (credentialResponse) => {
        // The token received from Google is in credentialResponse.credential
        const res = await api.post('/auth/google', { token: credentialResponse.credential });
        const { token } = res.data;
        localStorage.setItem('token', token);
        setToken(token);
        setIsAuthenticated(true);
    };

    const value = {
        token,
        isAuthenticated,
        loading,
        googleLogin,
        login,
        register,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};