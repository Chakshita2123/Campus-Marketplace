import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="social-links">
        <a href="https://www.facebook.com/chitkarauniversity" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-facebook-f"></i>
        </a>
        <a href="https://www.instagram.com/chitkarauniversity" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-instagram"></i>
        </a>
        <a href="https://twitter.com/chitkaraedu" target="_blank" rel="noopener noreferrer">
          <i className="fab fa-twitter"></i>
        </a>
      </div>
      <div className="footer-links">
        <Link to="/">Home</Link>
        <Link to="/sell">Sell</Link>
        <Link to="/listings">Categories</Link>
      </div>
      <p>© 2025 Campus Marketplace. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
