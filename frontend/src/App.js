import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import DoctorDashboard from './pages/Dashboard/DoctorDashboard';
import PatientDashboard from './pages/Dashboard/PatientDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import ViewPatientRecords from './pages/PatientRecords/ViewPatientRecords';
import DoctorPatients from './pages/Dashboard/DoctorPatients';
import AddMedicalRecord from './pages/MedicalRecords/AddMedicalRecord';
import Home from './pages/Home/Home';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/doctor/dashboard" element={
            <PrivateRoute>
              <DoctorDashboard />
            </PrivateRoute>
          } />
          <Route path="/patient/dashboard" element={
            <PrivateRoute>
              <PatientDashboard />
            </PrivateRoute>
          } />
          <Route path="/admin/dashboard" element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          } />
          <Route path="/doctor/patients" element={
            <PrivateRoute>
              <DoctorPatients />
            </PrivateRoute>
          } />
          <Route path="/patient-records/:patientId" element={
            <PrivateRoute>
              <ViewPatientRecords />
            </PrivateRoute>
          } />
          <Route path="/add-medical-record/:patientId" element={
            <PrivateRoute>
              <AddMedicalRecord />
            </PrivateRoute>
          } />
          {/* Catch all route - redirect to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App; 