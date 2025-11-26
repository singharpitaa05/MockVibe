// Question API service methods
import api from './api';

// Get all questions with filters
export const getQuestions = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.type) params.append('type', filters.type);
  if (filters.difficulty) params.append('difficulty', filters.difficulty);
  if (filters.category) params.append('category', filters.category);
  if (filters.tags) params.append('tags', filters.tags);
  if (filters.search) params.append('search', filters.search);
  if (filters.page) params.append('page', filters.page);
  if (filters.limit) params.append('limit', filters.limit);

  const response = await api.get(`/questions?${params.toString()}`);
  return response.data;
};

// Get question by ID
export const getQuestionById = async (id) => {
  const response = await api.get(`/questions/${id}`);
  return response.data;
};

// Create new question (Admin/Interviewer only)
export const createQuestion = async (questionData) => {
  const response = await api.post('/questions', questionData);
  return response.data;
};

// Update question (Admin/Interviewer only)
export const updateQuestion = async (id, questionData) => {
  const response = await api.put(`/questions/${id}`, questionData);
  return response.data;
};

// Delete question (Admin/Interviewer only)
export const deleteQuestion = async (id) => {
  const response = await api.delete(`/questions/${id}`);
  return response.data;
};

// Get random questions for practice
export const getRandomQuestions = async (filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.type) params.append('type', filters.type);
  if (filters.difficulty) params.append('difficulty', filters.difficulty);
  if (filters.count) params.append('count', filters.count);

  const response = await api.get(`/questions/random?${params.toString()}`);
  return response.data;
};

// Get question statistics (Admin/Interviewer only)
export const getQuestionStats = async () => {
  const response = await api.get('/questions/stats');
  return response.data;
};