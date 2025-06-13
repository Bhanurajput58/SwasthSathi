import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FaSearch, FaUserMd, FaStar, FaHospital, FaPhone, FaEnvelope } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './AllDoctors.css';

const AllDoctors = () => {
  const { user, loading: authLoading } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

  const specializations = [
    "All",
    "Cardiologist",
    "Neurologist",
    "Dermatologist",
    "Pediatrician",
    "Orthopedist",
    "Gynecologist"
  ];

  useEffect(() => {
    const fetchDoctors = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/doctors', {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
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

    fetchDoctors();
  }, [user]);

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="all-doctors-container">
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

  if (loading) {
    return (
      <div className="all-doctors-container">
        <div className="loading-message">Loading doctors...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="all-doctors-container">
        <div className="error-message">Error: {error}</div>
      </div>
    );
  }

  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (doctor.hospital && doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesSpecialization = selectedSpecialization === 'All' ||
      doctor.specialization === selectedSpecialization;
    return matchesSearch && matchesSpecialization;
  });

  return (
    <div className="all-doctors-container">
      {/* Header Section */}
      <div className="header-section">
        <h1>Our Medical Experts</h1>
        <p>Find and connect with the best doctors in your area</p>
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search by name or hospital..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="specialization-filters">
          {specializations.map((spec) => (
            <button
              key={spec}
              className={`filter-button ${selectedSpecialization === spec ? 'active' : ''}`}
              onClick={() => setSelectedSpecialization(spec)}
            >
              {spec}
            </button>
          ))}
        </div>
      </div>

      {/* Doctors List */}
      <div className="doctors-list">
        {filteredDoctors.map((doctor) => (
          <div key={doctor._id} className="doctor-card">
            <div className="doctor-image">
              {doctor.photo ? (
                <img src={doctor.photo} alt={doctor.name} />
              ) : (
                <div className="placeholder-image">
                  <FaUserMd />
                </div>
              )}
            </div>

            <div className="doctor-info">
              <h2>{doctor.name}</h2>
              <div className="specialization">{doctor.specialization}</div>
              
              <div className="rating">
                <FaStar className="star-icon" />
                <span>{doctor.avgRating || '4.8'}</span>
                <span className="total-ratings">({doctor.totalRating || '0'} reviews)</span>
              </div>

              <div className="details-grid">
                <div className="detail-item">
                  <FaHospital />
                  <span>{doctor.hospital || 'Not specified'}</span>
                </div>
                <div className="detail-item">
                  <FaPhone />
                  <span>{doctor.phone || 'Not available'}</span>
                </div>
                <div className="detail-item">
                  <FaEnvelope />
                  <span>{doctor.email || 'Not available'}</span>
                </div>
              </div>

              <div className="doctor-actions">
                <Link to={`/patient/doctors/${doctor._id}`} className="view-profile-btn">
                  View Profile
                </Link>
                <Link to={`/book-appointment/${doctor._id}`} className="book-appointment-btn">
                  Book Appointment
                </Link>
              </div>
            </div>
          </div>
        ))}

        {filteredDoctors.length === 0 && (
          <div className="no-results">
            <h3>No doctors found</h3>
            <p>Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllDoctors; 