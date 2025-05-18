import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaUserMd, FaHospital, FaAmbulance, FaPhoneAlt, FaWhatsapp, FaSearch, FaMapMarkerAlt, FaStar, FaClock, FaUserFriends } from 'react-icons/fa';
import { MdHealthAndSafety, MdLocalPharmacy, MdLocationOn, MdEmail } from 'react-icons/md';
import { BsArrowRight, BsCalendarCheck } from 'react-icons/bs';
import { HiOutlineUserGroup } from 'react-icons/hi';
import heroImage1 from '../assets/images/hero-img01.png';
import heroImage2 from '../assets/images/hero-img02.png';
import heroImage3 from '../assets/images/hero-img03.png';
import icon02 from '../assets/images/icon02.png';
import icon03 from '../assets/images/icon03.png';
import dieting from '../assets/images/dieting.png';
import './Home.css';

const Home = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [email, setEmail] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // Implement newsletter subscription
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
                SwasthSathi bridges modern medical support with natural well-being, making healthcare accessible to everyone across India. Connect with experienced doctors, advanced clinics, and a wide range of healthcare services—anytime, anywhere.
              </p>
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="search-form">
                <div className="flex gap-2">
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
                </div>
              </form>
              <div className="flex flex-col sm:flex-row gap-4">
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
                <img src={heroImage1} alt="Healthcare professional 1" />
              </div>
              <div className="hero-image-column">
                <div className="hero-image-small">
                  <img src={heroImage2} alt="Healthcare professional 2" />
                </div>
                <div className="hero-image-small">
                  <img src={heroImage3} alt="Healthcare professional 3" />
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
              <FaUserMd className="stat-icon" />
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
            <div className="service-card">
              <FaAmbulance className="service-icon" />
              <h3 className="service-title">Emergency Care</h3>
              <p className="service-description">
                24/7 emergency medical support and ambulance services.
              </p>
              <Link to="/services" className="service-link">
                Learn More <BsArrowRight />
              </Link>
            </div>
            <div className="service-card">
              <MdLocalPharmacy className="service-icon" />
              <h3 className="service-title">Pharmacy Services</h3>
              <p className="service-description">
                Easy access to medicines and healthcare products.
              </p>
              <Link to="/services" className="service-link">
                Learn More <BsArrowRight />
              </Link>
            </div>
            <div className="service-card">
              <FaPhoneAlt className="service-icon" />
              <h3 className="service-title">Telemedicine</h3>
              <p className="service-description">
                Virtual consultations with healthcare professionals.
              </p>
              <Link to="/services" className="service-link">
                Learn More <BsArrowRight />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="text-3xl font-bold text-center mb-12 text-headingColor">What Our Patients Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <span>R</span>
                </div>
                <div className="testimonial-info">
                  <h4 className="testimonial-name">Rahul Sharma</h4>
                  <p className="testimonial-location">Delhi</p>
                </div>
              </div>
              <p className="testimonial-text">"The telemedicine service saved me during the pandemic. Quick and professional service!"</p>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <span>P</span>
                </div>
                <div className="testimonial-info">
                  <h4 className="testimonial-name">Priya Patel</h4>
                  <p className="testimonial-location">Mumbai</p>
                </div>
              </div>
              <p className="testimonial-text">"Found the perfect doctor for my mother's treatment. The platform is very user-friendly."</p>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <span>A</span>
                </div>
                <div className="testimonial-info">
                  <h4 className="testimonial-name">Amit Kumar</h4>
                  <p className="testimonial-location">Bangalore</p>
                </div>
              </div>
              <p className="testimonial-text">"The emergency care service is excellent. They arrived within minutes when needed."</p>
            </div>
          </div>
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