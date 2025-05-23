import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.jpg';
import './header.css';

const Header = () => {

  return (
    <div className="header">      
      <nav className="navbar">
        <Link to="/" className="logo-container">
          <img src={logo} alt="SwasthSathi Logo" className="logo-img" />
          <span className="logo-text">SwasthSathi</span>
        </Link>
        
        <div className="nav-container">
          <div className="nav-links">
            <Link to="/" className="nav-link">Home</Link>
            <Link to="/services" className="nav-link">Services</Link>
            <Link to="/doctors" className="nav-link">Find a Doctor</Link>
            <Link to="/contact" className="nav-link">Contact</Link>
          </div>

          <Link to="/login" className="login-button">Login</Link>
        </div>
      </nav>
    </div>
  );
};

export default Header;
