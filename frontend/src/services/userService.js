// USER SERVICES

// User profile API service methods
import api from './api';

// Get current user profile
export const getProfile = async () => {
  const response = await api.get('/users/profile');
  return response.data;
};

// Update user profile
export const updateProfile = async (profileData) => {
  // If profileData is a FormData (contains file), send as multipart/form-data
  if (typeof FormData !== 'undefined' && profileData instanceof FormData) {
    const response = await api.put('/users/profile', profileData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  const response = await api.put('/users/profile', profileData);
  return response.data;
};

// Delete user account
export const deleteAccount = async () => {
  const response = await api.delete('/users/profile');
  return response.data;
};

// Get user by ID
export const getUserById = async (userId) => {
  const response = await api.get(`/users/${userId}`);
  return response.data;
};

// Get all users (Admin only)
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};