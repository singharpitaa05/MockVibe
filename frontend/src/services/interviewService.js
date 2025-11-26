// INTERVIEW SERVICE

// Interview API service methods
import api from './api';

// Create/Schedule new interview
export const createInterview = async (interviewData) => {
  const response = await api.post('/interviews', interviewData);
  return response.data;
};

// Get all interviews with filters
export const getInterviews = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.status) params.append('status', filters.status);
  if (filters.type) params.append('type', filters.type);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);

  const response = await api.get(`/interviews?${params.toString()}`);
  return response.data;
};

// Get interview by ID
export const getInterviewById = async (id) => {
  const response = await api.get(`/interviews/${id}`);
  return response.data;
};

// Update interview
export const updateInterview = async (id, interviewData) => {
  const response = await api.put(`/interviews/${id}`, interviewData);
  return response.data;
};

// Cancel interview
export const cancelInterview = async (id) => {
  const response = await api.put(`/interviews/${id}/cancel`);
  return response.data;
};

// Submit interview feedback (Interviewer only)
export const submitFeedback = async (id, feedbackData) => {
  const response = await api.put(`/interviews/${id}/feedback`, feedbackData);
  return response.data;
};

// Get upcoming interviews
export const getUpcomingInterviews = async () => {
  const response = await api.get('/interviews/upcoming');
  return response.data;
};

// Get interview statistics
export const getInterviewStats = async () => {
  const response = await api.get('/interviews/stats');
  return response.data;
};

// Delete interview (Admin only)
export const deleteInterview = async (id) => {
  const response = await api.delete(`/interviews/${id}`);
  return response.data;
};