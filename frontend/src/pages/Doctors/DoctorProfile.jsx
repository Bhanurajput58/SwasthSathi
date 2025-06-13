import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate, useNavigate } from 'react-router-dom';
import { FaUserMd, FaStar, FaHospital, FaPhone, FaEnvelope, FaGraduationCap, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './DoctorProfile.css';

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctorDetails = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/api/doctors/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch doctor details');
        }
        const data = await response.json();
        setDoctor(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorDetails();
  }, [id, user]);

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="doctor-profile-container">
        <div className="loading-message">Loading...</div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to home if not a patient
  if (user.role !== 'patient') {
    return <Navigate to="/" replace />;
  }

  // Show loading state while fetching doctor details
  if (loading) {
    return (
      <div className="doctor-profile-container">
        <div className="loading-message">Loading doctor details...</div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="doctor-profile-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  // Show not found state
  if (!doctor) {
    return (
      <div className="doctor-profile-container">
        <div className="error-message">Doctor not found</div>
      </div>
    );
  }

  return (
    <div className="doctor-profile-container">
      {/* Back Button */}
      <button
        onClick={() => navigate('/patient/all-doctors')}
        className="group flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md mb-4"
      >
        <FaArrowLeft className="transform group-hover:-translate-x-1 transition-transform" />
        <span>Back to Doctors</span>
      </button>

      <div className="profile-header">
        <div className="doctor-image">
          {doctor.photo ? (
            <img src={doctor.photo} alt={doctor.name} />
          ) : (
            <div className="placeholder-image">
              <FaUserMd />
            </div>
          )}
        </div>
        <div className="doctor-basic-info">
          <h1>{doctor.name}</h1>
          <div className="specialization">{doctor.specialization}</div>
          <div className="rating">
            <FaStar className="star-icon" />
            <span>{doctor.avgRating || '4.8'}</span>
            <span className="total-ratings">({doctor.totalRating || '0'} reviews)</span>
          </div>
        </div>
      </div>

      <div className="profile-content">
        <div className="profile-section">
          <h2>About</h2>
          <p>{doctor.about || 'No information available about the doctor.'}</p>
        </div>

        <div className="profile-section">
          <h2>Contact Information</h2>
          <div className="contact-grid">
            <div className="contact-item">
              <FaHospital />
              <span>{doctor.hospital || 'Not specified'}</span>
            </div>
            <div className="contact-item">
              <FaPhone />
              <span>{doctor.phone || 'Not available'}</span>
            </div>
            <div className="contact-item">
              <FaEnvelope />
              <span>{doctor.email || 'Not available'}</span>
            </div>
            <div className="contact-item">
              <FaMapMarkerAlt />
              <span>{doctor.address || 'Not available'}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Education</h2>
          <div className="education-list">
            {doctor.education ? (
              doctor.education.map((edu, index) => (
                <div key={index} className="education-item">
                  <FaGraduationCap />
                  <div>
                    <h3>{edu.degree}</h3>
                    <p>{edu.institution}</p>
                    <p>{edu.year}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No education information available.</p>
            )}
          </div>
        </div>

        <div className="profile-section">
          <h2>Experience</h2>
          <div className="experience-list">
            <div className="experience-item">
              <FaCalendarAlt />
              <div>
                <h3>Years of Experience</h3>
                <p>{doctor.experience || '0'} years</p>
              </div>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Availability</h2>
          <div className="availability-list">
            {doctor.availability ? (
              doctor.availability.map((slot, index) => (
                <div key={index} className="availability-item">
                  <FaClock />
                  <div>
                    <h3>{slot.day}</h3>
                    <p>{slot.timing}</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No availability information available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile; 