import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './AdminDashboard.css'; // Import the new CSS file

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

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

        const statsResponse = await fetch('http://localhost:5000/api/admin/stats', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const statsData = await statsResponse.json();
        setStats(statsData);

        const usersResponse = await fetch('http://localhost:5000/api/admin/users/recent', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const usersData = await usersResponse.json();
        setRecentUsers(usersData);

        const appointmentsResponse = await fetch('http://localhost:5000/api/admin/appointments/recent', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const appointmentsData = await appointmentsResponse.json();
        setRecentAppointments(appointmentsData);
      } catch (error) {
        console.error('Error fetching admin data:', error);
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div className="admin-dashboard-container">
      <div className="admin-dashboard-content">

        {/*Welcome*/}
        <div className="welcome-section">
          <h1 className="welcome-section h1">Welcome, {user?.name}</h1>
          <p className="welcome-section p">System Overview Dashboard</p>

          {/*Statistics Section - Moved Inside Welcome Section*/}
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
              <h3 className="stat-card h3">Total Appointments</h3>
              <p className="stat-card p text-orange">{stats.totalAppointments}</p>
            </div>
          </div>
        </div>

        {/*Quick Actions*/}
        <div className="quick-actions-grid">
          <div className="action-card">
            <h2 className="action-card h2">Manage Users</h2>
            <button className="action-button cyan">
              View All Users
            </button>
          </div>
          <div className="action-card">
            <h2 className="action-card h2">Manage Doctors</h2>
            <button className="action-button emerald">
              View All Doctors
            </button>
          </div>
          <div className="action-card">
            <h2 className="action-card h2">System Settings</h2>
            <button className="action-button rose">
              Configure System
            </button>
          </div>
        </div>

        {/*Users Section */}
        <div className="recent-section">
          <h2 className="recent-section h2">Recent Users</h2>
          {recentUsers.length > 0 ? (
            <div className="space-y-4">
              {recentUsers.map((user) => (
                <div key={user._id} className="recent-items-container">
                  <p className="recent-item-text-bold">{user.name}</p>
                  <p className="recent-item-text-normal">Email: {user.email}</p>
                  <p className="recent-item-text-normal">Role: {user.role}</p>
                  <p className="recent-item-text-normal">Joined: {new Date(user.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-records-text">No recent users</p>
          )}
        </div>

        {/*Appointments Section */}
        <div className="recent-section">
          <h2 className="recent-section h2">Recent Appointments</h2>
          {recentAppointments.length > 0 ? (
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment._id} className="recent-items-container">
                  <p className="recent-item-text-bold">Patient: {appointment.patient?.name}</p>
                  <p className="recent-item-text-normal">Doctor: Dr. {appointment.doctor?.name}</p>
                  <p className="recent-item-text-normal">Date: {new Date(appointment.date).toLocaleDateString()}</p>
                  <p className="recent-item-text-normal">Status: {appointment.status}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-records-text">No recent appointments</p>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
