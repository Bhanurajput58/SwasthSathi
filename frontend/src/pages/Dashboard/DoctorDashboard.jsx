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
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
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
          const pendingReportsResponse = await fetch(`http://localhost:5000/api/medicalrecords/doctor/${user?._id}/pending-reports`, {
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

            {/* Today's Schedule */}
            <div className="today-schedule-section">
              <h2 className="today-schedule-section h2">Today's Schedule</h2>
              {todayAppointments.length > 0 ? (
                <div className="appointment-list">
                  {todayAppointments.map((appointment) => (
                    <div key={appointment._id} className="appointment-item">
                      <div className="appointment-content">
                        <div className="appointment-details">
                          <p className="appointment-patient-name">{appointment.patient?.name}</p>
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
                      <p className="patient-name">{patient.name}</p>
                      <p className="patient-last-visit">Last Visit: {new Date(patient.lastVisit).toLocaleDateString()}</p>
                      <button className="view-records-button">
                        View Records
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="no-patients-text">No recent patients</p>
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