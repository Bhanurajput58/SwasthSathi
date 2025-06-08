import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Calendar, FileText, Phone, User, Clock, Activity } from 'lucide-react';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [medicalRecords, setMedicalRecords] = useState([]);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const token = localStorage.getItem('user')
          ? JSON.parse(localStorage.getItem('user')).token
          : null;

        const headers = {
          'Authorization': `Bearer ${token}`,
        };

        const [appointmentsRes, recordsRes] = await Promise.all([
          fetch('http://localhost:5000/api/appointments/patient', { headers }),
          fetch('http://localhost:5000/api/medical-records/patient', { headers }),
        ]);

        const appointmentsData = await appointmentsRes.json();
        const recordsData = await recordsRes.json();

        setAppointments(appointmentsData);
        setMedicalRecords(recordsData);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    fetchPatientData();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="patient-dashboard-container">
      <div className="patient-dashboard-content">
        
        {/* Header Section */}
        <div className="header-section">
          <div className="header-content">
            <div className="header-icon-container">
              <User className="header-icon" />
            </div>
            <div>
              <h1 className="welcome-title">Welcome back, {user?.name}!</h1>
              <p className="welcome-subtitle">Manage your health journey with ease</p>
            </div>
          </div>
          
          {/* Health Stats - Moved Inside Header Section */}
          <div className="health-stats-grid">
            <div className="health-stat-card">
              <div className="health-stat-content">
                <Calendar className="health-stat-icon blue" />
                <div>
                  <p className="health-stat-label">Next Appointment</p>
                  <p className="health-stat-value">
                    {appointments.length > 0 ? new Date(appointments[0]?.date).toLocaleDateString() : 'None scheduled'}
                  </p>
                </div>
              </div>
            </div>
            
            <div className="health-stat-card">
              <div className="health-stat-content">
                <FileText className="health-stat-icon purple" />
                <div>
                  <p className="health-stat-label">Medical Records</p>
                  <p className="health-stat-value">{medicalRecords.length} Records</p>
                </div>
              </div>
            </div>
            
            <div className="health-stat-card">
              <div className="health-stat-content">
                <Activity className="health-stat-icon green" />
                <div>
                  <p className="health-stat-label">Health Status</p>
                  <p className="health-stat-value">Good</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick actions */}
        <div className="quick-actions-grid">
          <div className="quick-action-card">
            <div className="quick-action-content">
              <div className="quick-action-icon-container blue">
                <Calendar className="quick-action-icon blue" />
              </div>
              <h2 className="quick-action-title">Book Appointment</h2>
            </div>
            <p className="quick-action-description">Schedule a visit with your preferred doctor</p>
            <button className="action-button blue">
              Find a Doctor
            </button>
          </div>

          <div className="quick-action-card">
            <div className="quick-action-content">
              <div className="quick-action-icon-container green">
                <FileText className="quick-action-icon green" />
              </div>
              <h2 className="quick-action-title">View Records</h2>
            </div>
            <p className="quick-action-description">Access your complete medical history</p>
            <button className="action-button green">
              Medical History
            </button>
          </div>

          <div className="quick-action-card">
            <div className="quick-action-content">
              <div className="quick-action-icon-container red">
                <Phone className="quick-action-icon red" />
              </div>
              <h2 className="quick-action-title">Emergency</h2>
            </div>
            <p className="quick-action-description">24/7 emergency medical assistance</p>
            <button className="action-button red">
              Contact Emergency
            </button>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="main-content-grid">
          
          {/* Appointments Section */}
          <div className="section-card">
            <div className="section-header">
              <div className="section-icon-container">
                <Calendar className="section-icon blue" />
              </div>
              <h2 className="section-title">Upcoming Appointments</h2>
            </div>
            
            {appointments.length > 0 ? (
              <div className="space-y-4">
                {appointments.map((appointment) => (
                  <div key={appointment._id} className="appointment-item">
                    <div className="appointment-header">
                      <div className="doctor-info">
                        <div className="doctor-icon-container">
                          <User className="doctor-icon" />
                        </div>
                        <div>
                          <p className="doctor-name">Dr. {appointment.doctor?.name}</p>
                          <p className="doctor-specialization">{appointment.doctor?.specialization}</p>
                        </div>
                      </div>
                      <span className={`status-tag ${getStatusColor(appointment.status)}`}>
                        {appointment.status}
                      </span>
                    </div>
                    
                    <div className="appointment-details">
                      <div className="detail-item">
                        <Calendar className="detail-icon" />
                        <span>{new Date(appointment.date).toLocaleDateString()}</span>
                      </div>
                      <div className="detail-item">
                        <Clock className="detail-icon" />
                        <span>{appointment.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-appointments-section">
                <Calendar className="no-appointments-icon" />
                <p className="no-appointments-title">No upcoming appointments</p>
                <p className="no-appointments-subtitle">Schedule your next visit above</p>
              </div>
            )}
          </div>

          {/* Medical Records Section */}
          <div className="medical-records-section">
            <div className="section-header">
              <div className="section-icon-container purple">
                <FileText className="section-icon purple" />
              </div>
              <h2 className="section-title">Recent Medical Records</h2>
            </div>
            
            {medicalRecords.length > 0 ? (
              <div className="space-y-4">
                {medicalRecords.slice(0, 5).map((record) => (
                  <div key={record._id} className="medical-record-item">
                    <div className="medical-record-header">
                      <div className="medical-record-icon-container">
                        <User className="medical-record-icon" />
                      </div>
                      <div className="flex-1">
                        <p className="medical-record-doctor-name">Dr. {record.doctor?.name}</p>
                        <p className="medical-record-date">{new Date(record.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    
                    <div className="medical-record-diagnosis-container">
                      <div className="medical-record-diagnosis-box">
                        <p className="medical-record-diagnosis-label">Diagnosis:</p>
                        <p className="medical-record-diagnosis-text">{record.diagnosis}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-medical-records-section">
                <FileText className="no-medical-records-icon" />
                <p className="no-medical-records-title">No medical records found</p>
                <p className="no-medical-records-subtitle">Your medical history will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;