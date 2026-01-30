import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope } from "react-icons/fa";
import '../style/footer.css';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-4 pb-2 mt-5">
      <div className="container">
        <div className="row">
          {/* About Section */}
          <div className="col-md-4 mb-3">
            <h5 className="fw-bold">Food Ordering System</h5>
            <p className="small text-muted">
              Order your favorite meals online with ease. Fresh, fast, and reliable service at your fingertips.
            </p>
          </div>

          {/* Quick Links */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">Quick Links</h6>
            <ul className="list-unstyled">
              <li><Link to="/" className="footer-link">Home</Link></li>
              <li><Link to="/menu" className="footer-link">Menu</Link></li>
              <li><Link to="/track" className="footer-link">Track Order</Link></li>
              <li><Link to="/contact" className="footer-link">Contact</Link></li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="col-md-4 mb-3">
            <h6 className="fw-bold">Connect With Us</h6>
            <div className="d-flex gap-3">
              <a href="#" className="footer-social"><FaFacebook /></a>
              <a href="#" className="footer-social"><FaTwitter /></a>
              <a href="#" className="footer-social"><FaInstagram /></a>
              <a href="mailto:support@foodsystem.com" className="footer-social"><FaEnvelope /></a>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="text-center mt-3 border-top pt-2 small text-muted">
          © {new Date().getFullYear()} Food Ordering System. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
