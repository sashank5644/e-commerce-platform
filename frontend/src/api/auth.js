// frontend/src/api/auth.js
import { authApi } from './api';

export const login = async (email, password) => {
  const response = await authApi.post('/login', { email, password });
  return response.data; // Expecting { token, user }
};

export const register = async (username, email, password) => {
  const response = await authApi.post('/register', { name: username, email, password });
  return response.data; // Expecting { token, user }
};

export const getCurrentUser = async () => {
  const response = await authApi.get('/me');
  return response.data; // Expecting user object
};