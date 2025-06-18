import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './DoctorDashboard.css';
import { useNavigate } from 'react-router-dom';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [todayAppointments, setTodayAppointments] = useState([]);
  const [pendingReportsCount, setPendingReportsCount] = useState(0);
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showPatientRecordsModal, setShowPatientRecordsModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientMedicalRecords, setPatientMedicalRecords] = useState([]);
  const [showAllPatientsModal, setShowAllPatientsModal] = useState(false);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    specialization: '',
    experience: '',
    hospital: '',
    phone: '',
    qualification: '',
    bio: '',
    about: '',
    photo: ''
  });

  const [imagePreview, setImagePreview] = useState('');
  const [doctorData, setDoctorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch doctor profile data
  const fetchDoctorProfile = async () => {
    try {
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`http://localhost:5000/api/doctors/${user?._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch doctor profile');
      }

      const doctorData = await response.json();
      console.log('Fetched doctor data:', doctorData); 
      
      const newProfileData = {
        name: doctorData.name || '',
        email: doctorData.email || '',
        specialization: doctorData.specialization || '',
        experience: doctorData.experience || '',
        hospital: doctorData.hospital || '',
        phone: doctorData.phone || '',
        qualification: doctorData.qualification || '',
        bio: doctorData.bio || '',
        about: doctorData.about || '',
        photo: doctorData.photo || profileData.photo || '' 
      };
      
      setProfileData(newProfileData);
      setImagePreview(newProfileData.photo);
      
    } catch (error) {
      console.error('Error fetching doctor profile:', error);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const updatedProfileData = {
        ...profileData,
        photo: profileData.photo || ''
      };

      const response = await fetch(`http://localhost:5000/api/doctors/${user?._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedProfileData)
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedDoctor = await response.json();
      
      const newProfileData = {
        ...updatedDoctor,
        photo: updatedDoctor.photo || profileData.photo || ''
      };

      setProfileData(newProfileData);
      setImagePreview(newProfileData.photo);
      setShowEditModal(false);
      
      setShowSuccessMessage(true);
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);

      await fetchDoctorProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'photo') {
      let formattedUrl = value;
      
      if (value.startsWith('data:image')) {
        formattedUrl = value;
      } 
      else if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
        formattedUrl = `https://${value}`;
      }

      setProfileData(prev => ({
        ...prev,
        [name]: formattedUrl
      }));
      setImagePreview(formattedUrl);
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const isValidImageUrl = (url) => {
    if (!url) return false;
    if (url.startsWith('data:image')) return true;
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Function to fetch medical records
  const fetchMedicalRecords = async () => {
    try {
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`http://localhost:5000/api/medical-records/doctor`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch medical records');
      }

      const records = await response.json();
      setMedicalRecords(records.slice(0, 5)); // Get only the 5 most recent records
    } catch (error) {
      console.error('Error fetching medical records:', error);
    }
  };

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        
        if (!token) {
          throw new Error('Authentication token not found');
        }

        // Fetch doctor profile 
        await fetchDoctorProfile();
        // Fetch medical records
        await fetchMedicalRecords();

        // Fetch appointments
        try {
          const appointmentsResponse = await fetch(`http://localhost:5000/api/appointments/doctor/${user?._id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!appointmentsResponse.ok) {
            console.warn('Failed to fetch appointments');
          } else {
            const appointmentsData = await appointmentsResponse.json();
            setAppointments(appointmentsData);

            const today = new Date().toDateString();
            const todayAppts = appointmentsData.filter(appt => 
              new Date(appt.date).toDateString() === today
            );
            setTodayAppointments(todayAppts);
          }
        } catch (appointmentsError) {
          console.warn('Error fetching appointments:', appointmentsError);
        }

        // Fetch patients associated with the doctor
        try {
          const patientsResponse = await fetch(`http://localhost:5000/api/patients/doctor/${user?._id}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!patientsResponse.ok) {
            console.warn('Failed to fetch patients');
          } else {
            const patientsData = await patientsResponse.json();
            setPatients(patientsData);
          }
        } catch (patientsError) {
          console.warn('Error fetching patients:', patientsError);
        }

        // Fetch pending reports
        try {
          const pendingReportsResponse = await fetch(`http://localhost:5000/api/medical-records/doctor/${user?._id}/pending-reports`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!pendingReportsResponse.ok) {
            console.warn('Failed to fetch pending reports');
          } else {
            const pendingReportsData = await pendingReportsResponse.json();
            setPendingReportsCount(pendingReportsData.count);
          }
        } catch (pendingReportsError) {
          console.warn('Error fetching pending reports:', pendingReportsError);
        }

        // Fetch doctor data
        const response = await fetch('http://localhost:5000/api/doctors/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch doctor data');
        }

        const data = await response.json();
        setDoctorData(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      fetchDoctorData();
    }
  }, [user?._id]);

  const handleOpenEditModal = () => {
    fetchDoctorProfile(); 
    setShowEditModal(true);
  };

  const handleViewPatientRecords = async (patient) => {
    try {
      const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Fetch complete patient profile details using the doctor-specific endpoint
      const patientResponse = await fetch(`http://localhost:5000/api/patients/doctor/patient/${patient._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!patientResponse.ok) {
        throw new Error('Failed to fetch patient details');
      }

      const patientDetails = await patientResponse.json();

      // Fetch patient's medical records using the doctor-specific endpoint
      const recordsResponse = await fetch(`http://localhost:5000/api/medical-records/doctor/patient/${patient._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!recordsResponse.ok) {
        throw new Error('Failed to fetch patient records');
      }

      const records = await recordsResponse.json();
      setPatientMedicalRecords(records);
      setSelectedPatient(patientDetails);
      setShowPatientRecordsModal(true);
    } catch (error) {
      console.error('Error fetching patient data:', error);
      alert(`Failed to fetch patient data: ${error.message}`);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (loading) return <div className="doctor-dashboard-container">Loading...</div>;
  if (error) return <div className="doctor-dashboard-container">Error: {error}</div>;
  if (!doctorData) return <div className="doctor-dashboard-container">No data available</div>;

  return (
    <div className="doctor-dashboard-container">
      {showSuccessMessage && (
        <div className="success-message">
          Profile updated successfully!
        </div>
      )}
      <div className="doctor-dashboard-content">
        <div className="welcome-section">
          <div className="welcome-header">
            <div className="welcome-profile-icon">
              {doctorData.photo ? (
                <img 
                  src={doctorData.photo} 
                  alt={doctorData.name}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.parentElement.textContent = doctorData.name.charAt(0);
                  }}
                />
              ) : (
                doctorData.name.charAt(0)
              )}
            </div>
            <div className="welcome-actions">
              <button 
                className="edit-profile-btn"
                onClick={handleOpenEditModal}
              >
                Edit Profile
              </button>
              <button 
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
          <div className="welcome-content">
            <h1>Welcome, {doctorData.name}</h1>
            <p>Manage your patients and medical records</p>
            {!doctorData.isApproved && (
              <div className="approval-status pending">
                <p>Your account is pending approval from the administrator.</p>
                <p>You will be able to access all features once approved.</p>
              </div>
            )}
          </div>
        </div>

        {doctorData.isApproved ? (
          <>
            {/* Edit Profile Modal */}
            {showEditModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <div className="modal-header">
                    <h2>Edit Profile</h2>
                    <button 
                      className="close-modal-btn"
                      onClick={() => setShowEditModal(false)}
                    >
                      ×
                    </button>
                  </div>
                  <form onSubmit={handleProfileSubmit} className="profile-edit-form">
                    {/* Profile Image Section */}
                    <div className="profile-image-section">
                      <div className="image-preview">
                        {imagePreview && isValidImageUrl(imagePreview) ? (
                          <img 
                            src={imagePreview} 
                            alt="Profile preview" 
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = '';
                              setImagePreview('');
                            }}
                          />
                        ) : (
                          <div className="no-image">No image</div>
                        )}
                      </div>
                      <div className="image-upload-options">
                        <div className="upload-option">
                          <label>Image URL:</label>
                          <input
                            type="url"
                            name="photo"
                            placeholder="https://example.com/your-image.jpg"
                            value={profileData.photo}
                            onChange={handleProfileChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Form Fields */}
                    <div className="form-group">
                      <label>Name:</label>
                      <input
                        type="text"
                        name="name"
                        value={profileData.name}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Email:</label>
                      <input
                        type="email"
                        name="email"
                        value={profileData.email}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Specialization:</label>
                      <input
                        type="text"
                        name="specialization"
                        value={profileData.specialization}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Experience (years):</label>
                      <input
                        type="number"
                        name="experience"
                        value={profileData.experience}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Hospital:</label>
                      <input
                        type="text"
                        name="hospital"
                        value={profileData.hospital}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="form-group">
                      <label>Phone:</label>
                      <input
                        type="tel"
                        name="phone"
                        value={profileData.phone}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Qualification:</label>
                      <input
                        type="text"
                        name="qualification"
                        value={profileData.qualification}
                        onChange={handleProfileChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Bio:</label>
                      <textarea
                        name="bio"
                        value={profileData.bio}
                        onChange={handleProfileChange}
                        maxLength="50"
                      />
                    </div>
                    <div className="form-group">
                      <label>About:</label>
                      <textarea
                        name="about"
                        value={profileData.about}
                        onChange={handleProfileChange}
                      />
                    </div>
                    <div className="modal-actions">
                      <button type="button" className="cancel-btn" onClick={() => setShowEditModal(false)}>
                        Cancel
                      </button>
                      <button type="submit" className="save-btn">
                        Save Changes
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Patient Records Modal */}
            {showPatientRecordsModal && selectedPatient && (
              <div className="modal-overlay">
                <div className="modal-content patient-records-modal">
                  <div className="modal-header">
                    <h2>Patient Records - {selectedPatient.name}</h2>
                    <button 
                      className="close-modal-btn"
                      onClick={() => {
                        setShowPatientRecordsModal(false);
                        setSelectedPatient(null);
                        setPatientMedicalRecords([]);
                      }}
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="patient-info-section">
                    <div className="patient-basic-info">
                      <div className="info-row">
                        <span className="info-label">Name:</span>
                        <span className="info-value">{selectedPatient.name}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Email:</span>
                        <span className="info-value">{selectedPatient.email || 'Not available'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Phone:</span>
                        <span className="info-value">{selectedPatient.phone || 'Not available'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Date of Birth:</span>
                        <span className="info-value">
                          {selectedPatient.dateOfBirth 
                            ? new Date(selectedPatient.dateOfBirth).toLocaleDateString()
                            : 'Not available'
                          }
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Age:</span>
                        <span className="info-value">
                          {selectedPatient.dateOfBirth 
                            ? `${new Date().getFullYear() - new Date(selectedPatient.dateOfBirth).getFullYear()} years`
                            : 'Not available'
                          }
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Gender:</span>
                        <span className="info-value">{selectedPatient.gender || 'Not available'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Blood Group:</span>
                        <span className="info-value">{selectedPatient.bloodGroup || 'Not available'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Address:</span>
                        <span className="info-value">{selectedPatient.address || 'Not available'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">City:</span>
                        <span className="info-value">{selectedPatient.city || 'Not available'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">State:</span>
                        <span className="info-value">{selectedPatient.state || 'Not available'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Pincode:</span>
                        <span className="info-value">{selectedPatient.pincode || 'Not available'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Emergency Contact:</span>
                        <span className="info-value">{selectedPatient.emergencyContact || 'Not available'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Emergency Phone:</span>
                        <span className="info-value">{selectedPatient.emergencyPhone || 'Not available'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Insurance Provider:</span>
                        <span className="info-value">{selectedPatient.insuranceProvider || 'Not available'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Insurance Number:</span>
                        <span className="info-value">{selectedPatient.insuranceNumber || 'Not available'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Allergies:</span>
                        <span className="info-value">{selectedPatient.allergies || 'None known'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Medical History:</span>
                        <span className="info-value">{selectedPatient.medicalHistory || 'No significant history'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Current Medications:</span>
                        <span className="info-value">{selectedPatient.currentMedications || 'None'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Occupation:</span>
                        <span className="info-value">{selectedPatient.occupation || 'Not available'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Marital Status:</span>
                        <span className="info-value">{selectedPatient.maritalStatus || 'Not available'}</span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Last Visit:</span>
                        <span className="info-value">
                          {selectedPatient.lastVisit 
                            ? new Date(selectedPatient.lastVisit).toLocaleDateString()
                            : 'No visits yet'
                          }
                        </span>
                      </div>
                      <div className="info-row">
                        <span className="info-label">Registration Date:</span>
                        <span className="info-value">
                          {selectedPatient.createdAt 
                            ? new Date(selectedPatient.createdAt).toLocaleDateString()
                            : 'Not available'
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="medical-records-section">
                    <h3>Medical Records</h3>
                    {patientMedicalRecords.length > 0 ? (
                      <div className="records-list">
                        {patientMedicalRecords.map((record) => (
                          <div key={record._id} className="record-item">
                            <div className="record-header">
                              <span className="record-date">
                                {new Date(record.createdAt).toLocaleDateString()}
                              </span>
                              <span className={`status-badge ${record.status || 'pending'}`}>
                                {(record.status || 'pending').charAt(0).toUpperCase() + (record.status || 'pending').slice(1)}
                              </span>
                            </div>
                            <div className="record-content">
                              <p><strong>Diagnosis:</strong> {record.diagnosis || 'No diagnosis available'}</p>
                              <p><strong>Symptoms:</strong> {record.symptoms || 'No symptoms recorded'}</p>
                              <p><strong>Treatment:</strong> {record.treatment || 'No treatment recorded'}</p>
                              <p><strong>Prescription:</strong> {record.prescription || 'No prescription'}</p>
                              <p><strong>Notes:</strong> {record.notes || 'No additional notes'}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="no-records-text">No medical records found for this patient.</p>
                    )}
                  </div>

                  <div className="modal-actions">
                    <button 
                      type="button" 
                      className="cancel-btn" 
                      onClick={() => {
                        setShowPatientRecordsModal(false);
                        setSelectedPatient(null);
                        setPatientMedicalRecords([]);
                      }}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* All Patients Modal */}
            {showAllPatientsModal && (
              <div className="modal-overlay">
                <div className="modal-content all-patients-modal">
                  <div className="modal-header">
                    <h2>All Patients ({patients.length})</h2>
                    <button 
                      className="close-modal-btn"
                      onClick={() => setShowAllPatientsModal(false)}
                    >
                      ×
                    </button>
                  </div>
                  
                  <div className="patients-grid">
                    {patients.length > 0 ? (
                      patients.map((patient) => (
                        <div key={patient._id} className="patient-card">
                          <div className="patient-card-header">
                            <div className="patient-avatar">
                              {patient.photo ? (
                                <img 
                                  src={patient.photo} 
                                  alt={patient.name}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.style.display = 'none';
                                    e.target.parentElement.textContent = patient.name.charAt(0);
                                  }}
                                />
                              ) : (
                                patient.name.charAt(0)
                              )}
                            </div>
                            <div className="patient-info">
                              <h3 className="patient-name">{patient.name}</h3>
                              <p className="patient-email">{patient.email || 'No email'}</p>
                              <p className="patient-phone">{patient.phone || 'No phone'}</p>
                            </div>
                          </div>
                          <div className="patient-card-actions">
                            <button 
                              className="view-records-btn"
                              onClick={() => {
                                setShowAllPatientsModal(false);
                                handleViewPatientRecords(patient);
                              }}
                            >
                              View Records
                            </button>
                            <button 
                              className="book-appointment-btn"
                              onClick={() => {
                                setShowAllPatientsModal(false);
                                navigate('/appointments');
                              }}
                            >
                              Book Appointment
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="no-patients-message">
                        <p>No patients found. Patients will appear here once they book appointments with you.</p>
                      </div>
                    )}
                  </div>

                  <div className="modal-actions">
                    <button 
                      type="button" 
                      className="cancel-btn" 
                      onClick={() => setShowAllPatientsModal(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Stats*/}
            <div className="quick-stats-grid">
              <div className="quick-stat-card">
                <h2 className="quick-stat-card h2">Today's Appointments</h2>
                <p className="quick-stat-card p text-blue">{todayAppointments.length}</p>
              </div>
              <div className="quick-stat-card">
                <h2 className="quick-stat-card h2">Total Patients</h2>
                <p className="quick-stat-card p text-green">{patients.length}</p>
              </div>
              <div className="quick-stat-card">
                <h2 className="quick-stat-card h2">Pending Reports</h2>
                <p className="quick-stat-card p text-orange">{pendingReportsCount}</p>
              </div>
            </div>

            {/* Quick Actions Section */}
            <div className="quick-actions-section">
              <div className="doctor-quick-action-card">
                <h2 className="doctor-quick-action-card h2">Quick Actions</h2>
                <div className="quick-actions">
                  <button 
                    className="quick-action-btn"
                    onClick={() => setShowAllPatientsModal(true)}
                  >
                    View All Patients ({patients.length})
                  </button>
                  <button 
                    className="quick-action-btn"
                    onClick={() => navigate('/appointments')}
                  >
                    Manage Appointments
                  </button>
                </div>
              </div>
            </div>

            {/* Today's Schedule */}
            <div className="today-schedule-section">
              <h2 className="today-schedule-section h2">Today's Schedule</h2>
              {todayAppointments.length > 0 ? (
                <div className="appointment-list">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment._id} className="appointment-item">
                      <div className="appointment-content">
                        <div className="appointment-details">
                          <p className="appointment-patient-name">{appointment.patient?.name || 'Unknown Patient'}</p>
                          <p className="appointment-time-purpose">Time: {appointment.time}</p>
                          <p className="appointment-time-purpose">Purpose: {appointment.purpose}</p>
                        </div>
                        <div className="appointment-actions">
                          <button className="action-button">
                            Start Consultation
                          </button>
                          <button className="action-button gray">
                            Reschedule
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-appointments-text">No appointments scheduled for today</p>
              )}
            </div>

            {/* Recent Patients */}
            <div className="recent-patients-section">
              <h2 className="recent-patients-section h2">Recent Patients</h2>
              {patients.length > 0 ? (
                <div className="patient-list">
                  {patients.slice(0, 5).map((patient) => (
                    <div key={patient._id} className="patient-item">
                      <p className="patient-name">{patient.name || 'Unknown Patient'}</p>
                      <p className="patient-last-visit">Last Visit: {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'No visits yet'}</p>
                      <button className="view-records-button" onClick={() => handleViewPatientRecords(patient)}>
                        View Records
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-patients-text">No recent patients</p>
              )}
            </div>

            {/* Recent Medical Records */}
            <div className="recent-medical-records-section">
              <h2 className="recent-medical-records-section h2">Recent Medical Records</h2>
              {medicalRecords.length > 0 ? (
                <div className="medical-records-list">
                  {medicalRecords.map((record) => (
                    <div key={record._id} className="medical-record-item">
                      <div className="medical-record-header">
                        <h3>{record.patient?.name || 'Unknown Patient'}</h3>
                        <span className={`status-badge ${record.status || 'pending'}`}>
                          {(record.status || 'pending').charAt(0).toUpperCase() + (record.status || 'pending').slice(1)}
                        </span>
                      </div>
                      <div className="medical-record-content">
                        <p className="diagnosis"><strong>Diagnosis:</strong> {record.diagnosis || 'No diagnosis available'}</p>
                        <p className="date">Date: {record.createdAt ? new Date(record.createdAt).toLocaleDateString() : 'Date not available'}</p>
                      </div>
                      <div className="medical-record-actions">
                        <button className="view-details-button">
                          View Details
                        </button>
                        {(record.status || 'pending') === 'pending' && (
                          <button className="complete-button">
                            Mark as Complete
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-records-text">No recent medical records</p>
              )}
            </div>
          </>
        ) : (
          <div className="pending-approval-message">
            <h2>Account Pending Approval</h2>
            <p>Your account is currently under review. Once approved, you'll have access to:</p>
            <ul>
              <li>View and manage appointments</li>
              <li>Access patient records</li>
              <li>Update your profile and availability</li>
              <li>And more...</li>
            </ul>
            <p>Please check back later or contact the administrator for more information.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard; 