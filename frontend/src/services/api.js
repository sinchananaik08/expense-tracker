import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor for better error handling
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error Response:', {
        data: error.response.data,
        status: error.response.status,
        headers: error.response.headers
      });
      
      // Format error message
      if (error.response.data && error.response.data.error) {
        error.message = typeof error.response.data.error === 'object' 
          ? JSON.stringify(error.response.data.error)
          : error.response.data.error;
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('API No Response:', error.request);
      error.message = 'No response from server. Please check if backend is running.';
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('API Request Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// Categories
export const getCategories = () => api.get('/categories');
export const createCategory = (data) => api.post('/categories', data);

// Expenses
export const getExpenses = (params) => api.get('/expenses', { params });
export const createExpense = (data) => api.post('/expenses', data);
export const deleteExpense = (id) => api.delete(`/expenses/${id}`);

// Summary
export const getMonthlySummary = () => api.get('/summary/monthly');

export default api;