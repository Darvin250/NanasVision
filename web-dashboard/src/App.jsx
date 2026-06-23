// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Login from './Login';
import FarmerDashboard from './FarmerDashboard.jsx';
import CaptureScreen from './CaptureScreen.jsx';
import CultivarScreen from './CultivarScreen.jsx';
import ResultScreen from './ResultScreen.jsx';
import Dashboard from './Dashboard.jsx';
import HistoryScreen from './HistoryScreen.jsx';

// Placeholder Components for your Dashboards
const AdminDashboard = () => (
  <div style={{ padding: '20px' }}>
    <h2>LPNM Officer Dashboard</h2>
    <p>Macro-level view: Analytics, all scan records, and system data.</p>
  </div>
);

// RBAC Wrapper
const ProtectedRoute = ({ children, allowedRole }) => {
  const { currentUser, userRole } = useAuth();

  // Redirect to login if unauthenticated
  if (!currentUser) return <Navigate to="/" />;
  
  // Redirect to the correct dashboard if their role doesn't match the route
  if (allowedRole && userRole !== allowedRole) {
    return <Navigate to={userRole === 'admin' ? '/admin' : '/farmer'} />;
  }
  
  return children;
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          
          <Route path="/admin" element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/farmer" element={
            <ProtectedRoute allowedRole="farmer">
              <FarmerDashboard />
            </ProtectedRoute>
          } />

          <Route path="/farmer/cultivars" element={
            <ProtectedRoute allowedRole="farmer">
              <CultivarScreen />
            </ProtectedRoute>
          } />

          <Route path="/farmer/capture" element={
            <ProtectedRoute allowedRole="farmer">
              <CaptureScreen />
            </ProtectedRoute>
          } />

          <Route path="/farmer/result" element={
            <ProtectedRoute allowedRole="farmer">
              <ResultScreen />
            </ProtectedRoute>
          } />

          <Route path="/farmer/history" element={
            <ProtectedRoute allowedRole="farmer">
              <HistoryScreen />
            </ProtectedRoute>
          } />

          <Route path="/farmer/dashboard" element={
            <ProtectedRoute allowedRole="farmer">
              <Dashboard />
            </ProtectedRoute>
          } />
          
          {/* Catch-all route to fallback to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}
