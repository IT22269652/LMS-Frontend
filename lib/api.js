import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for debugging and error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✓ API Success [${response.config.method.toUpperCase()}] ${response.config.url}:`, response.data);
    return response;
  },
  (error) => {
    console.error(`✗ API Error [${error.config?.method?.toUpperCase()}] ${error.config?.url}:`, error.response?.data || error.message);
    
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      localStorage.clear();
      if (typeof window !== 'undefined' && !window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (userData) => api.post('/auth/signup', { ...userData, role: 'USER' }),
};

// Books APIs
export const booksAPI = {
  getAll: () => api.get('/books'),
  getById: (id) => api.get(`/books/${id}`),
  create: (bookData) => {
    // Ensure categoryId is a number
    const data = {
      ...bookData,
      categoryId: bookData.categoryId ? parseInt(bookData.categoryId) : null
    };
    return api.post('/books', data);
  },
  update: (id, bookData) => {
    // Ensure categoryId is a number
    const data = {
      ...bookData,
      categoryId: bookData.categoryId ? parseInt(bookData.categoryId) : null
    };
    return api.put(`/books/${id}`, data);
  },
  delete: (id) => api.delete(`/books/${id}`),
  updateStatus: (id, status) => api.patch(`/books/${id}/status?status=${status}`),
};

// Categories APIs
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Files APIs
export const filesAPI = {
  upload: (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return api.post('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

// Users APIs
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  blacklist: (id) => api.patch(`/users/${id}/blacklist`),
  unblacklist: (id) => api.patch(`/users/${id}/unblacklist`),
  delete: (id) => api.delete(`/users/${id}`),
};

// Reservations APIs
export const reservationsAPI = {
  create: (reservationData) => {
    return api.post('/reservations', {
      bookId: reservationData.bookId,
      days: reservationData.days
    });
  },
  getMyReservations: () => api.get('/reservations/my'),
  getAll: () => api.get('/reservations'),
  getById: (id) => api.get(`/reservations/${id}`),
  returnBook: (id) => api.patch(`/reservations/${id}/return`),
  delete: (id) => api.delete(`/reservations/${id}`),
};

export default api;