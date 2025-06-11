import React from 'react';
import './App.css';
import Layout from './layout/layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Services from './pages/Services';
import Signup from './pages/Signup';
import Contact from './pages/Contact';
import Doctors from './pages/Doctors/Doctors';
import AllDoctors from './pages/Doctors/AllDoctors';
import DoctorDetails from './pages/Doctors/DoctorDetails';
import DoctorProfile from './pages/Doctors/DoctorProfile';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import Medications from './pages/Medications';
import ManageUsers from './pages/Admin/ManageUsers';
import ManageDoctors from './pages/Admin/ManageDoctors';
import SystemSettings from './pages/Admin/SystemSettings';
import ManagePatients from './pages/Admin/ManagePatients';
import PatientProfile from './pages/Patient/PatientProfile';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="doctors" element={<Doctors />} />
          <Route path="doctors/:id" element={<DoctorDetails />} />
          <Route path="services" element={<Services />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="contact" element={<Contact />} />
        </Route>

        {/* Protected routes */}
        <Route
          path="/patient/*"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Routes>
                <Route index element={<PatientDashboard />} />
                <Route path="all-doctors" element={<AllDoctors />} />
                <Route path="doctors/:id" element={<DoctorProfile />} />
                <Route path="profile" element={<PatientProfile />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        <Route
          path="/doctor/*"
          element={
            <ProtectedRoute allowedRoles={['doctor']}>
              <DoctorDashboard />
            </ProtectedRoute>
          }
        />

        {/* Admin routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Routes>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="doctors" element={<ManageDoctors />} />
                <Route path="settings" element={<SystemSettings />} />
                <Route path="patients" element={<ManagePatients />} />
              </Routes>
            </ProtectedRoute>
          }
        />

        <Route
          path="/medications"
          element={
            <ProtectedRoute allowedRoles={['patient']}>
              <Medications />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
