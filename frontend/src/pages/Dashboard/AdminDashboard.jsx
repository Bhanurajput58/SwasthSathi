import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css'; 
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDoctors: 0,
    totalPatients: 0,
    totalAppointments: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

        const statsResponse = await fetch('http://localhost:5000/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!statsResponse.ok) {
          throw new Error('Failed to fetch statistics');
        }

        const statsData = await statsResponse.json();
        setStats(statsData);

        const usersResponse = await fetch('http://localhost:5000/api/admin/recent-users', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!usersResponse.ok) {
          throw new Error('Failed to fetch recent users');
        }

        const usersData = await usersResponse.json();
        setRecentUsers(usersData);

        const appointmentsResponse = await fetch('http://localhost:5000/api/admin/recent-appointments', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!appointmentsResponse.ok) {
          throw new Error('Failed to fetch recent appointments');
        }

        const appointmentsData = await appointmentsResponse.json();
        setRecentAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-content">
          <div className="loading-state">
            <p>Loading dashboard data...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-container">
        <div className="admin-dashboard-content">
          <div className="error-state">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-content">

        {/*Welcome*/}
        <div className="admin-welcome-section">
          <h1 className="admin-welcome-section-title">Welcome, {user?.name}</h1>
          <p className="admin-welcome-section-description">System Overview Dashboard</p>

          {/*Statistics Section */}
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-card h3">Total Users</h3>
              <p className="stat-card p text-blue">{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-card h3">Total Doctors</h3>
              <p className="stat-card p text-green">{stats.totalDoctors}</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-card h3">Total Patients</h3>
              <p className="stat-card p text-purple">{stats.totalPatients}</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-card h3">Appointments</h3>
              <p className="stat-card p text-orange">{stats.totalAppointments}</p>
            </div>
          </div>
        </div>

        {/*Quick Actions*/}
        <div className="quick-actions-grid">
          <div className="action-card">
            <h2 className="action-card h2">Manage Users</h2>
            <button 
              className="action-button cyan"
              onClick={() => navigate('/admin/users')}
            >
              View All Users
            </button>
          </div>
          <div className="action-card">
            <h2 className="action-card h2">Manage Doctors</h2>
            <button 
              className="action-button emerald"
              onClick={() => navigate('/admin/doctors')}
            >
              View All Doctors
            </button>
          </div>
          <div className="action-card">
            <h2 className="action-card h2">Manage Patients</h2>
            <button 
              className="action-button violet"
              onClick={() => navigate('/admin/patients')}
            >
              View All Patients
            </button>
          </div>
          <div className="action-card">
            <h2 className="action-card h2">Manage Appointments</h2>
            <button 
              className="action-button orange"
              onClick={() => navigate('/admin/appointments')}
            >
              View All Appointments
            </button>
          </div>
          <div className="action-card">
            <h2 className="action-card h2">System Settings</h2>
            <button 
              className="action-button rose"
              onClick={() => navigate('/admin/settings')}
            >
              Configure System
            </button>
          </div>
        </div>

        {/*Users Section */}
        <div className="recent-section">
          <h2 className="recent-section h2">Recent Users</h2>
          {recentUsers.length > 0 ? (
            <div className="appointment-list">
              {recentUsers.map((user) => (
                <div key={user._id} className="recent-items-container">
                  <div className="appointment-content">
                    <div className="appointment-details">
                      <p className="appointment-patient-name">{user.name}</p>
                      <p className="appointment-time-purpose">Email: {user.email}</p>
                      <p className="appointment-time-purpose">Role: {user.role}</p>
                      <p className="appointment-time-purpose">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                    </div>
                    
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-appointments-text">No recent users</p>
          )}
        </div>

        {/*Appointments Section */}
        <div className="recent-section">
          <h2 className="recent-section h2">Recent Appointments</h2>
          {recentAppointments.length > 0 ? (
            <div className="appointment-list">
              {recentAppointments.map((appointment) => (
                <div key={appointment._id} className="appointment-item">
                  <div className="appointment-content">
                    <div className="appointment-details">
                      <p className="appointment-patient-name">Patient: {appointment.patient?.name}</p>
                      <p className="appointment-time-purpose">Doctor: Dr. {appointment.doctor?.name}</p>
                      <p className="appointment-time-purpose">Date: {new Date(appointment.date).toLocaleDateString()}</p>
                      <p className="appointment-time-purpose">Status: {appointment.status}</p>
                    </div>
                    <div className="appointment-actions">
                      <button className="action-button">
                        View Details
                      </button>
                      <button className="action-button gray">
                        Mark Complete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-appointments-text">No recent appointments</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
