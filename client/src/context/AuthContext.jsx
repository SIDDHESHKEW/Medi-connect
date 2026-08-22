import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { success, error: toastError } = useToast();

  const loadUser = useCallback(async () => {
    const token = localStorage.getItem('mediconnect_token');
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await authApi.getMe();
      if (res.success && res.user) {
        setUser(res.user);
      } else {
        localStorage.removeItem('mediconnect_token');
        setUser(null);
      }
    } catch (err) {
      console.warn('Auth token invalid or expired:', err.message);
      localStorage.removeItem('mediconnect_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  const login = async (email, password) => {
    try {
      const res = await authApi.login({ email, password });
      if (res.success && res.token) {
        localStorage.setItem('mediconnect_token', res.token);
        setUser(res.user);
        success(`Welcome back, ${res.user.name}!`);
        return res.user;
      }
    } catch (err) {
      toastError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (userData) => {
    try {
      const res = await authApi.register(userData);
      if (res.success && res.token) {
        localStorage.setItem('mediconnect_token', res.token);
        setUser(res.user);
        success('Account created successfully!');
        return res.user;
      }
    } catch (err) {
      toastError(err.message || 'Registration failed');
      throw err;
    }
  };

  const quickDemoLogin = async (role) => {
    const demoCredentials = {
      customer: { email: 'customer@mediconnect.com', password: 'password123' },
      pharmacist: { email: 'pharmacist@mediconnect.com', password: 'password123' },
      admin: { email: 'admin@mediconnect.com', password: 'adminpassword' },
    };

    const creds = demoCredentials[role] || demoCredentials.customer;
    return await login(creds.email, creds.password);
  };

  const logout = () => {
    localStorage.removeItem('mediconnect_token');
    setUser(null);
    success('Logged out successfully');
  };

  const isCustomer = user?.role === 'customer';
  const isPharmacist = user?.role === 'pharmacist';
  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        quickDemoLogin,
        logout,
        isAuthenticated: !!user,
        isCustomer,
        isPharmacist,
        isAdmin,
        reloadUser: loadUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
