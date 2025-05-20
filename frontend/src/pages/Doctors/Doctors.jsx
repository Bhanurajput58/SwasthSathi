import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import doctorImg1 from '../../assets/images/doctor-img01.png';
import doctorImg2 from '../../assets/images/doctor-img02.png';
import doctorImg3 from '../../assets/images/doctor-img03.png';
import { FaStar, FaPhoneAlt, FaEnvelope, FaWhatsapp, FaUserMd, FaAward, FaMapMarkerAlt, FaSearch } from 'react-icons/fa';

const doctors = [
  {
    id: 1,
    name: 'Dr. Akash Ray',
    specialty: 'Cardiologist',
    location: 'Delhi',
    image: doctorImg1,
    experience: 12,
    rating: 4.8,
    reviews: 120,
    patients: 1500,
    awards: ['Best Cardiologist 2022'],
    bio: 'Expert in heart health and preventive cardiology. Passionate about patient care and education.',
    languages: ['English', 'Hindi'],
    contact: {
      phone: '+91-9876543210',
      email: 'priya.sharma@hospital.com',
      whatsapp: 'https://wa.me/919876543210',
    },
    badges: ['Top Rated', 'Most Experienced'],
    map: 'https://goo.gl/maps/xyz',
    reviewsList: [
      { name: 'Amit Kumar', rating: 5, comment: 'Excellent doctor, very caring and knowledgeable.' },
      { name: 'Sunita Rao', rating: 4, comment: 'Helped me recover quickly. Highly recommended!' },
    ],
  },
  {
    id: 2,
    name: 'Dr. Aman Singh',
    specialty: 'Dermatologist',
    location: 'Mumbai',
    image: doctorImg2,
    experience: 8,
    rating: 4.5,
    reviews: 90,
    patients: 1100,
    awards: ['Dermatology Excellence Award'],
    bio: 'Specialist in skin care, acne, and cosmetic dermatology. Focused on holistic skin health.',
    languages: ['English', 'Marathi', 'Hindi'],
    contact: {
      phone: '+91-9123456780',
      email: 'amit.verma@hospital.com',
      whatsapp: 'https://wa.me/919123456780',
    },
    badges: ['Top Rated'],
    map: 'https://goo.gl/maps/abc',
    reviewsList: [
      { name: 'Priya S.', rating: 5, comment: 'Very professional and friendly.' },
      { name: 'Rahul Jain', rating: 4, comment: 'Solved my skin issues effectively.' },
    ],
  },
  {
    id: 3,
    name: 'Dr. Amit Verma',
    specialty: 'Pediatrician',
    location: 'Bangalore',
    image: doctorImg3,
    experience: 10,
    rating: 4.7,
    reviews: 105,
    patients: 1300,
    awards: ['Pediatric Care Award'],
    bio: 'Dedicated to child health and wellness. Experienced in treating a wide range of pediatric conditions.',
    languages: ['English', 'Kannada', 'Hindi'],
    contact: {
      phone: '+91-9988776655',
      email: 'neha.singh@hospital.com',
      whatsapp: 'https://wa.me/919988776655',
    },
    badges: ['Most Experienced'],
    map: 'https://goo.gl/maps/def',
    reviewsList: [
      { name: 'Meena P.', rating: 5, comment: 'Great with kids and very patient.' },
      { name: 'Suresh R.', rating: 4, comment: 'Explained everything clearly.' },
    ],
  },
];

const specialties = [...new Set(doctors.map(doc => doc.specialty))];
const locations = [...new Set(doctors.map(doc => doc.location))];

