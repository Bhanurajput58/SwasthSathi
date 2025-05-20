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
        <h2 className="text-3xl font-bold text-slate-800 mb-4">Doctor not found</h2>
        <button onClick={() => navigate('/doctors')} className="px-6 py-3 bg-sky-500 text-white rounded-xl font-semibold hover:bg-sky-600 transition-colors">Back to Doctors</button>
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/doctors')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 mb-8 transition-colors"
        >
          <FaArrowLeft />
          <span>Back to Doctors</span>
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center">
            <img 
              src={doctor.image} 
              alt={doctor.name} 
              className="w-40 h-40 rounded-full object-cover mb-6 border-4 border-sky-100 shadow-lg"
            />
            <h1 className="text-4xl font-bold text-slate-800 mb-2">{doctor.name}</h1>
            
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-sky-100 text-sky-600 px-6 py-2 rounded-full font-medium text-lg">
                {doctor.specialty}
              </span>
              <span className="flex items-center gap-2 text-amber-500">
                <FaStar className="text-xl" />
                <span className="text-slate-700 text-lg">{doctor.rating}</span>
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full mb-8">
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="flex items-center gap-3 text-slate-600 mb-3">
                  <FaMapMarkerAlt className="text-xl" />
                  <span className="font-medium text-lg">Location</span>
                </div>
                <p className="text-lg">{doctor.location}</p>
              </div>
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="flex items-center gap-3 text-slate-600 mb-3">
                  <FaAward className="text-xl" />
                  <span className="font-medium text-lg">Experience</span>
                </div>
                <p className="text-lg">{doctor.experience} years</p>
              </div>
            </div>

            <div className="w-full space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">About</h2>
                <p className="text-slate-600 leading-relaxed text-lg">{doctor.bio}</p>
              </div>

              <div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">Languages</h2>
                <div className="flex flex-wrap gap-3">
                  {doctor.languages.map(lang => (
                    <span key={lang} className="bg-slate-100 text-slate-700 px-6 py-3 rounded-full text-lg">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-slate-50 rounded-xl p-6">
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">Contact Information</h2>
                <div className="flex flex-wrap gap-6">
                  <a href={`tel:${doctor.contact.phone}`} className="flex items-center gap-3 text-sky-600 hover:text-sky-700 transition-colors">
                    <FaPhoneAlt className="text-xl" />
                    <span className="text-lg">{doctor.contact.phone}</span>
                  </a>
                  <a href={`mailto:${doctor.contact.email}`} className="flex items-center gap-3 text-sky-600 hover:text-sky-700 transition-colors">
                    <FaEnvelope className="text-xl" />
                    <span className="text-lg">{doctor.contact.email}</span>
                  </a>
                  <a href={doctor.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-sky-600 hover:text-sky-700 transition-colors">
                    <FaWhatsapp className="text-xl" />
                    <span className="text-lg">WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Booking Form */}
              <div className="bg-slate-50 rounded-xl p-8">
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Book Appointment</h2>
                {bookingSuccess ? (
                  <div className="bg-green-50 text-green-600 rounded-xl p-6 text-center font-semibold text-lg">
                    Appointment booked successfully!
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <input
                        type="text"
                        name="name"
                        placeholder="Your Name"
                        className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 text-lg"
                        value={booking.name}
                        onChange={handleBookingChange}
                        required
                      />
                      <input
                        type="email"
                        name="email"
                        placeholder="Your Email"
                        className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 text-lg"
                        value={booking.email}
                        onChange={handleBookingChange}
                        required
                      />
                    </div>
                    <input
                      type="date"
                      name="date"
                      className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 text-lg"
                      value={booking.date}
                      onChange={handleBookingChange}
                      required
                    />
                    <div>
                      <label className="block text-lg font-medium text-slate-700 mb-3">Select Time Slot:</label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {timeSlots.map(slot => (
                          <button
                            type="button"
                            key={slot}
                            className={`px-6 py-3 rounded-xl border transition-all duration-200 text-lg ${
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
                    <button
                      type="submit"
                      className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 text-lg disabled:opacity-50"
                      disabled={!booking.time}
                    >
                      Confirm Booking
                    </button>
                  </form>
                )}
              </div>

              {/* Reviews Section */}
              <div>
                <h2 className="text-2xl font-semibold text-slate-800 mb-6">Patient Reviews</h2>
                <div className="space-y-6 mb-8">
                  {[...(doctor.reviewsList || []), ...localReviews].map((review, idx) => (
                    <div key={idx} className="bg-white border border-slate-200 rounded-xl p-6">
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-slate-800 text-lg">{review.name}</span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <FaStar key={i} className={i < review.rating ? 'text-yellow-400' : 'text-slate-200'} />
                          ))}
                        </div>
                      </div>
                      <p className="text-slate-600 text-lg">{review.comment}</p>
                    </div>
                  ))}
                  {([...(doctor.reviewsList || []), ...localReviews].length === 0) && (
                    <div className="text-center py-12 text-slate-500 text-lg">
                      No reviews yet. Be the first to review!
                    </div>
                  )}
                </div>

                <form onSubmit={handleReviewSubmit} className="bg-slate-50 rounded-xl p-8 space-y-6">
                  <h3 className="text-2xl font-semibold text-slate-800">Write a Review</h3>
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 text-lg"
                    value={newReview.name}
                    onChange={handleReviewChange}
                    required
                  />
                  <select
                    name="rating"
                    className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 text-lg"
                    value={newReview.rating}
                    onChange={handleReviewChange}
                    required
                  >
                    {[5,4,3,2,1].map(r => (
                      <option key={r} value={r}>{r} Star{r > 1 && 's'}</option>
                    ))}
                  </select>
                  <textarea
                    name="comment"
                    placeholder="Your Review"
                    className="w-full px-6 py-4 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 text-lg"
                    value={newReview.comment}
                    onChange={handleReviewChange}
                    required
                    rows="4"
                  />
                  <button
                    type="submit"
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 text-lg"
                  >
                    Submit Review
                  </button>
                </form>
              </div>

              {/* Map Section */}
              {doctor.map && (
                <div>
                  <h2 className="text-2xl font-semibold text-slate-800 mb-6">Location</h2>
                  <div className="rounded-xl overflow-hidden border border-slate-200 shadow-lg">
                    <iframe
                      title="Doctor Location"
                      src={`https://www.google.com/maps?q=${encodeURIComponent(doctor.location)}&output=embed`}
                      width="100%"
                      height="400"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;