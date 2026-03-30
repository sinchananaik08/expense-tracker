import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Automatically attach token to every request if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      console.error('API Error Response:', {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers
      });

      if (error.response.data && error.response.data.error) {
        error.message = typeof error.response.data.error === 'object'
          ? JSON.stringify(error.response.data.error)
          : error.response.data.error;
      }
    } else if (error.request) {
      console.error('API No Response:', error.request);
      error.message = 'No response from server. Please check if backend is running.';
    } else {
      console.error('API Request Error:', error.message);
    }

    return Promise.reject(error);
  }
);

// Categories
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);
export const updateCategoryBudget = (id, budget) => api.put(`/categories/${id}/budget`, { budget });
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

// Expenses
export const getExpenses = (params) => api.get('/expenses', { params });
export const createExpense = (data) => api.post('/expenses', data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);
export const updateExpense = (id, data) => api.put(`/expenses/${id}`, data);

// Summary
export const getMonthlySummary = () => api.get('/summary/monthly');

// Auth
export const registerUser = (data) => api.post('/auth/register', data);
export const loginUser = (data) => api.post('/auth/login', data);



export default api;