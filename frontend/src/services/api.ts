import axios from 'axios';

// Flag to toggle between mock data and real API
export const USE_MOCK_DATA = false; // Using real API

// Backend API URL
export const BACKEND_URL = 'http://localhost:3002';

// ML Service URL - make sure this matches the running ML service
export const ML_SERVICE_URL = 'http://localhost:5001';

console.log('API Service initialized:');
console.log('- BACKEND_URL =', BACKEND_URL);
console.log('- ML_SERVICE_URL =', ML_SERVICE_URL);
console.log('- Using mock data:', USE_MOCK_DATA ? 'Yes' : 'No');

// Base API instance
const api = axios.create({
  baseURL: `${BACKEND_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
  // Increase timeout for image uploads
  timeout: 30000,
});

// Add token to requests
api.interceptors.request.use(request => {
  const token = localStorage.getItem('token');
  if (token) {
    request.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Starting API Request:', request.method?.toUpperCase(), request.url);
  return request;
});

// Log responses
api.interceptors.response.use(
  response => {
    console.log('API Response:', response.status, response.statusText);
    return response;
  },
  error => {
    console.error('API Error:', error.message);
    return Promise.reject(error);
  }
);

console.log('API configured with baseURL:', api.defaults.baseURL);

export default api; 