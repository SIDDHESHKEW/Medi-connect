import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { SearchPage } from './pages/SearchPage';
import { MedicineDetailPage } from './pages/MedicineDetailPage';
import { PharmacyDetailPage } from './pages/PharmacyDetailPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Customer Pages
import { CustomerDashboard } from './pages/CustomerDashboard';
import { CustomerRequestsPage } from './pages/CustomerRequestsPage';
import { CustomerReservationsPage } from './pages/CustomerReservationsPage';
import { CustomerProfilePage } from './pages/CustomerProfilePage';

// Pharmacy Pages
import { PharmacyDashboard } from './pages/PharmacyDashboard';
import { PharmacyInventoryPage } from './pages/PharmacyInventoryPage';
import { PharmacyAddMedicinePage } from './pages/PharmacyAddMedicinePage';
import { PharmacyRequestsPage } from './pages/PharmacyRequestsPage';
import { PharmacyReservationsPage } from './pages/PharmacyReservationsPage';
import { PharmacyProfilePage } from './pages/PharmacyProfilePage';

// Admin Pages
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminPharmaciesPage } from './pages/AdminPharmaciesPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminMedicinesPage } from './pages/AdminMedicinesPage';
import { AdminReportsPage } from './pages/AdminReportsPage';

export function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/medicine/:id" element={<MedicineDetailPage />} />
        <Route path="/pharmacy/:id" element={<PharmacyDetailPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Customer Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}>
              <CustomerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/requests"
          element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}>
              <CustomerRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservations"
          element={
            <ProtectedRoute allowedRoles={['customer', 'admin']}>
              <CustomerReservationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute allowedRoles={['customer', 'admin', 'pharmacist']}>
              <CustomerProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Pharmacist Protected Routes */}
        <Route
          path="/pharmacy/dashboard"
          element={
            <ProtectedRoute allowedRoles={['pharmacist', 'admin']}>
              <PharmacyDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pharmacy/inventory"
          element={
            <ProtectedRoute allowedRoles={['pharmacist', 'admin']}>
              <PharmacyInventoryPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pharmacy/inventory/add"
          element={
            <ProtectedRoute allowedRoles={['pharmacist', 'admin']}>
              <PharmacyAddMedicinePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pharmacy/requests"
          element={
            <ProtectedRoute allowedRoles={['pharmacist', 'admin']}>
              <PharmacyRequestsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pharmacy/reservations"
          element={
            <ProtectedRoute allowedRoles={['pharmacist', 'admin']}>
              <PharmacyReservationsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/pharmacy/profile"
          element={
            <ProtectedRoute allowedRoles={['pharmacist', 'admin']}>
              <PharmacyProfilePage />
            </ProtectedRoute>
          }
        />

        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/pharmacies"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPharmaciesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminUsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/medicines"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminMedicinesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminReportsPage />
            </ProtectedRoute>
          }
        />

        {/* Catch-all fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
