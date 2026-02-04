import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome, FaUtensils, FaTruck, FaUserPlus, FaSignInAlt, 
  FaShoppingCart, FaUser, FaHeart, FaBars, FaTimes
} from "react-icons/fa";
import '../style/navbar.css';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const name = localStorage.getItem("userName");
    if (userId) {
      setIsLoggedIn(true);
      setUserName(name || "User");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.user-dropdown')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path ? 'active' : '';

  const navLinks = [
    { path: '/', icon: FaHome, label: 'Home' },
    { path: '/menu', icon: FaUtensils, label: 'Menu' },
    { path: '/track', icon: FaTruck, label: 'Track Order' }
  ];

  return (
    <>
      <nav className={`modern-navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="container">
          <div className="navbar-wrapper">
            <Link className="navbar-logo" to="/">
              <div className="logo-icon"><FaUtensils /></div>
              <span className="logo-text">Food<span className="logo-highlight">Order</span></span>
            </Link>

            <ul className="navbar-menu desktop-menu">
              {navLinks.map(({ path, icon: Icon, label }) => (
                <li key={path} className={`menu-item ${isActive(path)}`}>
                  <Link to={path} className="menu-link">
                    <Icon className="menu-icon" />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="navbar-actions">
              {!isLoggedIn ? (
                <>
                  <Link to="/register" className="btn-nav btn-register">
                    <FaUserPlus />
                    <span>Register</span>
                  </Link>
                  <Link to="/login" className="btn-nav btn-login">
                    <FaSignInAlt />
                    <span>Login</span>
                  </Link>
                  <Link to="/admin-login" className="btn-nav btn-admin">
                    <FaUser />
                    <span>Admin</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/cart" className="icon-btn">
                    <FaShoppingCart />
                  </Link>
                  <Link to="/wishlist" className="icon-btn">
                    <FaHeart />
                  </Link>
                  
                  <div className="user-dropdown">
                    <button 
                      className="user-btn" 
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                    >
                      <div className="user-avatar">{userName?.charAt(0)?.toUpperCase()}</div>
                      <span className="user-name">{userName}</span>
                    </button>
                    <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                      <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <FaUser />
                        <span>Profile</span>
                      </Link>
                      <Link to="/orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                        <FaShoppingCart />
                        <span>Orders</span>
                      </Link>
                      <div className="dropdown-divider"></div>
                      <button onClick={handleLogout} className="dropdown-item logout-btn">
                        <FaSignInAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              <Link to="/order" className="btn-primary-cta">
                <FaShoppingCart />
                <span>Order Now</span>
              </Link>

              <button className="mobile-menu-toggle" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}></div>
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <h3>Menu</h3>
            <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
              <FaTimes />
            </button>
          </div>
          
          <ul className="mobile-nav-list">
            {navLinks.map(({ path, icon: Icon, label }) => (
              <li key={path} className={isActive(path)}>
                <Link to={path} className="mobile-nav-link">
                  <Icon className="mobile-icon" />
                  <span>{label}</span>
                </Link>
              </li>
            ))}

            {!isLoggedIn ? (
              <>
                <li className="mobile-divider"></li>
                <li><Link to="/register" className="mobile-nav-link"><FaUserPlus className="mobile-icon" /><span>Register</span></Link></li>
                <li><Link to="/login" className="mobile-nav-link"><FaSignInAlt className="mobile-icon" /><span>Login</span></Link></li>
                <li><Link to="/admin-login" className="mobile-nav-link"><FaUser className="mobile-icon" /><span>Admin Login</span></Link></li>
              </>
            ) : (
              <>
                <li className="mobile-divider"></li>
                <li><Link to="/profile" className="mobile-nav-link"><FaUser className="mobile-icon" /><span>Profile</span></Link></li>
                <li><Link to="/orders" className="mobile-nav-link"><FaShoppingCart className="mobile-icon" /><span>Orders</span></Link></li>
                <li><Link to="/cart" className="mobile-nav-link"><FaShoppingCart className="mobile-icon" /><span>Cart</span></Link></li>
                <li><Link to="/wishlist" className="mobile-nav-link"><FaHeart className="mobile-icon" /><span>Wishlist</span></Link></li>
                <li className="mobile-divider"></li>
                <li><button onClick={handleLogout} className="mobile-nav-link logout-link"><FaSignInAlt className="mobile-icon" /><span>Logout</span></button></li>
              </>
            )}
          </ul>

          <div className="mobile-menu-footer">
            <Link to="/order" className="mobile-cta-btn">
              <FaShoppingCart />
              <span>Order Now</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="navbar-spacer"></div>
    </>
  );
};

export default Navbar;