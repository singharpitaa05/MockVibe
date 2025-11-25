// AUTHENTICATION CONTEXT

// Authentication context for managing user state globally
import { createContext, useContext, useEffect, useState } from 'react';
import { getCurrentUser, login as loginService, logout as logoutService, register as registerService } from '../services/authService';
import { updateProfile as updateProfileService } from '../services/userService';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          const response = await getCurrentUser();
          setUser(response.user);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // Register function
  const register = async (userData) => {
    try {
      setError(null);
      const response = await registerService(userData);
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
      throw new Error(message);
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setError(null);
      const response = await loginService(credentials);
      setUser(response.user);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Login failed';
      setError(message);
      throw new Error(message);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await logoutService();
      setUser(null);
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  // Update user profile and update local state
  const updateProfile = async (profileData) => {
    try {
      setError(null);
      const response = await updateProfileService(profileData);
      // response may be the updated user object or contain { user }
      const updatedUser = response.user || response;
      setUser(updatedUser);
      return response;
    } catch (err) {
      const message = err.response?.data?.message || 'Update failed';
      setError(message);
      throw new Error(message);
    }
  };

  const value = {
    user,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    isAuthenticated: !!user
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};