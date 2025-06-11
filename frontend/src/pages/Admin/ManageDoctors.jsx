import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import './Admin.css';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
      const response = await fetch('http://localhost:5000/api/admin/doctors', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch doctors');
      }

      const data = await response.json();
      setDoctors(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleApproval = async (doctorId, isApproved) => {
    try {
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
      const response = await fetch(`http://localhost:5000/api/admin/doctors/${doctorId}/approve`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isApproved })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update doctor approval status');
      }

      const updatedDoctor = await response.json();

      setDoctors(doctors.map(doctor => 
        doctor._id === doctorId 
          ? { ...doctor, isApproved } 
          : doctor
      ));

      setSuccessMessage(`Doctor ${isApproved ? 'approved' : 'unapproved'} successfully`);
      
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);

    } catch (error) {
      console.error('Error updating doctor approval:', error);
      setError(error.message);
      setTimeout(() => {
        setError(null);
      }, 3000);
    }
  };

  const handleViewDetails = (doctor) => {
    setSelectedDoctor(doctor);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDoctor(null);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (loading) return <div className="admin-container">Loading...</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <button className="back-to-dashboard" onClick={() => navigate('/admin')}>
          <FaArrowLeft />
          Back
        </button>
        <h1>Manage Doctors</h1>
      </div>

      {error && (
        <div className="alert alert-error">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      <div className="users-grid">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="user-card">
            <div className="doctor-avatar">
              <img 
                src={doctor.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=random`} 
                alt={doctor.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=random`;
                }}
              />
            </div>
            <div className="user-info">
              <h3>{doctor.name}</h3>
            </div>
            <div className="user-actions">
              <button 
                className="action-button"
                onClick={() => handleViewDetails(doctor)}
              >
                View Details
              </button>
              {!doctor.isApproved && (
                <button 
                  className="action-button green"
                  onClick={() => handleApproval(doctor._id, true)}
                >
                  Approve
                </button>
              )}
              {doctor.isApproved && (
                <button 
                  className="action-button red"
                  onClick={() => handleApproval(doctor._id, false)}
                >
                  Revoke Approval
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Doctor Details Modal */}
      {showModal && selectedDoctor && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Doctor Details</h2>
              <button className="close-modal-btn" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="doctor-profile-header">
                <div className="doctor-avatar large">
                  <img 
                    src={selectedDoctor.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDoctor.name)}&background=random`} 
                    alt={selectedDoctor.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedDoctor.name)}&background=random`;
                    }}
                  />
                </div>
                <div className="doctor-profile-info">
                  <h3>{selectedDoctor.name}</h3>
                  <p className="specialization">{selectedDoctor.specialization}</p>
                  <p className="status">
                    <span className={`status-badge ${selectedDoctor.isApproved ? 'approved' : 'pending'}`}>
                      {selectedDoctor.isApproved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </p>
                </div>
              </div>

              <div className="doctor-details-grid">
                <div className="detail-section">
                  <h3>Personal Information</h3>
                  <p><strong>Email:</strong> {selectedDoctor.email}</p>
                  <p><strong>Phone:</strong> {selectedDoctor.phone || 'Not provided'}</p>
                  <p><strong>Joined:</strong> {new Date(selectedDoctor.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="detail-section">
                  <h3>Professional Information</h3>
                  <p><strong>Specialization:</strong> {selectedDoctor.specialization}</p>
                  <p><strong>Experience:</strong> {selectedDoctor.experience} years</p>
                  <p><strong>Qualification:</strong> {selectedDoctor.qualification}</p>
                  <p><strong>Hospital:</strong> {selectedDoctor.hospital || 'Not specified'}</p>
                </div>

                <div className="detail-section">
                  <h3>Additional Information</h3>
                  <p><strong>Bio:</strong> {selectedDoctor.bio || 'No bio available'}</p>
                  <p><strong>About:</strong> {selectedDoctor.about || 'No additional information'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDoctors; 