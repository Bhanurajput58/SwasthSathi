import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const SystemSettings = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    appointmentDuration: 30,
    maxAppointmentsPerDay: 20,
    workingHours: {
      start: '09:00',
      end: '17:00'
    },
    notifications: {
      email: true,
      sms: false
    }
  });

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
      const response = await fetch('http://localhost:5000/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(settings)
      });

      if (!response.ok) {
        throw new Error('Failed to save settings');
      }

      alert('Settings saved successfully!');
    } catch (error) {
      alert('Error saving settings: ' + error.message);
    }
  };

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>System Settings</h1>
        <button className="action-button cyan" onClick={() => navigate('/admin/dashboard')}>
          Back to Dashboard
        </button>
      </div>

      <div className="settings-grid">
        <div className="settings-card">
          <h3>Appointment Settings</h3>
          <div className="setting-item">
            <label>Appointment Duration (minutes)</label>
            <input
              type="number"
              value={settings.appointmentDuration}
              onChange={(e) => setSettings({...settings, appointmentDuration: parseInt(e.target.value)})}
            />
          </div>
          <div className="setting-item">
            <label>Max Appointments Per Day</label>
            <input
              type="number"
              value={settings.maxAppointmentsPerDay}
              onChange={(e) => setSettings({...settings, maxAppointmentsPerDay: parseInt(e.target.value)})}
            />
          </div>
        </div>

        <div className="settings-card">
          <h3>Working Hours</h3>
          <div className="setting-item">
            <label>Start Time</label>
            <input
              type="time"
              value={settings.workingHours.start}
              onChange={(e) => setSettings({
                ...settings,
                workingHours: {...settings.workingHours, start: e.target.value}
              })}
            />
          </div>
          <div className="setting-item">
            <label>End Time</label>
            <input
              type="time"
              value={settings.workingHours.end}
              onChange={(e) => setSettings({
                ...settings,
                workingHours: {...settings.workingHours, end: e.target.value}
              })}
            />
          </div>
        </div>

        <div className="settings-card">
          <h3>Notification Settings</h3>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.notifications.email}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: {...settings.notifications, email: e.target.checked}
                })}
              />
              Enable Email Notifications
            </label>
          </div>
          <div className="setting-item">
            <label>
              <input
                type="checkbox"
                checked={settings.notifications.sms}
                onChange={(e) => setSettings({
                  ...settings,
                  notifications: {...settings.notifications, sms: e.target.checked}
                })}
              />
              Enable SMS Notifications
            </label>
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="action-button cyan" onClick={handleSave}>
          Save Settings
        </button>
      </div>
    </div>
  );
};

export default SystemSettings; 