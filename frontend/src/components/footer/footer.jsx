import React from "react";
import { Link } from "react-router-dom";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";
import { MdLocationOn, MdEmail, MdPhone } from "react-icons/md";
import logo from '../../assets/images/logo.jpg';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* Company Info */}
          <div className="footer-company">
            <Link to="/" className="footer-logo">
              <img src={logo} alt="SwasthSathi Logo" />
              <span className="footer-logo-text">SwasthSathi</span>
            </Link>
            <p className="footer-description">
              Bridging modern medical support with natural well-being, making healthcare accessible to everyone across India.
            </p>
            <div className="footer-social">
              <a href="https://facebook.com" className="social-link" target="_blank" rel="noopener noreferrer">
                <FaFacebookF />
              </a>
              <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="https://linkedin.com" className="social-link" target="_blank" rel="noopener noreferrer">
                <FaLinkedinIn />
              </a>
              <a href="https://instagram.com" className="social-link" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-group">
            <h4>Quick Links</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link">Home</Link>
              <Link to="/services" className="footer-link">Services</Link>
              <Link to="/doctors" className="footer-link">Find a Doctor</Link>
              <Link to="/contact" className="footer-link">Contact Us</Link>
            </div>
          </div>

          {/* Services */}
          <div className="footer-group">
            <h4>Our Services</h4>
            <div className="footer-links">
              <Link to="/services" className="footer-link">Emergency Care</Link>
              <Link to="/services" className="footer-link">Online Consultation</Link>
              <Link to="/services" className="footer-link">Medicine Delivery</Link>
              <Link to="/services" className="footer-link">Health Checkups</Link>
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer-group">
            <h4>Contact Info</h4>
            <div className="footer-links">
              <div className="footer-contact-item">
                <span className="footer-contact-icon">
                  <MdLocationOn />
                </span>
                <span>123 Health Avenue, Mumbai, India</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">
                  <MdEmail />
                </span>
                <span>support@swasthsathi.com</span>
              </div>
              <div className="footer-contact-item">
                <span className="footer-contact-icon">
                  <MdPhone />
                </span>
                <span>+91 123-456-7890</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {year} SwasthSathi. All rights reserved.</p>
          <div className="footer-links-bottom">
            <Link to="/privacy-policy" className="footer-link-bottom">Privacy Policy</Link>
            <Link to="/terms" className="footer-link-bottom">Terms of Service</Link>
            <Link to="/cookies" className="footer-link-bottom">Cookie Settings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
