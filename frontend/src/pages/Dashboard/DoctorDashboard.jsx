import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        // Fetch appointments for the current doctor
        const appointmentsResponse = await fetch(`http://localhost:5000/api/appointments/doctor/${user?._id}`);
        if (!appointmentsResponse.ok) {
          throw new Error('Failed to fetch appointments');
        }
        const appointmentsData = await appointmentsResponse.json();
        setAppointments(appointmentsData);

        // Filter today's appointments
        const today = new Date().toDateString();
        const todayAppts = appointmentsData.filter(appt => 
          new Date(appt.date).toDateString() === today
        );
        setTodayAppointments(todayAppts);

        // Fetch patients associated with the doctor
        const patientsResponse = await fetch(`http://localhost:5000/api/patients/doctor/${user?._id}`);
        if (!patientsResponse.ok) {
          throw new Error('Failed to fetch patients');
        }
        const patientsData = await patientsResponse.json();
        setPatients(patientsData);

        const pendingReportsResponse = await fetch(`http://localhost:5000/api/medicalrecords/doctor/${user?._id}/pending-reports`);
        if (!pendingReportsResponse.ok) {
          throw new Error('Failed to fetch pending reports');
        }
        const pendingReportsData = await pendingReportsResponse.json();
        setPendingReportsCount(pendingReportsData.count);

      } catch (error) {
        console.error('Error fetching doctor data:', error);
      }
    };

    if (user?._id) {
      fetchDoctorData();
    }
  }, [user?._id]);

  return (
    <div className="doctor-dashboard-container">
      <div className="doctor-dashboard-content">
        {/* Welcome Section */}
        <div className="welcome-section">
          <h1 className="welcome-section h1">Welcome, Dr. {user?.name}</h1>
          <p className="welcome-section p">Your Patient Care Command Center</p>

          {/* Quick Stats*/}
          <div className="quick-stats-grid">
            <div className="quick-stat-card">
              <h2 className="quick-stat-card h2">Today's Appointments</h2>
              <p className="quick-stat-card p text-blue">{todayAppointments.length}</p>
            </div>
            <div className="quick-stat-card">
              <h2 className="quick-stat-card h2">Total Patients</h2>
              <p className="quick-stat-card p text-green">{patients.length}</p>
            </div>
            <div className="quick-stat-card">
              <h2 className="quick-stat-card h2">Pending Reports</h2>
              <p className="quick-stat-card p text-orange">{pendingReportsCount}</p>
            </div>
          </div>
        </div>

        {/* Today's Schedule */}
        <div className="today-schedule-section">
          <h2 className="today-schedule-section h2">Today's Schedule</h2>
          {todayAppointments.length > 0 ? (
            <div className="appointment-list">
              {todayAppointments.map((appointment) => (
                <div key={appointment._id} className="appointment-item">
                  <div className="appointment-content">
                    <div className="appointment-details">
                      <p className="appointment-patient-name">{appointment.patient?.name}</p>
                      <p className="appointment-time-purpose">Time: {appointment.time}</p>
                      <p className="appointment-time-purpose">Purpose: {appointment.purpose}</p>
                    </div>
                    <div className="appointment-actions">
                      <button className="action-button">
                        Start Consultation
                      </button>
                      <button className="action-button gray">
                        Reschedule
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-appointments-text">No appointments scheduled for today</p>
          )}
        </div>

        {/* Recent Patients */}
        <div className="recent-patients-section">
          <h2 className="recent-patients-section h2">Recent Patients</h2>
          {patients.length > 0 ? (
            <div className="patient-list">
              {patients.slice(0, 5).map((patient) => (
                <div key={patient._id} className="patient-item">
                  <p className="patient-name">{patient.name}</p>
                  <p className="patient-last-visit">Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}</p>
                  <button className="view-records-button">
                    View Records
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-patients-text">No recent patients</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard; 