const Doctors = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const doctorsPerPage = 6;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [search, specialty, location]);

  const filteredDoctors = doctors.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(search.toLowerCase()) ||
      doc.specialty.toLowerCase().includes(search.toLowerCase()) ||
      doc.location.toLowerCase().includes(search.toLowerCase());
    const matchesSpecialty = specialty ? doc.specialty === specialty : true;
    const matchesLocation = location ? doc.location === location : true;
    return matchesSearch && matchesSpecialty && matchesLocation;
  });

  const totalPages = Math.ceil(filteredDoctors.length / doctorsPerPage);
  const paginatedDoctors = filteredDoctors.slice(
    (currentPage - 1) * doctorsPerPage,
    currentPage * doctorsPerPage
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setLoading(true);
    setTimeout(() => setLoading(false), 500);
  };

  const handleDoctorClick = (doctorId) => {
    navigate(`/doctors/${doctorId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-slate-800 mb-4">Our Expert Doctors</h1>
        <p className="text-center text-slate-600 mb-12 max-w-2xl mx-auto">Find and book appointments with our highly qualified medical professionals. Each doctor is carefully selected for their expertise and dedication to patient care.</p>
        
        {/* Search and Filter UI */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-12">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, specialty, or location..."
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <select
              className="px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 bg-white"
              value={specialty}
              onChange={e => setSpecialty(e.target.value)}
            >
              <option value="">All Specialties</option>
              {specialties.map(spec => (
                <option key={spec} value={spec}>{spec}</option>
              ))}
            </select>
            <select
              className="px-4 py-3 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-2 focus:ring-sky-200 transition-all duration-200 bg-white"
              value={location}
              onChange={e => setLocation(e.target.value)}
            >
              <option value="">All Locations</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 animate-pulse">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 bg-slate-200 rounded w-3/4" />
                    <div className="h-3 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="mt-6 space-y-3">
                  <div className="h-3 bg-slate-200 rounded" />
                  <div className="h-3 bg-slate-200 rounded w-5/6" />
                  <div className="h-3 bg-slate-200 rounded w-4/6" />
                </div>
              </div>
            ))
          ) : paginatedDoctors.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">No doctors found</h3>
              <p className="text-slate-600">Try adjusting your search criteria</p>
            </div>
          ) : (
            paginatedDoctors.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                onClick={() => handleDoctorClick(doc.id)}
              >
                <div className="p-8">
                  <div className="flex items-center space-x-4 mb-6">
                    <img
                      src={doc.image}
                      alt={doc.name}
                      className="w-20 h-20 rounded-full object-cover border-4 border-sky-100"
                    />
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{doc.name}</h3>
                      <div className="flex items-center gap-2 text-sky-600">
                        <FaUserMd />
                        <span className="font-medium">{doc.specialty}</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-slate-600">
                      <FaMapMarkerAlt />
                      <span>{doc.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <FaStar key={i} className={i < Math.floor(doc.rating) ? 'text-yellow-400' : 'text-slate-200'} />
                        ))}
                      </div>
                      <span className="text-slate-600">({doc.reviews} reviews)</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {doc.badges.map(badge => (
                        <span key={badge} className="bg-sky-50 text-sky-600 text-xs font-semibold px-3 py-1 rounded-full">
                          {badge}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm text-slate-600 mb-6">
                    <div className="flex items-center gap-2">
                      <FaAward className="text-amber-500" />
                      <span>{doc.awards[0]}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span>{doc.experience} yrs exp</span>
                      <span>•</span>
                      <span>{doc.patients} patients</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <a href={`tel:${doc.contact.phone}`} className="text-sky-500 hover:text-sky-600 transition-colors" onClick={e => e.stopPropagation()}>
                        <FaPhoneAlt />
                      </a>
                      <a href={`mailto:${doc.contact.email}`} className="text-sky-500 hover:text-sky-600 transition-colors" onClick={e => e.stopPropagation()}>
                        <FaEnvelope />
                      </a>
                      <a href={doc.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="text-sky-500 hover:text-sky-600 transition-colors" onClick={e => e.stopPropagation()}>
                        <FaWhatsapp />
                      </a>
                    </div>
                    <button 
                      className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-6 py-2 rounded-xl transition-colors duration-200"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDoctorClick(doc.id);
                      }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination Controls */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center mt-12 gap-2">
            <button
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-sky-50 hover:border-sky-200 disabled:opacity-50 transition-all duration-200"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx + 1}
                className={`px-4 py-2 rounded-xl border transition-all duration-200 ${
                  currentPage === idx + 1 
                    ? 'bg-sky-500 text-white border-sky-500' 
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-sky-50 hover:border-sky-200'
                }`}
                onClick={() => handlePageChange(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}
            <button
              className="px-4 py-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-sky-50 hover:border-sky-200 disabled:opacity-50 transition-all duration-200"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Doctors;