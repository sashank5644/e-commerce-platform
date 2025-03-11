import React from 'react';

const Footer = () => {
  return (
    <footer
      style={{
        background: 'linear-gradient(90deg, #1a2e44, #2a3e5a)',
        color: '#ffffff',
        padding: '3rem 0',
        marginTop: 'auto', // Push footer to the bottom
        flexShrink: 0, // Prevent footer from shrinking
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 2rem',
          textAlign: 'center',
        }}
      >
        <p
          style={{
            fontSize: '1rem',
            marginBottom: '1.5rem',
            opacity: 0.9,
            letterSpacing: '0.5px',
          }}
        >
          © 2025 E-Shop. All rights reserved.
        </p>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
          }}
        >
          <a
            href="#"
            style={{
              color: '#b0b9c6',
              fontSize: '1rem',
              fontWeight: 500,
              transition: 'color 0.3s ease, transform 0.2s ease',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#ff4d87';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#b0b9c6';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Privacy Policy
          </a>
          <a
            href="#"
            style={{
              color: '#b0b9c6',
              fontSize: '1rem',
              fontWeight: 500,
              transition: 'color 0.3s ease, transform 0.2s ease',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#ff4d87';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#b0b9c6';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Terms of Service
          </a>
          <a
            href="#"
            style={{
              color: '#b0b9c6',
              fontSize: '1rem',
              fontWeight: 500,
              transition: 'color 0.3s ease, transform 0.2s ease',
              textDecoration: 'none',
            }}
            onMouseEnter={(e) => {
              e.target.style.color = '#ff4d87';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.color = '#b0b9c6';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Contact Us
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;