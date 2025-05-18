import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../../assets/images/logo.jpg';
import maskBg from '../../assets/images/mask.png';

const Header = () => {
  const navLinkStyle = {
    color: '#2c3e50',
    textDecoration: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    padding: '0.3rem 0.5rem',
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  };

  const loginButtonStyle = {
    backgroundColor: '#2c3e50',
    color: 'white',
    padding: '0.5rem 1.2rem',
    borderRadius: '4px',
    border: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    display: 'inline-block',
  };

  return (
    <div className="header">      
      <nav
        className="navbar"
        style={{
          display: 'flex',
          alignItems: 'center',
          padding: '0.5rem 2rem',
          background: `url(${maskBg})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
          height: '60px',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
        }}
      >
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            zIndex: 2,
          }}
        >
          <img
            src={logo}
            alt="SwasthSathi Logo"
            style={{ height: '40px', marginRight: '1rem', borderRadius: '8px' }}
          />
          <span
            style={{
              fontSize: '2.2rem',
              fontWeight: 700,
              letterSpacing: '1px',
              fontFamily: 'Poppins, sans-serif',
              color: '#2c3e50',
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s ease-in-out',
            }}
          >
            SwasthSathi
          </span>
        </Link>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '2rem',
          zIndex: 2,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <Link
              to="/"
              style={navLinkStyle}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(44, 62, 80, 0.1)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Home
            </Link>
            <Link
              to="/services"
              style={navLinkStyle}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(44, 62, 80, 0.1)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Services
            </Link>
            <Link
              to="/doctors"
              style={navLinkStyle}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(44, 62, 80, 0.1)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Find a Doctor
            </Link>
            <Link
              to="/contact"
              style={navLinkStyle}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(44, 62, 80, 0.1)';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              Contact
            </Link>
          </div>

          <Link
            to="/login"
            style={loginButtonStyle}
            onMouseOver={(e) => {
              e.target.style.backgroundColor = '#1e2a37';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseOut={(e) => {
              e.target.style.backgroundColor = '#2c3e50';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Login
          </Link>
        </div>
      </nav>
    </div>
  );
};

export default Header;
