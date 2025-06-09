import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const ManageDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    fetchDoctors();
  }, []);

  if (loading) return <div className="admin-container">Loading...</div>;
  if (error) return <div className="admin-container">Error: {error}</div>;

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1>Manage Doctors</h1>
        <button className="action-button cyan" onClick={() => navigate('/admin')}>
          Back to Dashboard
        </button>
      </div>

      <div className="users-grid">
        {doctors.map((doctor) => (
          <div key={doctor._id} className="user-card">
            <div className="user-info">
              <h3>{doctor.name}</h3>
              <p>Email: {doctor.email}</p>
              <p>Specialization: {doctor.specialization}</p>
              <p>Experience: {doctor.experience} years</p>
              <p>Joined: {new Date(doctor.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="user-actions">
              <button 
                className="action-button"
                onClick={() => navigate(`/doctors/${doctor._id}`)}
              >
                View Details
              </button>
              <button 
                className="action-button gray"
                onClick={() => navigate(`/admin/doctors/${doctor._id}/edit`)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageDoctors; 