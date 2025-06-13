import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaArrowLeft, FaSearch, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const ManageAppointments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [assigningDoctor, setAssigningDoctor] = useState(false);
  const [assignmentError, setAssignmentError] = useState(null);

  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
  }, [currentPage, searchTerm, statusFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

      let url = `http://localhost:5000/api/admin/appointments?page=${currentPage}`;
      if (searchTerm) url += `&search=${searchTerm}`;
      if (statusFilter) url += `&status=${statusFilter}`;

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appointments');
      }

      const data = await response.json();
      setAppointments(data.appointments);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

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
      setDoctors(data.filter(doctor => doctor.isApproved));
    } catch (error) {
      console.error('Error fetching doctors:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchAppointments();
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);
  };

  const handleAssignDoctor = async () => {
    if (!selectedDoctor) {
      setAssignmentError('Please select a doctor');
      return;
    }

    try {
      setAssigningDoctor(true);
      setAssignmentError(null);
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

      const response = await fetch('http://localhost:5000/api/admin/assign-doctor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          patientId: selectedAppointment.patient._id,
          doctorId: selectedDoctor
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to assign doctor');
      }

      // Show success message
      alert('Doctor assigned successfully!');

      // Refresh appointments
      fetchAppointments();

      // Close modal
      setShowAssignModal(false);
      setSelectedAppointment(null);
      setSelectedDoctor('');
    } catch (error) {
      console.error('Error assigning doctor:', error);
      setAssignmentError(error.message);
    } finally {
      setAssigningDoctor(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'needs_doctor':
        return 'status-badge needs-doctor';
      case 'confirmed':
        return 'status-badge confirmed';
      case 'cancelled':
        return 'status-badge cancelled';
      case 'completed':
        return 'status-badge completed';
      default:
        return 'status-badge';
    }
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-content">
          <div className="loading-state">
            <p>Loading appointments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-container">
        <div className="admin-content">
          <div className="error-state">
            <p>Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="admin-content">
        <div className="admin-header">
          <button className="back-to-dashboard" onClick={() => navigate('/admin')}>
            <FaArrowLeft /> Back
          </button>
          <h1>Manage Appointments</h1>
        </div>

        <div className="appointments-controls">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search by patient or doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit">
              <FaSearch /> Search
            </button>
          </form>

          <div className="filter-buttons">
            <button
              className={statusFilter === '' ? 'active' : ''}
              onClick={() => handleStatusFilter('')}
            >
              All
            </button>
            <button
              className={statusFilter === 'needs_doctor' ? 'active' : ''}
              onClick={() => handleStatusFilter('needs_doctor')}
            >
              Needs Doctor
            </button>
            <button
              className={statusFilter === 'confirmed' ? 'active' : ''}
              onClick={() => handleStatusFilter('confirmed')}
            >
              Confirmed
            </button>
            <button
              className={statusFilter === 'cancelled' ? 'active' : ''}
              onClick={() => handleStatusFilter('cancelled')}
            >
              Cancelled
            </button>
            <button
              className={statusFilter === 'completed' ? 'active' : ''}
              onClick={() => handleStatusFilter('completed')}
            >
              Completed
            </button>
          </div>
        </div>

        <div className="appointments-table">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Doctor</th>
                <th>Date & Time</th>
                <th>Reason</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>
                    <div className="user-info">
                      <img
                        src={appointment.patient?.photo || 'default-avatar.png'}
                        alt={appointment.patient?.name}
                        className="user-avatar"
                      />
                      <div>
                        <p className="user-name">{appointment.patient?.name}</p>
                        <p className="user-email">{appointment.patient?.email}</p>
                      </div>
                    </div>
                  </td>
                  <td>
                    {appointment.doctor ? (
                      <div className="user-info">
                        <img
                          src={appointment.doctor.photo || 'default-avatar.png'}
                          alt={appointment.doctor.name}
                          className="user-avatar"
                        />
                        <div>
                          <p className="user-name">Dr. {appointment.doctor.name}</p>
                          <p className="user-specialization">{appointment.doctor.specialization}</p>
                        </div>
                      </div>
                    ) : (
                      <span className="no-doctor">Not assigned</span>
                    )}
                  </td>
                  <td>
                    <p>{new Date(appointment.date).toLocaleDateString()}</p>
                    <p>{appointment.time}</p>
                  </td>
                  <td>{appointment.reason}</td>
                  <td>
                    <span className={getStatusBadgeClass(appointment.status)}>
                      {appointment.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td>
                    {appointment.status === 'needs_doctor' && (
                      <button
                        className="assign-doctor-button"
                        onClick={() => {
                          setSelectedAppointment(appointment);
                          setShowAssignModal(true);
                        }}
                      >
                        Assign Doctor
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>

        {/* Assign Doctor Modal */}
        {showAssignModal && selectedAppointment && (
          <div className="modal-overlay" onClick={() => setShowAssignModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Assign Doctor to {selectedAppointment.patient.name}</h2>
                <button className="close-button" onClick={() => setShowAssignModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="assign-doctor-section">
                  <select
                    value={selectedDoctor}
                    onChange={(e) => setSelectedDoctor(e.target.value)}
                    className="doctor-select"
                  >
                    <option value="">Select a doctor</option>
                    {doctors.map((doctor) => (
                      <option key={doctor._id} value={doctor._id}>
                        Dr. {doctor.name} - {doctor.specialization} ({doctor.experience} years exp.)
                      </option>
                    ))}
                  </select>
                  {assignmentError && (
                    <p className="error-message">{assignmentError}</p>
                  )}
                  <button
                    className="assign-doctor-button"
                    onClick={handleAssignDoctor}
                    disabled={assigningDoctor}
                  >
                    {assigningDoctor ? 'Assigning...' : 'Assign Doctor'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageAppointments; 