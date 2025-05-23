import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaHospital, FaAmbulance, FaPhoneAlt, FaWhatsapp, FaSearch, FaMapMarkerAlt, FaStar, FaClock, FaUserFriends, FaArrowRight } from 'react-icons/fa';
import { MdHealthAndSafety, MdLocalPharmacy, MdLocationOn, MdEmail } from 'react-icons/md';
import { BsArrowRight, BsCalendarCheck } from 'react-icons/bs';
import { HiOutlineUserGroup } from 'react-icons/hi';
import heroImage1 from '../assets/images/hero-img01.png';
import heroImage2 from '../assets/images/hero-img02.png';
import heroImage3 from '../assets/images/hero-img03.png';
import icon02 from '../assets/images/icon02.png';
import icon03 from '../assets/images/icon03.png';
import dieting from '../assets/images/dieting.png';
import doctorImg01 from '../assets/images/doctor-img01.png';
import doctorImg02 from '../assets/images/doctor-img02.png';
import doctorImg03 from '../assets/images/doctor-img03.png';
import ServiceCard from '../components/Services/ServiceCard';
import './Home.css';
import DoctorCard from '../components/Doctors/DoctorCard';
import Testimonial from '../components/Testimonial/Testimonial';
import FaqList from '../components/Faq/FaqList';
import faqImg from '../assets/images/faq-img.png';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');

  const services = [
    {
      name: 'Emergency Care',
      desc: '24/7 emergency medical support and ambulance services with rapid response.',
      Icon: FaAmbulance,
      bgColor: '#FCE7F3',
      textColor: '#EC4899',
    },
    {
      name: 'Pharmacy Services',
      desc: 'Easy access to medicines and healthcare products with doorstep delivery.',
      Icon: MdLocalPharmacy,
      bgColor: '#FEF3C7',
      textColor: '#F59E0B',
    },
    {
      name: 'Telemedicine',
      desc: 'Virtual consultations with healthcare professionals from anywhere.',
      Icon: FaPhoneAlt,
      bgColor: '#D1FAE5',
      textColor: '#10B981',
    },
    {
      name: 'Specialist Consultation',
      desc: 'Expert consultations across various medical specialties.',
      Icon: FaUserMd,
      bgColor: '#DBEAFE',
      textColor: '#3B82F6',
    },
    {
      name: 'Health Checkups',
      desc: 'Comprehensive health checkup packages tailored to your needs.',
      Icon: BsCalendarCheck,
      bgColor: '#EDE9FE',
      textColor: '#8B5CF6',
    },
    {
      name: 'Hospital Services',
      desc: 'Access to a network of top-rated hospitals and healthcare facilities.',
      Icon: FaHospital,
      bgColor: '#CFFAFE',
      textColor: '#06B6D4',
    },
  ];

  const doctors = [
    {
      id: '1',
      name: 'Dr. Akash Ray',
      specialization: 'Surgeon',
      avgRating: 4.8,
      totalRating: 272,
      photo: doctorImg01,
      totalPatients: 1500,
      hospital: 'Mount Adora Hospital'
    },
    {
      id: '2',
      name: 'Dr. Aman Singh',
      specialization: 'Neurologist',
      avgRating: 4.8,
      totalRating: 272,
      photo: doctorImg02,
      totalPatients: 1500,
      hospital: 'Patuakhali Medical College'
    },
    {
      id: '3',
      name: 'Dr. Amit Verma',
      specialization: 'Dermatologist',
      avgRating: 4.8,
      totalRating: 272,
      photo: doctorImg03,
      totalPatients: 1500,
      hospital: 'Cumilla Medical College'
    }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    //search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    //newsletter subscription
    console.log('Subscribing email:', email);
    setEmail('');
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section with Search */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1 className="hero-title">
                Your Journey to Better Health Starts Here
              </h1>
              <p className="hero-description">
                SwasthSathi bridges modern medical support with natural well-being, making healthcare accessible to everyone across India.
              </p>
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="search-form">
                <input
                  type="text"
                  placeholder="Search for doctors, specialties..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button
                  type="submit"
                  className="search-button"
                >
                  <FaSearch className="text-xl" />
                </button>
              </form>
              <div className="hero-actions">
                <Link
                  to="/doctors"
                  className="cta-button-primary"
                >
                  Find a Doctor
                </Link>
                <Link
                  to="/services"
                  className="cta-button-secondary"
                >
                  Explore Services
                </Link>
              </div>
            </div>
            <div className="hero-images-split">
              <div className="hero-image-large">
                <img src={heroImage1} alt="Healthcare professional" />
              </div>
              <div className="hero-image-column">
                <div className="hero-image-small">
                  <img src={heroImage2} alt="Healthcare professional" />
                </div>
                <div className="hero-image-small">
                  <img src={heroImage3} alt="Healthcare professional" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions Section */}
      <section className="quick-actions-section">
        <div className="container quick-actions-grid">
          <div className="quick-action-card">
            <img src={icon02} alt="Find a Location" className="quick-action-img" />
            <h3 className="quick-action-title">Find a Location</h3>
            <p className="quick-action-desc">
              World-class care for everyone. Unmatched, expert health care.
            </p>
            <Link to="/doctors" className="quick-action-btn">
              <BsArrowRight />
            </Link>
          </div>
          <div className="quick-action-card">
            <img src={icon03} alt="Book Appointment" className="quick-action-img" />
            <h3 className="quick-action-title">Book Appointment</h3>
            <p className="quick-action-desc">
              Book appointments easily with our trusted health system.
            </p>
            <Link to="/doctors" className="quick-action-btn">
              <BsArrowRight />
            </Link>
          </div>
          <div className="quick-action-card">
            <img src={dieting} alt="Get Health Tips" className="quick-action-img" />
            <h3 className="quick-action-title">Get Health Tips</h3>
            <p className="quick-action-desc">
              Stay updated with the latest health tips and advice.
            </p>
            <Link to="/doctors" className="quick-action-btn">
              <BsArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <FaClock className="stat-icon" />
              <h3 className="stat-number">15+</h3>
              <p className="stat-label">Years of Experience</p>
            </div>
            <div className="stat-item">
              <FaMapMarkerAlt className="stat-icon" />
              <h3 className="stat-number">50+</h3>
              <p className="stat-label">Healthcare Centers</p>
            </div>
            <div className="stat-item">
              <FaStar className="stat-icon" />
              <h3 className="stat-number">98%</h3>
              <p className="stat-label">Patient Satisfaction</p>
            </div>
            <div className="stat-item">
              <FaUserFriends className="stat-icon" />
              <h3 className="stat-number">50K+</h3>
              <p className="stat-label">Happy Patients</p>
            </div>
            <div className="stat-item">
              <FaUserMd className="stat-icon" />newsletter-form
              <h3 className="stat-number">100+</h3>
              <p className="stat-label">Expert Doctors</p>
            </div>
            <div className="stat-item">
              <FaAmbulance className="stat-icon" />
              <h3 className="stat-number">24/7</h3>
              <p className="stat-label">Emergency Support</p>
            </div>
            <div className="stat-item">
              <BsCalendarCheck className="stat-icon" />
              <h3 className="stat-number">1K+</h3>
              <p className="stat-label">Appointments</p>
            </div>
            <div className="stat-item">
              <MdHealthAndSafety className="stat-icon" />
              <h3 className="stat-number">30+</h3>
              <p className="stat-label">Specialties</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-headingColor">Why Choose SwasthSathi?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <FaUserMd className="feature-icon" />
              <h3 className="feature-title">Expert Doctors</h3>
              <p className="feature-description">
                Access to qualified healthcare professionals across various specialties.
              </p>
            </div>
            <div className="feature-card">
              <MdHealthAndSafety className="feature-icon" />
              <h3 className="feature-title">Holistic Care</h3>
              <p className="feature-description">
                Comprehensive healthcare solutions combining modern and traditional approaches.
              </p>
            </div>
            <div className="feature-card">
              <FaHospital className="feature-icon" />
              <h3 className="feature-title">Quality Service</h3>
              <p className="feature-description">
                Partner with top-rated hospitals and healthcare facilities across India.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="services-section">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-headingColor">Our Services</h2>
          <div className="services-grid">
            {services.map((service, index) => (
              <ServiceCard key={index} item={service} index={index} />
            ))}
          </div>
        </div>
      </section>
      {/* Our Great Doctors Section */}
      <section className="py-20 bg-gradient-to-b from-white to-[#f8fafc]">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-[#1e293b] to-[#0ea5e9] bg-clip-text text-transparent mb-4">
              Meet Our Expert Doctors
            </h2>
            <p className="text-lg text-[#64748b]">
              World-class care from India's finest healthcare professionals. Our team of expert doctors
              brings years of experience and dedication to your well-being.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {doctors.map(doctor => (
              <DoctorCard key={doctor.id} doctor={doctor} />
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/doctors"
              className="inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-[#0ea5e9] to-[#38bdf8] text-white font-semibold rounded-full shadow-lg shadow-sky-200 transition-all duration-300 hover:from-[#38bdf8] hover:to-[#0ea5e9] group"
            >
              View All Doctors
              <FaArrowRight className="ml-2 text-sm transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="testimonial-section py-20 bg-gradient-to-b from-[#f0f7ff] to-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center mb-12">
            <h2 className="text-4xl font-bold text-[#2c3e50] mb-4">
              What Our Patients Say
            </h2>
            <p className="text-lg text-gray-600">
              Real experiences from our valued patients who have trusted SwasthSathi for their healthcare needs.
            </p>
          </div>
          <Testimonial />
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="container">
          <div className="newsletter-content">
            <h2 className="newsletter-title">Stay Updated with Health Tips</h2>
            <p className="newsletter-description">
              Subscribe to our newsletter for the latest health tips and updates.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email"
                className="newsletter-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="newsletter-button"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <h2 className="cta-title">Ready to Start Your Health Journey?</h2>
          <p className="cta-description">
            Join thousands of people who trust SwasthSathi for their healthcare needs.
          </p>
          <div className="cta-buttons">
            <Link
              to="/signup"
              className="cta-button-primary"
            >
              Sign Up Now
            </Link>
            <Link
              to="/contact"
              className="cta-button-secondary"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>

      {/* ======== FAQ Section ======== */}
      <section className="faq__section">
        <div className="container">
          <FaqList />
        </div>
      </section>

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/7634969538"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-button"
      >
        <FaWhatsapp className="text-2xl" />
      </a>

    </div>
  );
};

export default Home;