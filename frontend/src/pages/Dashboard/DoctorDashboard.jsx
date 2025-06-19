import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './DoctorDashboard.css';
import DoctorPatients from './DoctorPatients';

const DoctorDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
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

  const handleViewPatientRecords = (patient) => {
    console.log('View Records clicked for patient:', patient);
    if (!patient || !patient._id) {
      console.error('Invalid patient data:', patient);
      return;
    }
    const path = `/patient-records/${patient._id}`;
    console.log('Navigating to:', path);
    navigate(path, { replace: false });
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
          <div className="doctor-quick-stats-grid">
            <div className="doctor-quick-stat-card">
              <div className="doctor-quick-stat-content">
                <span className="doctor-quick-stat-icon doctor-quick-stat-icon-blue">📅</span>
                <div>
                  <div className="doctor-quick-stat-label">Today's Appointments</div>
                  <div className="doctor-quick-stat-value">{todayAppointments.length}</div>
                </div>
              </div>
            </div>
            <div className="doctor-quick-stat-card">
              <div className="doctor-quick-stat-content">
                <span className="doctor-quick-stat-icon doctor-quick-stat-icon-green">👥</span>
                <div>
                  <div className="doctor-quick-stat-label">Total Patients</div>
                  <div className="doctor-quick-stat-value">{patients.length}</div>
                </div>
              </div>
            </div>
            <div className="doctor-quick-stat-card">
              <div className="doctor-quick-stat-content">
                <span className="doctor-quick-stat-icon doctor-quick-stat-icon-orange">📝</span>
                <div>
                  <div className="doctor-quick-stat-label">Pending Reports</div>
                  <div className="doctor-quick-stat-value">{pendingReportsCount}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="doctor-quick-actions-grid">
          <div className="doctor-quick-action-card">
            <div className="doctor-quick-action-content">
              <span className="doctor-quick-action-icon blue">👥</span>
              <h2 className="doctor-quick-action-title">View All Patients</h2>
            </div>
            <p className="doctor-quick-action-description">See and manage your patient list</p>
            <button className="action-button blue" onClick={() => navigate('/doctor/patients')}>
              View Patients
            </button>
          </div>
          <div className="doctor-quick-action-card">
            <div className="doctor-quick-action-content">
              <span className="doctor-quick-action-icon green">📅</span>
              <h2 className="doctor-quick-action-title">Manage Appointments</h2>
            </div>
            <p className="doctor-quick-action-description">View and schedule appointments</p>
            <button className="action-button green" onClick={() => navigate('/appointments')}>
              Appointments
            </button>
          </div>
          <div className="doctor-quick-action-card">
            <div className="doctor-quick-action-content">
              <span className="doctor-quick-action-icon purple">📝</span>
              <h2 className="doctor-quick-action-title">Add Medical Record</h2>
            </div>
            <p className="doctor-quick-action-description">Create a new medical record for a patient</p>
            <button className="action-button purple" onClick={() => navigate('/add-medical-record')}>
              Add Record
            </button>
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
              <div className="section-header">
                <h2 className="recent-patients-section h2">Recent Patients</h2>
                <button 
                  className="view-all-button"
                  onClick={() => navigate('/doctor/patients')}
                >
                  View All Patients
                </button>
              </div>
              {patients.length > 0 ? (
                <div className="patient-list">
                  {patients.slice(0, 3).map((patient) => (
                    <div key={patient._id} className="patient-item">
                      <div className="patient-info">
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
                        <div className="patient-details">
                          <p className="patient-name">{patient.name || 'Unknown Patient'}</p>
                          <p className="patient-contact">
                            {patient.phone && <span className="contact-item">📞 {patient.phone}</span>}
                            {patient.email && <span className="contact-item">✉️ {patient.email}</span>}
                          </p>
                          <p className="patient-last-visit">
                            Last Visit: {patient.lastVisit ? (() => {
                              const d = new Date(patient.lastVisit);
                              const day = String(d.getDate()).padStart(2, '0');
                              const month = String(d.getMonth() + 1).padStart(2, '0');
                              const year = d.getFullYear();
                              return `${day}/${month}/${year}`;
                            })() : 'No visits yet'}
                          </p>
                        </div>
                      <div className="patient-actions">
                        <button 
                          className="action-button primary"
                          onClick={() => handleViewPatientRecords(patient)}
                        >
                          View Records
                        </button>
                        <button 
                          className="action-button secondary"
                          onClick={() => navigate(`/add-medical-record/${patient._id}`)}
                        >
                          Add Record
                        </button>
                        <button 
                          className="action-button tertiary"
                          onClick={() => navigate(`/schedule-appointment/${patient._id}`)}
                        >
                          Schedule
                        </button>
                      </div>
                      </div>
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