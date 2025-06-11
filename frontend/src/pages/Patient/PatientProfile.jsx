import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaEdit, FaSave, FaTimes, 
  FaHeart, FaShieldAlt, FaUserMd, FaCalendarAlt, FaCameraRetro,
  FaExclamationTriangle, FaPills, FaWeight, FaRuler, FaSmoking,
  FaWineGlass, FaDumbbell, FaIdCard, FaBirthdayCake, FaVenusMars,
  FaTint, FaPhone as FaEmergencyPhone, FaArrowLeft, FaLink
} from 'react-icons/fa';
import './PatientProfile.css';

const PatientProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const fileInputRef = useRef(null);
  const [showImageUrlInput, setShowImageUrlInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [profileData, setProfileData] = useState({
    // Personal Information
    name: '',
    email: '',
    phone: '',
    address: '',
    photo: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    
    // Emergency Contact
    emergencyContact: {
      name: '',
      relationship: '',
      phone: ''
    },
    
    // Medical Information
    medicalHistory: {
      allergies: '',
      chronicConditions: '',
      currentMedications: '',
      previousSurgeries: ''
    },
    
    // Insurance Information
    insurance: {
      provider: '',
      policyNumber: '',
      groupNumber: '',
      expiryDate: ''
    },
    
    // Additional Information
    occupation: '',
    maritalStatus: '',
    height: '',
    weight: '',
    lifestyle: {
      smoking: false,
      alcohol: false,
      exercise: ''
    }
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/patients/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile data');
        }

        const data = await response.json();
        setProfileData(data);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [user]);

  const handleProfileChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [section, field] = name.split('.');
      setProfileData(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setProfileData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Submitting profile data:', profileData);
      
      const response = await fetch(`http://localhost:5000/api/patients/${user._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update profile');
      }

      setShowSuccessMessage(true);
      setIsEditing(false);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(`Failed to update profile: ${error.message}`);
    }
  };

  const handleImageUrlSubmit = async () => {
    if (!imageUrl) {
      alert('Please enter an image URL');
      return;
    }

    try {
      // Basic URL validation
      if (!imageUrl.startsWith('http://') && !imageUrl.startsWith('https://')) {
        alert('Please enter a valid URL starting with http:// or https://');
        return;
      }

      // Check if URL is an image
      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const hasValidExtension = imageExtensions.some(ext => 
        imageUrl.toLowerCase().endsWith(ext)
      );

      if (!hasValidExtension) {
        alert('Please enter a valid image URL (supported formats: jpg, jpeg, png, gif, webp)');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/patients/${user._id}/update-photo`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ photoUrl: imageUrl })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile photo');
      }

      const data = await response.json();
      setProfileData(prev => ({
        ...prev,
        photo: data.photoUrl
      }));

      setShowImageUrlInput(false);
      setImageUrl('');
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error('Error updating profile photo:', error);
      alert('Failed to update profile photo. Please make sure the URL is valid and accessible.');
    }
  };

  const renderField = (label, name, type = 'text', options = null, icon = null) => {
    const getValue = (obj, path) => {
      return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : ''), obj);
    };

    const value = getValue(profileData, name);

    return (
    <div className="profile-field">
      <label className="field-label">
        {icon && <span className="field-icon">{icon}</span>}
        {label}
      </label>
      {isEditing ? (
        <div className="input-wrapper">
          {type === 'select' ? (
              <select 
                name={name} 
                value={value || ''} 
                onChange={handleProfileChange} 
                className="modern-input"
              >
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          ) : type === 'textarea' ? (
            <textarea
              name={name}
                value={value || ''}
              onChange={handleProfileChange}
              rows="3"
              className="modern-input modern-textarea"
              placeholder={`Enter ${label.toLowerCase()}...`}
            />
          ) : (
            <input
              type={type}
              name={name}
                value={value || ''}
              onChange={handleProfileChange}
              className="modern-input"
              placeholder={`Enter ${label.toLowerCase()}...`}
            />
          )}
        </div>
      ) : (
        <div className="profile-value">
            <span className="value-text">{value || 'Not specified'}</span>
        </div>
      )}
    </div>
  );
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: <FaUser /> },
    { id: 'emergency', label: 'Emergency Contact', icon: <FaExclamationTriangle /> },
    { id: 'medical', label: 'Medical History', icon: <FaUserMd /> },
    { id: 'insurance', label: 'Insurance', icon: <FaShieldAlt /> },
    { id: 'additional', label: 'Additional Info', icon: <FaHeart /> }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return (
          <div className="tab-content">
            <div className="fields-grid">
              {renderField('Full Name', 'name', 'text', null, <FaUser />)}
              {renderField('Email Address', 'email', 'email', null, <FaEnvelope />)}
              {renderField('Phone Number', 'phone', 'tel', null, <FaPhone />)}
              {renderField('Address', 'address', 'text', null, <FaMapMarkerAlt />)}
              {renderField('Date of Birth', 'dateOfBirth', 'date', null, <FaBirthdayCake />)}
              {renderField('Gender', 'gender', 'select', [
                { value: '', label: 'Select Gender' },
                { value: 'male', label: 'Male' },
                { value: 'female', label: 'Female' },
                { value: 'other', label: 'Other' }
              ], <FaVenusMars />)}
              {renderField('Blood Group', 'bloodGroup', 'select', [
                { value: '', label: 'Select Blood Group' },
                { value: 'A+', label: 'A+' },
                { value: 'A-', label: 'A-' },
                { value: 'B+', label: 'B+' },
                { value: 'B-', label: 'B-' },
                { value: 'AB+', label: 'AB+' },
                { value: 'AB-', label: 'AB-' },
                { value: 'O+', label: 'O+' },
                { value: 'O-', label: 'O-' }
              ], <FaTint />)}
            </div>
          </div>
        );
      case 'emergency':
        return (
          <div className="tab-content">
            <div className="emergency-banner">
              <FaExclamationTriangle />
              <span>Emergency Contact Information</span>
            </div>
            <div className="fields-grid">
              {renderField('Contact Name', 'emergencyContact.name', 'text', null, <FaUser />)}
              {renderField('Relationship', 'emergencyContact.relationship', 'text', null, <FaHeart />)}
              {renderField('Contact Phone', 'emergencyContact.phone', 'tel', null, <FaEmergencyPhone />)}
            </div>
          </div>
        );
      case 'medical':
        return (
          <div className="tab-content">
            <div className="medical-banner">
              <FaUserMd />
              <span>Medical History & Current Health</span>
            </div>
            <div className="fields-grid">
              {renderField('Allergies', 'medicalHistory.allergies', 'textarea', null, <FaExclamationTriangle />)}
              {renderField('Chronic Conditions', 'medicalHistory.chronicConditions', 'textarea', null, <FaHeart />)}
              {renderField('Current Medications', 'medicalHistory.currentMedications', 'textarea', null, <FaPills />)}
              {renderField('Previous Surgeries', 'medicalHistory.previousSurgeries', 'textarea', null, <FaUserMd />)}
            </div>
          </div>
        );
      case 'insurance':
        return (
          <div className="tab-content">
            <div className="insurance-banner">
              <FaShieldAlt />
              <span>Insurance Coverage Details</span>
            </div>
            <div className="fields-grid">
              {renderField('Insurance Provider', 'insurance.provider', 'text', null, <FaShieldAlt />)}
              {renderField('Policy Number', 'insurance.policyNumber', 'text', null, <FaIdCard />)}
              {renderField('Group Number', 'insurance.groupNumber', 'text', null, <FaIdCard />)}
              {renderField('Expiry Date', 'insurance.expiryDate', 'date', null, <FaCalendarAlt />)}
            </div>
          </div>
        );
      case 'additional':
        return (
          <div className="tab-content">
            <div className="fields-grid">
              {renderField('Occupation', 'occupation', 'text', null, <FaUser />)}
              {renderField('Marital Status', 'maritalStatus', 'select', [
                { value: '', label: 'Select Status' },
                { value: 'single', label: 'Single' },
                { value: 'married', label: 'Married' },
                { value: 'divorced', label: 'Divorced' },
                { value: 'widowed', label: 'Widowed' }
              ], <FaHeart />)}
              {renderField('Height (cm)', 'height', 'number', null, <FaRuler />)}
              {renderField('Weight (kg)', 'weight', 'number', null, <FaWeight />)}
              {renderField('Exercise Habits', 'lifestyle.exercise', 'select', [
                { value: '', label: 'Select Exercise Level' },
                { value: 'sedentary', label: 'Sedentary' },
                { value: 'light', label: 'Light' },
                { value: 'moderate', label: 'Moderate' },
                { value: 'active', label: 'Active' },
                { value: 'very_active', label: 'Very Active' }
              ], <FaDumbbell />)}
            </div>
            
            {isEditing && (
              <div className="lifestyle-section">
                <h3 className="lifestyle-title">Lifestyle Habits</h3>
                <div className="lifestyle-checkboxes">
                  <label className="lifestyle-checkbox">
                    <input
                      type="checkbox"
                      name="lifestyle.smoking"
                      checked={profileData.lifestyle.smoking}
                      onChange={handleProfileChange}
                    />
                    <span className="checkbox-custom"></span>
                    <FaSmoking className="lifestyle-icon" />
                    Smoker
                  </label>
                  <label className="lifestyle-checkbox">
                    <input
                      type="checkbox"
                      name="lifestyle.alcohol"
                      checked={profileData.lifestyle.alcohol}
                      onChange={handleProfileChange}
                    />
                    <span className="checkbox-custom"></span>
                    <FaWineGlass className="lifestyle-icon" />
                    Alcohol Consumer
                  </label>
                </div>
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="patient-profile-container">
      {showSuccessMessage && (
        <div className="success-message">
          <FaSave />
          <span>Profile updated successfully!</span>
        </div>
      )}

      <div className="profile-header">
        <button className="back-button" onClick={() => navigate('/patient')}>
          <FaArrowLeft /> Back
        </button>
        
        <div className="profile-avatar-section">
          <div className="profile-avatar" onClick={isEditing ? () => setShowImageUrlInput(true) : undefined}>
            {profileData.photo ? (
              <img src={profileData.photo} alt={profileData.name} />
            ) : (
              <FaUser className="default-avatar" />
            )}
            {isEditing && (
              <div className="avatar-overlay">
                <FaCameraRetro />
                <span>Click to update photo</span>
              </div>
            )}
          </div>
          
          {showImageUrlInput && (
            <div className="image-url-input">
              <div className="input-group">
                <FaLink className="input-icon" />
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="Enter image URL"
                  className="modern-input"
                />
              </div>
              <div className="url-input-actions">
                <button className="action-btn save-btn" onClick={handleImageUrlSubmit}>
                  <FaSave /> Save
                </button>
                <button className="action-btn cancel-btn" onClick={() => {
                  setShowImageUrlInput(false);
                  setImageUrl('');
                }}>
                  <FaTimes /> Cancel
                </button>
              </div>
            </div>
          )}

          <div className="profile-status">
            <div className="status-dot active"></div>
            <span>Active Patient</span>
          </div>
        </div>
        
        <div className="profile-header-info">
          <h1 className="profile-name">{profileData.name || 'Patient Name'}</h1>
          <p className="profile-email">{profileData.email || 'email@example.com'}</p>
          <div className="profile-badges">
            {profileData.bloodGroup && (
              <span className="badge blood-group">
                <FaTint /> {profileData.bloodGroup}
              </span>
            )}
            {profileData.age && (
              <span className="badge age">
                <FaBirthdayCake /> {profileData.age} years
              </span>
            )}
          </div>
        </div>
        
        <div className="profile-actions">
          {isEditing ? (
            <>
              <button className="action-btn save-btn" onClick={handleSubmit}>
                <FaSave /> Save Changes
              </button>
              <button className="action-btn cancel-btn" onClick={() => setIsEditing(false)}>
                <FaTimes /> Cancel
              </button>
            </>
          ) : (
            <button className="action-btn edit-btn" onClick={() => setIsEditing(true)}>
              <FaEdit /> Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="profile-navigation">
        <div className="nav-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="profile-content">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default PatientProfile;