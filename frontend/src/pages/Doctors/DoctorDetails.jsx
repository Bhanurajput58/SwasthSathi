import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaStar, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaUserMd, FaAward, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa';
import doctors from '../../data/doctors';

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const doctor = doctors.find(doc => doc.id === Number(id));
  const [booking, setBooking] = useState({ name: '', email: '', date: '', time: '' });
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [newReview, setNewReview] = useState({ name: '', rating: 5, comment: '' });
  const [localReviews, setLocalReviews] = useState([]);

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM',
  ];

  if (!doctor) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-slate-100">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Doctor not found</h2>
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

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    setBookingSuccess(true);
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
          onClick={() => navigate('/doctors')}
          className="group flex items-center gap-2 px-4 py-2 bg-white text-slate-700 rounded-lg font-semibold hover:bg-slate-50 transition-all duration-300 shadow-sm hover:shadow-md mb-4"
        >
          <FaArrowLeft className="transform group-hover:-translate-x-1 transition-transform" />
          <span>Back to Doctors</span>
        </button>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          {/* Doctor Profile Section */}
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/*Doctor Image and Basic Info */}
            <div className="md:w-1/3 flex flex-col items-center">
              <img
                src={doctor.image}
                alt={doctor.name}
                className="w-36 h-36 rounded-full object-cover mb-4 border-3 border-sky-100 shadow-md"
              />
              <h1 className="text-2xl font-bold text-slate-800 mb-2">{doctor.name}</h1>
              <div className="flex items-center gap-2 mb-4">
                <span className="bg-sky-100 text-sky-600 px-4 py-1 rounded-full text-sm font-medium">
                  {doctor.specialty}
                </span>
                <span className="flex items-center gap-1 text-amber-500">
                  <FaStar className="text-sm" />
                  <span className="text-slate-700 text-sm">{doctor.rating}</span>
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
                <p className="text-slate-700">{doctor.location}</p>
                <p className="text-slate-700 mt-1">{doctor.experience} years of experience</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <FaUserMd className="text-base" />
                  <span className="font-medium">About</span>
                </div>
                <p className="text-slate-700 line-clamp-3">{doctor.bio}</p>
                <div className="mt-2">
                  <span className="text-sm font-medium text-slate-600">Languages:</span>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {doctor.languages.map(lang => (
                      <span key={lang} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs">
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 md:col-span-2">
                <div className="flex items-center gap-2 text-slate-600 mb-2">
                  <FaPhoneAlt className="text-base" />
                  <span className="font-medium">Contact Information</span>
                </div>
                <div className="flex flex-wrap gap-4">
                  <a href={`tel:${doctor.contact.phone}`} className="flex items-center gap-2 text-sky-600 hover:text-sky-700">
                    <FaPhoneAlt className="text-sm" />
                    <span>{doctor.contact.phone}</span>
                  </a>
                  <a href={`mailto:${doctor.contact.email}`} className="flex items-center gap-2 text-sky-600 hover:text-sky-700">
                    <FaEnvelope className="text-sm" />
                    <span>{doctor.contact.email}</span>
                  </a>
                  <a href={doctor.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sky-600 hover:text-sky-700">
                    <FaWhatsapp className="text-sm" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
              <div className="bg-slate-50 rounded-lg p-4">
                <div className="mt-2">
                <span className="text-sm font-medium text-slate-600">Languages:</span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {doctor.languages.map(lang => (
                    <span key={lang} className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full text-xs">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
              </div>
            </div>
          </div>
        </div>

        {/* Book Appointment Section*/}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-slate-800 mb-4 flex items-center gap-2">
            <span className="bg-sky-100 text-sky-600 p-2 rounded-full">
              <FaUserMd className="text-lg" />
            </span>
            Book Appointment
          </h2>
          {bookingSuccess ? (
            <div className="bg-green-50 text-green-600 rounded-lg p-4 text-center font-semibold">
              Appointment booked successfully!
            </div>
          ) : (
            <form onSubmit={handleBookingSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                  value={booking.name}
                  onChange={handleBookingChange}
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                  value={booking.email}
                  onChange={handleBookingChange}
                  required
                />
              </div>
              <input
                type="date"
                name="date"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-200"
                value={booking.date}
                onChange={handleBookingChange}
                required
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Select Time Slot:</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {timeSlots.map(slot => (
                    <button
                      type="button"
                      key={slot}
                      className={`px-3 py-2 rounded-lg border transition-all duration-200 ${booking.time === slot
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
              <button
                type="submit"
                className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                disabled={!booking.time}
              >
                Confirm Booking
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

export default DoctorDetails;