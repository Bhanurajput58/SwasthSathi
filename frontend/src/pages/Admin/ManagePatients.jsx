import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './ManagePatients.css';

const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI2U1ZTdlYiIvPjx0ZXh0IHg9Ijc1IiB5PSI3NSIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNmI3MjgwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gUGhvdG88L3RleHQ+PC9zdmc+';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error in component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div className="error-state">Something went wrong. Please try again.</div>;
    }

    return this.props.children;
  }
}

const ManagePatients = () => {
  const { user } = useAuth();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [assigningDoctor, setAssigningDoctor] = useState(false);
  const [assignmentError, setAssignmentError] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showDoctorDetailsModal, setShowDoctorDetailsModal] = useState(false);
  const [patientDetails, setPatientDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;

        // Fetch patients
        const patientsResponse = await fetch('http://localhost:5000/api/admin/patients', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!patientsResponse.ok) {
          throw new Error('Failed to fetch patients');
        }

        const patientsData = await patientsResponse.json();
        setPatients(patientsData);

        // Fetch approved doctors with their details
        const doctorsResponse = await fetch('http://localhost:5000/api/admin/doctors', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!doctorsResponse.ok) {
          throw new Error('Failed to fetch doctors');
        }

        const doctorsData = await doctorsResponse.json();
        // Filter only approved doctors with complete information
        const approvedDoctors = doctorsData.filter(doctor => 
          doctor.isApproved && 
          doctor.specialization && 
          doctor.experience
        );
        setDoctors(approvedDoctors);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchPatientDetails = async (patientId) => {
    try {
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log('Fetching patient details for ID:', patientId);
      const response = await fetch(`http://localhost:5000/api/admin/patients/${patientId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      console.log('Response status:', response.status);
      const contentType = response.headers.get('content-type');
      console.log('Response content type:', contentType);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error response:', errorText);
        throw new Error(`Failed to fetch patient details: ${response.status} ${response.statusText}`);
      }

      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Server returned non-JSON response');
      }

      const data = await response.json();
      console.log('Received patient details:', data);
      setPatientDetails(data);
    } catch (error) {
      console.error('Error fetching patient details:', error);
      setError(error.message);
    }
  };

  const handleViewDetails = async (patient) => {
    setSelectedPatient(patient);
    await fetchPatientDetails(patient._id);
    setShowDoctorDetailsModal(true);
  };

  const handleCloseDoctorDetailsModal = () => {
    setShowDoctorDetailsModal(false);
    setSelectedPatient(null);
    setPatientDetails(null);
  };

  const handleCloseModal = () => {
    setSelectedPatient(null);
  };

  const handleOpenAssignModal = (patient) => {
    setSelectedPatient(patient);
    setSelectedDoctor('');
    setAssignmentError(null);
    setShowAssignModal(true);
  };

  const handleCloseAssignModal = () => {
    setShowAssignModal(false);
    setSelectedPatient(null);
    setSelectedDoctor('');
    setAssignmentError(null);
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
          patientId: selectedPatient._id,
          doctorId: selectedDoctor
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to assign doctor');
      }

      // Show success message
      alert('Doctor assigned successfully!');

      // Refresh patient list
      const patientsResponse = await fetch('http://localhost:5000/api/admin/patients', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (patientsResponse.ok) {
        const updatedPatients = await patientsResponse.json();
        setPatients(updatedPatients);
      }

      // Close modal
      handleCloseAssignModal();
    } catch (error) {
      console.error('Error assigning doctor:', error);
      setAssignmentError(error.message);
    } finally {
      setAssigningDoctor(false);
    }
  };

  const renderPatientDetails = () => {
    if (!selectedPatient || !patientDetails) return null;

    return (
      <ErrorBoundary>
        <div className="modal-body">
          <div className="patient-profile-header">
            <div className="patient-avatar">
              <img 
                src={selectedPatient.photo || PLACEHOLDER_IMAGE} 
                alt={selectedPatient.name || 'Patient'}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = PLACEHOLDER_IMAGE;
                }}
              />
            </div>
            <div className="patient-profile-info">
              <h2>{selectedPatient.name || 'Unknown Patient'}</h2>
              <span className="status-badge">Patient</span>
            </div>
          </div>

          <div className="patient-details-grid">
            <div className="detail-section">
              <h3>Personal Information</h3>
              <div className="detail-item">
                <span className="detail-label">Email:</span>
                <span className="detail-value">{selectedPatient.email || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Phone:</span>
                <span className="detail-value">{selectedPatient.phone || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Gender:</span>
                <span className="detail-value">{selectedPatient.gender || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Age:</span>
                <span className="detail-value">{selectedPatient.age || 'Not provided'}</span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Medical Information</h3>
              <div className="detail-item">
                <span className="detail-label">Blood Group:</span>
                <span className="detail-value">{patientDetails.bloodGroup || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Medical History:</span>
                <span className="detail-value">
                  {patientDetails.medicalHistory ? 
                    Object.entries(patientDetails.medicalHistory)
                      .map(([key, value]) => `${key}: ${value}`)
                      .join(', ') 
                    : 'No medical history recorded'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Allergies:</span>
                <span className="detail-value">
                  {Array.isArray(patientDetails.allergies) 
                    ? patientDetails.allergies.join(', ') 
                    : 'No allergies recorded'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Current Medications:</span>
                <span className="detail-value">
                  {Array.isArray(patientDetails.currentMedications) 
                    ? patientDetails.currentMedications.join(', ') 
                    : 'No current medications'}
                </span>
              </div>
            </div>

            <div className="detail-section">
              <h3>Additional Information</h3>
              <div className="detail-item">
                <span className="detail-label">Address:</span>
                <span className="detail-value">{patientDetails.address || 'Not provided'}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Emergency Contact:</span>
                <span className="detail-value">
                  {patientDetails.emergencyContact ? (
                    <>
                      {patientDetails.emergencyContact.name} ({patientDetails.emergencyContact.relationship})
                      <br />
                      Phone: {patientDetails.emergencyContact.phone}
                    </>
                  ) : 'Not provided'}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Joined Date:</span>
                <span className="detail-value">
                  {patientDetails.createdAt ? new Date(patientDetails.createdAt).toLocaleDateString() : 'Not available'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </ErrorBoundary>
    );
  };

  if (loading) {
    return (
      <div className="admin-container">
        <div className="admin-content">
          <div className="loading-state">
            <p>Loading patients data...</p>
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
          <h1>Manage Patients</h1>
        </div>

        <div className="users-grid">
          {patients.map((patient) => (
            <div key={patient._id} className="user-card-patients">
              <div className="user-avatar">
                <img 
                  src={patient.photo || PLACEHOLDER_IMAGE} 
                  alt={patient.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = PLACEHOLDER_IMAGE;
                  }}
                />
              </div>
              <div className="user-info-patients">
                <h3>{patient.name}</h3>
              </div>
              <div className="user-actions">
                <button 
                  className="view-details-button"
                  onClick={() => handleViewDetails(patient)}
                >
                  View Details
                </button>
                <button 
                  className="assign-doctor-button"
                  onClick={() => handleOpenAssignModal(patient)}
                >
                  Assign Doctor
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Patient Details Modal */}
        {showDoctorDetailsModal && selectedPatient && (
          <div className="modal-overlay" onClick={handleCloseDoctorDetailsModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Patient Details</h2>
                <button className="close-button" onClick={handleCloseDoctorDetailsModal}>×</button>
              </div>
              {renderPatientDetails()}
            </div>
          </div>
        )}

        {/* Assign Doctor Modal */}
        {showAssignModal && selectedPatient && (
          <div className="modal-overlay" onClick={handleCloseAssignModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Assign Doctor to {selectedPatient.name}</h2>
                <button className="close-button" onClick={handleCloseAssignModal}>×</button>
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
                         {doctor.name} - {doctor.specialization} ({doctor.experience} years exp.)
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

export default ManagePatients; 