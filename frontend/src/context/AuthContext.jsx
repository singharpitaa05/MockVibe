// AUTHENTICATION CONTEXT

import { createContext, useContext, useEffect, useState } from 'react';
import api from '../config/api';

const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Verify token is still valid
          await api.get('/auth/me');
        } catch (err) {
          console.error('Token validation failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Register user
  const register = async (email, password) => {
    try {
      setError(null);
      const { data } = await api.post('/auth/register', { email, password });
      
      // Save token and user to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      setUser(data);
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Login user
  const login = async (email, password) => {
    try {
      setError(null);
      const { data } = await api.post('/auth/login', { email, password });
      
      // Save token and user to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      
      setUser(data);
      return { success: true, data };
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Logout user
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  // Update user data in context and localStorage
  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};