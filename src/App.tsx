import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Patients from './pages/Patients';
import Referrals from './pages/Referrals';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import SalesPage from './pages/SalesPage';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { AuthProvider } from './contexts/AuthContext';
import { ReferralProvider } from './contexts/ReferralContext';
import { PatientProvider } from './contexts/PatientContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <SettingsProvider>
            <PatientProvider>
              <ReferralProvider>
                <Routes>
                  {/* Public routes */}
                  <Route path="/" element={<SalesPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />

                  {/* Protected routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/referrals" element={
                    <ProtectedRoute>
                      <Layout>
                        <Referrals />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/patients" element={
                    <ProtectedRoute>
                      <Layout>
                        <Patients />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/reports" element={
                    <ProtectedRoute requiredRole="admin">
                      <Layout>
                        <Reports />
                      </Layout>
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Layout>
                        <Settings />
                      </Layout>
                    </ProtectedRoute>
                  } />

                  {/* Redirect unknown routes to home */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </ReferralProvider>
            </PatientProvider>
          </SettingsProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;