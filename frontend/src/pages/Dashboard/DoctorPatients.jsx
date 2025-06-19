import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const DoctorPatients = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        setLoading(true);
        setError(null);

        const userStr = localStorage.getItem('user');
        if (!userStr) {
          throw new Error('No user data found');
        }

        const userData = JSON.parse(userStr);
        const token = userData.token;
        
        if (!token) {
          throw new Error('No authentication token found');
        }

        console.log('Attempting to fetch patients for doctor ID:', user?._id);

        const response = await fetch(`http://localhost:5000/api/patients/doctor/${user?._id}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          
          if (response.status === 401) {
            throw new Error('Session expired. Please log in again.');
          } else if (response.status === 404) {
            throw new Error('No patients found for this doctor.');
          } else {
            throw new Error(`Failed to fetch patients: ${errorText}`);
          }
        }

        const data = await response.json();
        console.log('Received patients data:', data);

        if (!Array.isArray(data)) {
          console.log('Received non-array data:', data);
          setPatients([]);
        } else {
          setPatients(data);
          console.log(`Successfully loaded ${data.length} patients`);
        }

      } catch (err) {
        console.error('Error in fetchPatients:', err.message);
        setError(err.message);
        
        if (err.message.includes('log in again')) {
          setTimeout(() => navigate('/login'), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    if (user?._id) {
      console.log('Starting to fetch patients for doctor:', user._id);
      fetchPatients();
    } else {
      console.log('No user ID available');
      setLoading(false);
      setError('Please log in to view patients');
    }
  }, [user, navigate]);

  // Component render
  if (!user) {
    return (
      <div className="doctor-patients-page" style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Loading user information...</h2>
        <p>Please wait while we fetch your data...</p>
      </div>
    );
  }

  return (
    <div className="doctor-patients-page" style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1>My Patients ({patients.length})</h1>
        <button 
          onClick={() => navigate('/doctor')}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            background: '#4F46E5',
            color: 'white',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Back to Dashboard
        </button>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <h2>Loading patients...</h2>
          <p>Please wait while we fetch your patients data...</p>
        </div>
      )}

      {error && (
        <div style={{ 
          padding: '1rem', 
          background: '#FEE2E2', 
          border: '1px solid #EF4444', 
          borderRadius: '0.5rem',
          color: '#B91C1C',
          marginBottom: '1rem' 
        }}>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="patients-grid" style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '1.5rem', 
          marginTop: '2rem' 
        }}>
          {patients.length > 0 ? patients.map(patient => (
            <div key={patient._id} className="patient-card" style={{ 
              background: '#f0fdf4', 
              borderRadius: '1rem', 
              padding: '1.5rem', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              transition: 'transform 0.2s ease-in-out',
              cursor: 'pointer'
            }}>
              <h2 style={{ marginBottom: '0.5rem', color: '#1F2937' }}>{patient.name}</h2>
              <p style={{ marginBottom: '0.5rem', color: '#4B5563' }}><strong>Email:</strong> {patient.email || 'No email'}</p>
              <p style={{ marginBottom: '0.5rem', color: '#4B5563' }}><strong>Phone:</strong> {patient.phone || 'No phone'}</p>
              <p style={{ marginBottom: '1rem', color: '#4B5563' }}><strong>Last Visit:</strong> {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'No visits yet'}</p>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/doctor/patient/${patient._id}`);
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    background: 'linear-gradient(to right, #667eea, #764ba2)',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  View Records
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/add-medical-record/${patient._id}`);
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '0.5rem',
                    background: '#10B981',
                    color: 'white',
                    border: 'none',
                    cursor: 'pointer',
                    flex: 1
                  }}
                >
                  Add Record
                </button>
              </div>
            </div>
          )) : (
            <div style={{ 
              gridColumn: '1 / -1', 
              textAlign: 'center', 
              padding: '2rem',
              background: '#F3F4F6',
              borderRadius: '0.5rem'
            }}>
              <h3 style={{ color: '#4B5563', marginBottom: '1rem' }}>No patients found</h3>
              <p style={{ color: '#6B7280' }}>Patients will appear here once they book appointments with you.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DoctorPatients; 