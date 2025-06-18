import React, { useState, useEffect } from 'react';
import { FaTimes, FaCalendarAlt, FaClock, FaUserMd, FaCheck } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './BookingPopup.css';

const BookingPopup = ({ isOpen, onClose, doctor }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [booking, setBooking] = useState({
    date: '',
    time: '',
    reason: '',
    symptoms: '',
    previousHistory: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is logged in and is a patient
    if (!user) {
      onClose();
      navigate('/login');
      return;
    }

    if (user.role !== 'patient') {
      onClose();
      navigate('/');
      return;
    }
  }, [user, navigate, onClose]);

  // If no user or not a patient, don't render the popup
  if (!user || user.role !== 'patient') {
    return null;
  }

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  ];

  const handleBookingChange = (e) => {
    setBooking({ ...booking, [e.target.name]: e.target.value });
  };

  const handleTimeSelect = (slot) => {
    setBooking({ ...booking, time: slot });
  };

  const validateBookingData = () => {
    if (!booking.date) {
      throw new Error('Please select a date');
    }

    if (!booking.time) {
      throw new Error('Please select a time slot');
    }

    if (!booking.reason.trim()) {
      throw new Error('Please provide a reason for visit');
    }

    if (booking.reason.trim().length < 2) {
      throw new Error('Reason must be at least 2 characters long');
    }

    if (!booking.symptoms.trim()) {
      throw new Error('Please describe your symptoms');
    }

    if (booking.symptoms.trim().length < 3) {
      throw new Error('Symptoms description must be at least 3 characters long');
    }

    if (!booking.previousHistory.trim()) {
      throw new Error('Please provide your previous medical history');
    }

    if (booking.previousHistory.trim().length < 3) {
      throw new Error('Previous medical history must be at least 3 characters long');
    }

    // Validate date is not in the past
    const selectedDate = new Date(booking.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      throw new Error('Cannot book appointments for past dates');
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      setError('Please login to book an appointment');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // Validate all required fields
      if (!doctor?._id) {
        throw new Error('Doctor information is missing');
      }

      if (!user?._id) {
        throw new Error('Patient information is missing');
      }

      validateBookingData();

      const appointmentData = {
        doctor: doctor._id,
        patient: user._id,
        date: new Date(booking.date).toISOString(),
        time: booking.time,
        reason: booking.reason.trim(),
        symptoms: booking.symptoms.trim(),
        previousHistory: booking.previousHistory.trim()
      };

      const requiredFields = {
        doctor: 'Doctor ID',
        patient: 'Patient ID',
        date: 'Appointment date',
        time: 'Appointment time',
        reason: 'Reason for visit',
        symptoms: 'Symptoms',
        previousHistory: 'Previous medical history'
      };

      const missingFields = Object.entries(requiredFields)
        .filter(([key, label]) => {
          const value = appointmentData[key];
          return value === undefined || value === null || 
                 (typeof value === 'string' && value.trim() === '') ||
                 (typeof value === 'number' && isNaN(value));
        })
        .map(([_, label]) => label);

      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      // Validate ObjectId format
      const validateObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
      if (!validateObjectId(appointmentData.doctor)) {
        throw new Error('Invalid doctor ID format');
      }
      if (!validateObjectId(appointmentData.patient)) {
        throw new Error('Invalid patient ID format');
      }

      // Validate date
      const selectedDate = new Date(appointmentData.date);
      if (isNaN(selectedDate.getTime())) {
        throw new Error('Invalid date format');
      }

      // Validate time format
      const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9] (AM|PM)$/;
      if (!timeRegex.test(appointmentData.time)) {
        throw new Error('Invalid time format. Expected HH:MM AM/PM');
      }

      console.log('Sending appointment data:', appointmentData);

      // Check if slot is available
      const availabilityCheckData = {
        doctorId: doctor._id,
        date: booking.date,
        time: booking.time
      };
      
      console.log('Checking availability with data:', availabilityCheckData);

      const availabilityCheck = await fetch('http://localhost:5000/api/appointments/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(availabilityCheckData)
      });

      const availabilityData = await availabilityCheck.json();
      console.log('Availability check response:', availabilityData);
      
      if (!availabilityCheck.ok) {
        console.error('Availability check failed:', availabilityData);
        throw new Error(availabilityData.message || 'Failed to check availability');
      }

      if (!availabilityData.success) {
        throw new Error(availabilityData.message);
      }

      if (!availabilityData.available) {
        throw new Error('This time slot is already booked. Please select another time.');
      }

      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();
      console.log('Full backend response:', data);

      if (!response.ok) {
        console.error('Backend response:', data);
        
        if (data.details && Array.isArray(data.details)) {
          console.log('Validation details:', JSON.stringify(data.details, null, 2));
          const errorMessages = data.details.map(detail => {
            if (typeof detail === 'object') {
              return detail.message || detail.description || JSON.stringify(detail);
            }
            return detail;
          }).join(', ');
          throw new Error(`Validation failed: ${errorMessages}`);
        }
        
        if (data.message) {
          throw new Error(data.message);
        }
        
        throw new Error('Failed to book appointment');
      }

      console.log('Appointment created successfully:', data);

      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setBooking({
          date: '',
          time: '',
          reason: '',
          symptoms: '',
          previousHistory: ''
        });
      }, 2000);

    } catch (error) {
      console.error('Booking error:', error);
      setError(error.message || 'Failed to book appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setBooking({
        date: '',
        time: '',
        reason: '',
        symptoms: '',
        previousHistory: ''
      });
      setError('');
      setSuccess(false);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="booking-popup-overlay" onClick={handleClose}>
      <div className="booking-popup" onClick={(e) => e.stopPropagation()}>
        <div className="booking-popup-header">
          <div className="doctor-info">
            <div className="doctor-avatar">
              {doctor.photo ? (
                <img src={doctor.photo} alt={doctor.name} />
              ) : (
                <FaUserMd />
              )}
            </div>
            <div>
              <h2>{doctor.name}</h2>
              <p>{doctor.specialization}</p>
            </div>
          </div>
          <button className="close-button" onClick={handleClose} disabled={loading}>
            <FaTimes />
          </button>
        </div>

        {success ? (
          <div className="success-message">
            <FaCheck className="success-icon" />
            <h3>Appointment Booked Successfully!</h3>
            <p>You will receive a confirmation shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleBookingSubmit} className="booking-form">
            <div className="form-group">
              <label>
                <FaCalendarAlt />
                Select Date:
              </label>
              <input
                type="date"
                name="date"
                value={booking.date}
                onChange={handleBookingChange}
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaClock />
                Select Time Slot:
              </label>
              <div className="time-slots">
                {timeSlots.map(slot => (
                  <button
                    type="button"
                    key={slot}
                    className={`time-slot ${booking.time === slot ? 'selected' : ''}`}
                    onClick={() => handleTimeSelect(slot)}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label>Reason for Visit: <span className="required">*</span></label>
              <input
                type="text"
                name="reason"
                value={booking.reason}
                onChange={handleBookingChange}
                placeholder="e.g., Regular Checkup, Consultation"
                required
              />
            </div>

            <div className="form-group">
              <label>Symptoms: <span className="required">*</span></label>
              <textarea
                name="symptoms"
                value={booking.symptoms}
                onChange={handleBookingChange}
                placeholder="Please describe your symptoms in detail..."
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label>Previous Medical History: <span className="required">*</span></label>
              <textarea
                name="previousHistory"
                value={booking.previousHistory}
                onChange={handleBookingChange}
                placeholder="Any relevant medical history, allergies, or conditions..."
                rows="3"
                required
              />
            </div>

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="cancel-button"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="submit-button"
                disabled={loading}
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default BookingPopup; 