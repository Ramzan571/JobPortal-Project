import axios from 'axios';

// ✅ Apna .NET backend URL yahan set karo
const API_BASE_URL = 'http://localhost:5182/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor — JWT token automatically attach karta hai
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor — 401 pe logout karta hai
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ===================== AUTH APIs =====================
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
};

// ===================== JOBS APIs =====================
export const jobsAPI = {
  getAll: (params) => api.get('/jobs', { params }),
  getById: (id) => api.get(`/jobs/${id}`),
  create: (data) => api.post('/jobs', data),
  update: (id, data) => api.put(`/jobs/${id}`, data),
  delete: (id) => api.delete(`/jobs/${id}`),
};

// ===================== APPLICATIONS APIs =====================
export const applicationsAPI = {
  apply: (jobId, data) => api.post(`/applications/${jobId}`, data, {
    headers: { 'Content-Type': 'multipart/form-data' }  // ← ADD
  }),
  getMyApplications: () => api.get('/applications/my'),
  getAll: () => api.get('/applications'),
};

// api.jsx mein add karo
export const adminManagementAPI = {
  getAll: () => api.get('/adminmanagement'),
  create: (data) => api.post('/adminmanagement', data),
  update: (id, data) => api.put(`/adminmanagement/${id}`, data),
  delete: (id) => api.delete(`/adminmanagement/${id}`),
};

export default api;
