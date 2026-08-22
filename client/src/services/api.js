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

const getFullUrl = (endpoint, params = {}) => {
  const base = API_BASE_URL.endsWith('/') ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const combinedPath = `${base}${cleanEndpoint}`;

  const isAbsolute = combinedPath.startsWith('http://') || combinedPath.startsWith('https://');
  const url = isAbsolute ? new URL(combinedPath) : new URL(combinedPath, window.location.origin);

  Object.keys(params).forEach((key) => {
    if (params[key] !== undefined && params[key] !== null && params[key] !== '') {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

export const api = {
  async get(endpoint, params = {}) {
    const url = getFullUrl(endpoint, params);
    const res = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    let data = {};
    try {
      const text = await res.text();
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = { message: 'Server communication error' };
    }
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  },

  async post(endpoint, body = {}) {
    const url = getFullUrl(endpoint);
    const res = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    let data = {};
    try {
      const text = await res.text();
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = { message: 'Server communication error' };
    }
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  },

  async put(endpoint, body = {}) {
    const url = getFullUrl(endpoint);
    const res = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(body),
    });
    let data = {};
    try {
      const text = await res.text();
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = { message: 'Server communication error' };
    }
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  },

  async delete(endpoint) {
    const url = getFullUrl(endpoint);
    const res = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    let data = {};
    try {
      const text = await res.text();
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = { message: 'Server communication error' };
    }
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
