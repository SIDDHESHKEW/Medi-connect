/**
 * MediConnect API Client Layer
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('mediconnect_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const api = {
  async get(endpoint, params = {}) {
    const url = new URL(`${API_BASE_URL}${endpoint}`, window.location.origin);
    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
        url.searchParams.append(key, params[key]);
      }
    });

    const res = await fetch(url.toString(), {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  },

  async post(endpoint, body = {}) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  },

  async put(endpoint, body = {}) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  },

  async delete(endpoint) {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  },
};

// API Resource Endpoints
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getMe: () => api.get('/auth/me'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

export const medicinesApi = {
  search: (params) => api.get('/medicines/search', params),
  getAll: () => api.get('/medicines'),
  getById: (id, params) => api.get(`/medicines/${id}`, params),
  create: (data) => api.post('/medicines', data),
  update: (id, data) => api.put(`/medicines/${id}`, data),
  delete: (id) => api.delete(`/medicines/${id}`),
};

export const pharmaciesApi = {
  getNearby: (params) => api.get('/pharmacies/nearby', params),
  getById: (id, params) => api.get(`/pharmacies/${id}`, params),
  update: (id, data) => api.put(`/pharmacies/${id}`, data),
  updateStatus: (id, data) => api.put(`/pharmacies/${id}/status`, data),
};

export const inventoryApi = {
  getByPharmacy: (pharmacyId) => api.get(`/inventory/pharmacy/${pharmacyId}`),
  updateStatus: (id, data) => api.put(`/inventory/${id}/status`, data),
  addItem: (data) => api.post('/inventory', data),
  removeItem: (id) => api.delete(`/inventory/${id}`),
};

export const requestsApi = {
  create: (data) => api.post('/requests', data),
  getUserRequests: () => api.get('/requests/user'),
  getPharmacyRequests: (pharmacyId) => api.get('/requests/pharmacy', { pharmacyId }),
  respond: (id, data) => api.put(`/requests/${id}/respond`, data),
};

export const reservationsApi = {
  create: (data) => api.post('/reservations', data),
  getUserReservations: () => api.get('/reservations/user'),
  getPharmacyReservations: (pharmacyId) => api.get('/reservations/pharmacy', { pharmacyId }),
  updateStatus: (id, data) => api.put(`/reservations/${id}`, data),
};

export const reportsApi = {
  create: (data) => api.post('/reports', data),
  getAll: () => api.get('/reports'),
};

export const adminApi = {
  getStats: () => api.get('/admin/stats'),
  getUsers: () => api.get('/admin/users'),
  toggleUser: (id) => api.put(`/admin/users/${id}/toggle`),
  getPharmacies: () => api.get('/admin/pharmacies'),
  getReports: () => api.get('/admin/reports'),
};
