import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './ViewPatientRecords.css';

const ViewPatientRecords = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [patientDetails, setPatientDetails] = useState(null);
  const [medicalRecords, setMedicalRecords] = useState([]);

  console.log('ViewPatientRecords - Component mounted');
  console.log('ViewPatientRecords - Patient ID from params:', patientId);

  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        console.log('ViewPatientRecords - Fetching patient data...');
        setLoading(true);
        const token = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : null;
        
        console.log('ViewPatientRecords - Auth token present:', !!token);
        
        if (!token) {
          throw new Error('Authentication token not found');
        }

        // Fetch patient details
        const patientResponse = await fetch(`http://localhost:5000/api/patients/doctor/patient/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!patientResponse.ok) {
          throw new Error('Failed to fetch patient details');
        }

        // Fetch medical records
        const recordsResponse = await fetch(`http://localhost:5000/api/medical-records/doctor/patient/${patientId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!recordsResponse.ok) {
          throw new Error('Failed to fetch medical records');
        }

        const [patientData, recordsData] = await Promise.all([
          patientResponse.json(),
          recordsResponse.json()
        ]);

        setPatientDetails(patientData);
        setMedicalRecords(recordsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (patientId) {
      fetchPatientData();
    }
  }, [patientId]);

  if (loading) {
    return <div className="loading-container">Loading patient records...</div>;
  }

  if (error) {
    return <div className="error-container">Error: {error}</div>;
  }

  if (!patientDetails) {
    return <div className="error-container">No patient data found</div>;
  }

  return (
    <div className="patient-records-container">
      <div className="patient-records-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
        <h1>Patient Records</h1>
      </div>

      <div className="patient-info-card">
        <div className="patient-basic-info">
          <h2>{patientDetails.name}</h2>
          <p>ID: {patientDetails._id}</p>
          <p>Age: {patientDetails.dateOfBirth ? 
            `${new Date().getFullYear() - new Date(patientDetails.dateOfBirth).getFullYear()} years` 
            : 'Not available'}
          </p>
          <p>Gender: {patientDetails.gender || 'Not specified'}</p>
        </div>
        <div className="patient-contact-info">
          <p>📞 {patientDetails.phone || 'No phone'}</p>
          <p>✉️ {patientDetails.email || 'No email'}</p>
        </div>
      </div>

      <div className="records-grid">
        <div className="patient-details-section">
          <h3>Patient Details</h3>
          <div className="details-grid">
            <div className="detail-item">
              <label>Blood Group</label>
              <span>{patientDetails.bloodGroup || 'Not specified'}</span>
            </div>
            <div className="detail-item">
              <label>Marital Status</label>
              <span>{patientDetails.maritalStatus || 'Not specified'}</span>
            </div>
            <div className="detail-item">
              <label>Occupation</label>
              <span>{patientDetails.occupation || 'Not specified'}</span>
            </div>
            <div className="detail-item full-width">
              <label>Address</label>
              <span>{patientDetails.address || 'Not specified'}</span>
            </div>
            <div className="detail-item">
              <label>City</label>
              <span>{patientDetails.city || 'Not specified'}</span>
            </div>
            <div className="detail-item">
              <label>State</label>
              <span>{patientDetails.state || 'Not specified'}</span>
            </div>
          </div>
        </div>

        <div className="medical-info-section">
          <h3>Medical Information</h3>
          <div className="details-grid">
            <div className="detail-item full-width">
              <label>Allergies</label>
              <span>{patientDetails.allergies || 'None known'}</span>
            </div>
            <div className="detail-item full-width">
              <label>Medical History</label>
              <span>{patientDetails.medicalHistory || 'No significant history'}</span>
            </div>
            <div className="detail-item full-width">
              <label>Current Medications</label>
              <span>{patientDetails.currentMedications || 'None'}</span>
            </div>
          </div>
        </div>

        <div className="emergency-contact-section">
          <h3>Emergency Contact</h3>
          <div className="details-grid">
            <div className="detail-item">
              <label>Name</label>
              <span>{patientDetails.emergencyContact?.name || 'Not provided'}</span>
            </div>
            <div className="detail-item">
              <label>Phone</label>
              <span>{patientDetails.emergencyContact?.phone || 'Not provided'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="medical-records-section">
        <div className="section-header">
          <h3>Medical Records History</h3>
          <button 
            className="add-record-button"
            onClick={() => navigate(`/add-medical-record/${patientId}`)}
          >
            Add New Record
          </button>
        </div>
        
        {medicalRecords.length > 0 ? (
          <div className="records-timeline">
            {medicalRecords.map((record) => (
              <div key={record._id} className="record-card">
                <div className="record-header">
                  <div className="record-date">
                    {new Date(record.createdAt).toLocaleDateString()}
                  </div>
                  <div className={`record-status ${record.status}`}>
                    {record.status}
                  </div>
                </div>
                <div className="record-body">
                  {record.diagnosis && (
                    <div className="record-field">
                      <label>Diagnosis</label>
                      <p>{record.diagnosis}</p>
                    </div>
                  )}
                  {record.symptoms && (
                    <div className="record-field">
                      <label>Symptoms</label>
                      <p>{record.symptoms}</p>
                    </div>
                  )}
                  {record.treatment && (
                    <div className="record-field">
                      <label>Treatment</label>
                      <p>{record.treatment}</p>
                    </div>
                  )}
                  {record.prescription && (
                    <div className="record-field">
                      <label>Prescription</label>
                      <p>{record.prescription}</p>
                    </div>
                  )}
                  {record.notes && (
                    <div className="record-field">
                      <label>Notes</label>
                      <p>{record.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-records">
            <p>No medical records found for this patient.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewPatientRecords; 