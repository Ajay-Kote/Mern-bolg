import React from 'react';
import './Footer.scss';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>MERN Blog</h3>
            <p>A modern blog platform built with the MERN stack.</p>
          </div>
          
          <div className="footer-section">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/blogs">All Blogs</a></li>
              <li><a href="/create-blog">Write Blog</a></li>
              <li><a href="/my-blogs">My Blogs</a></li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h4>Connect</h4>
            <ul>
              <li><a href="https://github.com/Ajay-Kote" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="https://www.linkedin.com/in/ajay-kote-03717b290/" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              <li><a href="https://mail.google.com/mail/?view=cm&fs=1&to=akajaykote@gmail.com&su=Portfolio%20Contact&body=Hi%20Ajay,"target="_blank" rel="noopener noreferrer">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2024 MERN Blog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
