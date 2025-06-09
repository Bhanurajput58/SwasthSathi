import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { FileText, Clock, AlertCircle, Plus } from 'lucide-react';
import './Medications.css';

const Medications = () => {
  const { user } = useAuth();
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedications = async () => {
      try {
        const token = localStorage.getItem('user')
          ? JSON.parse(localStorage.getItem('user')).token
          : null;

        const response = await fetch('http://localhost:5000/api/medications/patient', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        const data = await response.json();
        setMedications(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching medications:', error);
        setLoading(false);
      }
    };

    fetchMedications();
  }, []);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'status-active';
      case 'completed':
        return 'status-completed';
      case 'expired':
        return 'status-expired';
      default:
        return 'status-default';
    }
  };

  return (
    <div className="medications-container">
      <div className="medications-content">
        {/* Header Section */}
        <div className="medications-header">
          <div className="header-content">
            <div className="header-icon-container">
              <FileText className="header-icon" />
            </div>
            <div>
              <h1 className="welcome-title">My Medications</h1>
              <p className="welcome-subtitle">View and manage your prescriptions</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="medication-stats-grid">
          <div className="stat-card">
            <div className="stat-content">
              <FileText className="stat-icon blue" />
              <div>
                <p className="stat-label">Total Medications</p>
                <p className="stat-value">{medications.length}</p>
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-content">
              <Clock className="stat-icon purple" />
              <div>
                <p className="stat-label">Active Prescriptions</p>
                <p className="stat-value">
                  {medications.filter(med => med.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-content">
              <AlertCircle className="stat-icon red" />
              <div>
                <p className="stat-label">Expiring Soon</p>
                <p className="stat-value">
                  {medications.filter(med => {
                    const expiryDate = new Date(med.expiryDate);
                    const today = new Date();
                    const daysUntilExpiry = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                    return daysUntilExpiry <= 7 && daysUntilExpiry > 0;
                  }).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Medications List */}
        <div className="medications-section">
          <div className="section-header">
            <h2 className="section-title">Current Medications</h2>
            <button className="add-medication-button">
              <Plus className="button-icon" />
              Add New Medication
            </button>
          </div>

          {loading ? (
            <div className="loading-state">
              <p>Loading medications...</p>
            </div>
          ) : medications.length > 0 ? (
            <div className="medications-list">
              {medications.map((medication) => (
                <div key={medication._id} className="medication-card">
                  <div className="medication-header">
                    <div className="medication-info">
                      <h3 className="medication-name">{medication.name}</h3>
                      <p className="medication-dosage">{medication.dosage}</p>
                    </div>
                    <span className={`status-tag ${getStatusColor(medication.status)}`}>
                      {medication.status}
                    </span>
                  </div>
                  
                  <div className="medication-details">
                    <div className="detail-item">
                      <Clock className="detail-icon" />
                      <span>Frequency: {medication.frequency}</span>
                    </div>
                    <div className="detail-item">
                      <FileText className="detail-icon" />
                      <span>Prescribed by: Dr. {medication.prescribedBy}</span>
                    </div>
                    <div className="detail-item">
                      <AlertCircle className="detail-icon" />
                      <span>Expires: {new Date(medication.expiryDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="medication-notes">
                    <p className="notes-label">Notes:</p>
                    <p className="notes-text">{medication.notes || 'No additional notes'}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-medications">
              <FileText className="no-medications-icon" />
              <p className="no-medications-title">No medications found</p>
              <p className="no-medications-subtitle">Your prescribed medications will appear here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Medications; 