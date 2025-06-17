import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { FaStar, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaUserMd, FaAward, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import './BookAppointment.css';

const BookAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [booking, setBooking] = useState({
    date: '',
    time: '',
    reason: '',
    symptoms: '',
    previousHistory: ''
  });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [localReviews, setLocalReviews] = useState([]);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  ];

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
    const fetchData = async () => {
      if (!user?.token) {
        setLoading(false);
        return;
      }

      try {
        // Fetch doctor details
        console.log('Fetching doctor details for ID:', id);
        const doctorResponse = await fetch(`http://localhost:5000/api/doctors/${id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!doctorResponse.ok) {
          throw new Error('Failed to fetch doctor details');
        }
        const doctorData = await doctorResponse.json();
        console.log('Raw doctor data:', doctorData);
        
        // Ensure we have the correct doctor ID
        if (!doctorData._id) {
          throw new Error('Invalid doctor data: missing ID');
        }
        
        setDoctor(doctorData);
        console.log('Doctor state set with:', doctorData);

        // Fetch patient details
        console.log('Fetching patient details for ID:', user._id);
        const patientResponse = await fetch(`http://localhost:5000/api/patients/${user._id}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!patientResponse.ok) {
          throw new Error('Failed to fetch patient details');
        }
        const patientData = await patientResponse.json();
        console.log('Patient data:', patientData);

        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, user]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'patient') {
    return <Navigate to="/" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
      </div>
    );
  }

  if (error || !doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Error loading data</h2>
        <p className="text-red-500 mb-4">{error || 'Doctor not found'}</p>
        <button
          onClick={() => navigate('/doctors')}
          className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-sky-500 to-sky-600 text-white rounded-xl font-semibold hover:from-sky-600 hover:to-sky-700 transition-all duration-300 shadow-lg shadow-sky-200 hover:shadow-sky-300"
        >
          <FaArrowLeft className="transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Doctors</span>
        </button>
      </div>
    );
  }

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

    if (!booking.symptoms.trim()) {
      throw new Error('Please describe your symptoms');
    }

    if (!booking.previousHistory.trim()) {
      throw new Error('Please provide your previous medical history');
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
      navigate('/login');
      return;
    }

    try {
      // Validate all required fields
      if (!doctor?._id) {
        throw new Error('Doctor information is missing');
      }

      if (!user?._id) {
        throw new Error('Patient information is missing');
      }

      validateBookingData();

      const appointmentDate = new Date(booking.date);
      appointmentDate.setUTCHours(0, 0, 0, 0);

      // Create appointment data
      const appointmentData = {
        doctor: doctor._id,
        date: appointmentDate.toISOString(),
        time: booking.time,
        reason: booking.reason.trim(),
        symptoms: booking.symptoms.trim(),
        previousHistory: booking.previousHistory.trim()
      };

      // Check if slot is available
      const availabilityCheck = await fetch('http://localhost:5000/api/appointments/check-availability', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          doctorId: doctor._id,
          date: appointmentData.date,
          time: appointmentData.time
        })
      });

      const availabilityData = await availabilityCheck.json();
      if (!availabilityData.available) {
        throw new Error('This time slot is already booked. Please select another time.');
      }

      // Create appointment
      const response = await fetch('http://localhost:5000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify(appointmentData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to book appointment');
      }

      setBookingSuccess(true);
      setTimeout(() => {
        navigate('/patient/appointments');
      }, 2000);

    } catch (error) {
      console.error('Booking error:', error);
      alert(error.message || 'Failed to book appointment. Please try again.');
    }
  };

  const handleReviewChange = (e) => {
    setNewReview({ ...newReview, [e.target.name]: e.target.value });
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    setLocalReviews([...localReviews, newReview]);
    setNewReview({ name: '', rating: 5, comment: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 pt-4 pb-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/patient/all-doctors')}
          className="group flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md mb-4"
        >
          <FaArrowLeft className="transform group-hover:-translate-x-1 transition-transform" />
          <span>Back</span>
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* Doctor Profile Section */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/*Doctor Image and Basic Info */}
            <div className="md:w-1/3 flex flex-col items-center">
              {doctor.photo && isValidImageUrl(doctor.photo) ? (
                <img
                  src={doctor.photo}
                  alt={doctor.name}
                  className="w-36 h-36 rounded-full object-cover mb-4 border-3 border-sky-100 shadow-md"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = null;
                    e.target.parentElement.innerHTML = `
                      <div class="w-36 h-36 rounded-full bg-slate-100 flex items-center justify-center mb-4 border-3 border-sky-100 shadow-md">
                        <svg class="w-16 h-16 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      </div>
                    `;
                  }}
                />
              ) : (
                <div className="w-36 h-36 rounded-full bg-slate-100 flex items-center justify-center mb-4 border-3 border-sky-100 shadow-md">
                  <FaUserMd className="w-16 h-16 text-slate-400" />
                </div>
              )}
              <h1 className="text-2xl font-bold text-slate-800 mb-2">{doctor.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-sky-100 text-sky-600 px-4 py-1 rounded-full text-sm font-medium">
                  {doctor.specialization}
                </span>
                <span className="flex items-center gap-1 text-amber-500">
                  <FaStar className="text-sm" />
                  <span className="text-slate-700 text-sm">{doctor.avgRating || '4.8'}</span>
                </span>
              </div>
            </div>

            {/*Contact and Experience */}
            <div className="md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <FaMapMarkerAlt className="text-base" />
                  <span className="font-medium">Location & Experience</span>
                </div>
                <p className="text-slate-700">{doctor.hospital || 'Not specified'}</p>
                <p className="text-slate-700 mt-1">{doctor.experience || '0'} years of experience</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <FaUserMd className="text-base" />
                  <span className="font-medium">About</span>
                </div>
                <p className="text-slate-700 line-clamp-3">{doctor.bio || 'No bio available'}</p>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 md:col-span-2">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <FaPhoneAlt className="text-base" />
                  <span className="font-medium">Contact Information</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  {doctor.phone && (
                    <a href={`tel:${doctor.phone}`} className="flex items-center gap-2 text-sky-600 hover:text-sky-700">
                      <FaPhoneAlt className="text-sm" />
                      <span>{doctor.phone}</span>
                    </a>
                  )}
                  {doctor.email && (
                    <a href={`mailto:${doctor.email}`} className="flex items-center gap-2 text-sky-600 hover:text-sky-700">
                      <FaEnvelope className="text-sm" />
                      <span>{doctor.email}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        

        {/* Book Appointment Section*/}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="bg-sky-100 text-sky-600 p-2 rounded-full">
              <FaUserMd className="text-lg" />
            </span>
            Book Appointment
          </h2>
          {bookingSuccess ? (
            <div className="bg-green-50 text-green-600 rounded-lg p-4 text-center font-semibold">
              Appointment booked successfully! Redirecting to appointments...
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Date:</label>
                <input
                  type="date"
                  name="date"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                  value={booking.date}
                  onChange={handleBookingChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Time Slot:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timeSlots.map(slot => (
                    <button
                      type="button"
                      key={slot}
                      className={`px-3 py-2 rounded-lg border transition-all duration-200 ${
                        booking.time === slot
                          ? 'bg-sky-500 text-white border-sky-500'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-50 hover:border-sky-200'
                      }`}
                      onClick={() => handleTimeSelect(slot)}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Reason for Visit: <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  name="reason"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                  value={booking.reason}
                  onChange={handleBookingChange}
                  placeholder="e.g., Regular Checkup, Consultation"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Symptoms: <span className="text-red-500">*</span></label>
                <textarea
                  name="symptoms"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                  value={booking.symptoms}
                  onChange={handleBookingChange}
                  rows="3"
                  placeholder="Please describe your symptoms..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Previous Medical History: <span className="text-red-500">*</span></label>
                <textarea
                  name="previousHistory"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                  value={booking.previousHistory}
                  onChange={handleBookingChange}
                  rows="3"
                  placeholder="Any relevant medical history..."
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-sky-500 to-sky-600 text-white py-3 rounded-lg font-semibold hover:from-sky-600 hover:to-sky-700 transition-all duration-300 shadow-lg shadow-sky-200 hover:shadow-sky-300"
              >
                Book Appointment
              </button>
            </form>
          )}
        </div>

        {/* Patient Reviews Section*/}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="bg-amber-100 text-amber-600 p-2 rounded-full">
              <FaStar className="text-lg" />
            </span>
            Patient Reviews
          </h2>
          <div className="space-y-4 mb-6">
            {[...(doctor.reviewsList || []), ...localReviews].map((review, idx) => (
              <div key={idx} className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-slate-800">{review.name}</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <FaStar key={i} className={`text-sm ${i < review.rating ? 'text-yellow-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-slate-600">{review.comment}</p>
              </div>
            ))}
            {([...(doctor.reviewsList || []), ...localReviews].length === 0) && (
              <div className="text-center py-4 text-slate-500">
                No reviews yet. Be the first to review!
              </div>
            )}
          </div>

          <form onSubmit={handleReviewSubmit} className="bg-slate-50 rounded-lg p-6 space-y-4 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <span className="bg-amber-100 text-amber-600 p-1.5 rounded-full">
                <FaStar className="text-sm" />
              </span>
              Write a Review
            </h3>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
              value={newReview.name}
              onChange={handleReviewChange}
              required
            />
            <select
              name="rating"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
              value={newReview.rating}
              onChange={handleReviewChange}
              required
            >
              {[5, 4, 3, 2, 1].map(r => (
                <option key={r} value={r}>{r} Star{r > 1 && 's'}</option>
              ))}
            </select>
            <textarea
              name="comment"
              placeholder="Your Review"
              className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
              value={newReview.comment}
              onChange={handleReviewChange}
              required
              rows="3"
            />
            <button
              type="submit"
              className="w-300px bg-amber-500 hover:bg-amber-600 text-Black font-semibold px-4 py-1 rounded-lg transition-colors duration-200 border-2px border-black"
            >
              Submit Review
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookAppointment;