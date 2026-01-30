import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUtensils, FaTruck, FaUserPlus, FaSignInAlt, FaUserShield } from "react-icons/fa";
import '../style/navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm fixed-top">
      <div className="container">
        {/* Logo / Brand */}
        <Link className="navbar-brand fw-bold text-primary" to="/">
          <i className="fas fa-utensils me-2"></i> Food Ordering System
        </Link>

        {/* Toggle button for mobile */}
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#publicNavbar">
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navbar Links */}
        <div className="collapse navbar-collapse" id="publicNavbar">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                <FaHome className="me-1" /> Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/menu">
                <FaUtensils className="me-1" /> Menu
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/track">
                <FaTruck className="me-1" /> Track Order
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/register">
                <FaUserPlus className="me-1" /> Register
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/login">
                <FaSignInAlt className="me-1" /> Login
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/admin-login">
                <FaUserShield className="me-1" /> Admin
              </Link>
            </li>

            {/* CTA Button */}
            <li className="nav-item ms-lg-3">
              <Link className="btn btn-primary px-3 fw-semibold" to="/order">
                <i className="fas fa-shopping-cart me-2"></i> Order Now
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
    </nav>
  );
};

export default Navbar;
