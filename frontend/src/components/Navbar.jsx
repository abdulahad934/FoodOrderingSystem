import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  FaHome, FaUtensils, FaTruck, FaUserPlus, FaSignInAlt,
  FaShoppingCart, FaUser, FaHeart, FaBars, FaTimes, FaChevronDown,
  FaClipboardList, FaShieldAlt
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
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownOpen && !e.target.closest('.user-dropdown')) {
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
        <div className="container-fluid pt-2">
          <div className="navbar-wrapper">
            {/* Logo */}
            <Link className="navbar-logo" to="/">
              <div className="logo-icon"><FaUtensils /></div>
              <span className="logo-text">
                Food<span className="logo-highlight">Order</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <ul className="navbar-menu desktop-menu">
              {navLinks.map(({ path, icon: Icon, label }) => (
                <li key={path} className={`menu-item ${isActive(path)}`}>
                  <Link to={path} className="menu-link">
                    <Icon />
                    <span>{label}</span>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Actions */}
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
                  <Link to="/admin-login" className="btn-nav btn-login" style={{ gap: 7 }}>
                    <FaShieldAlt />
                    <span>Admin</span>
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/cart" className="icon-btn" title="Cart">
                    <FaShoppingCart />
                  </Link>
                  <Link to="/wishlist" className="icon-btn" title="Wishlist">
                    <FaHeart />
                  </Link>

                  <div className="user-dropdown">
                    <button
                      className="user-btn"
                      onClick={() => setDropdownOpen(!dropdownOpen)}
                      aria-expanded={dropdownOpen}
                    >
                      <div className="user-avatar">
                        {userName?.charAt(0)?.toUpperCase()}
                      </div>
                      <span className="user-name">{userName}</span>
                      <FaChevronDown className="user-chevron" />
                    </button>

                    <div className={`dropdown-menu ${dropdownOpen ? 'show' : ''}`}>
                      <Link
                        to="/profile"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaUser />
                        <span>My Profile</span>
                      </Link>
                      <Link
                        to="/orders"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaClipboardList />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/changepassword"
                        className="dropdown-item"
                        onClick={() => setDropdownOpen(false)}
                      >
                        <FaClipboardList />
                        <span>ChangPassword</span>
                      </Link>
                      <div className="dropdown-divider" />
                      <button onClick={handleLogout} className="dropdown-item logout-btn">
                        <FaSignInAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                </>
              )}

              <Link to="/my-orders" className="btn-primary-cta">
                <FaShoppingCart />
                <span>Order Now</span>
              </Link>

              <button
                className="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <FaTimes /> : <FaBars />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'active' : ''}`}>
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)} />
        <div className="mobile-menu-content">
          <div className="mobile-menu-header">
            <h3>Food<span style={{ color: 'var(--primary)' }}>Order</span></h3>
            <button className="close-btn" onClick={() => setMobileMenuOpen(false)}>
              <FaTimes />
            </button>
          </div>

          <ul className="mobile-nav-list">
            {navLinks.map(({ path, icon: Icon, label }) => (
              <li key={path} className={isActive(path)}>
                <Link to={path} className="mobile-nav-link">
                  <Icon />
                  <span>{label}</span>
                </Link>
              </li>
            ))}

            {!isLoggedIn ? (
              <>
                <li><div className="mobile-divider" /></li>
                <li>
                  <Link to="/register" className="mobile-nav-link">
                    <FaUserPlus /><span>Register</span>
                  </Link>
                </li>
                <li>
                  <Link to="/login" className="mobile-nav-link">
                    <FaSignInAlt /><span>Login</span>
                  </Link>
                </li>
                <li>
                  <Link to="/admin-login" className="mobile-nav-link">
                    <FaShieldAlt /><span>Admin Login</span>
                  </Link>
                </li>
              </>
            ) : (
              <>
                <li><div className="mobile-divider" /></li>
                <li><Link to="/profile" className="mobile-nav-link"><FaUser /><span>My Profile</span></Link></li>
                <li><Link to="/orders" className="mobile-nav-link"><FaClipboardList /><span>My Orders</span></Link></li>
                <li><Link to="/cart" className="mobile-nav-link"><FaShoppingCart /><span>Cart</span></Link></li>
                <li><Link to="/wishlist" className="mobile-nav-link"><FaHeart /><span>Wishlist</span></Link></li>
                <li><div className="mobile-divider" /></li>
                <li>
                  <button onClick={handleLogout} className="mobile-nav-link logout-link">
                    <FaSignInAlt /><span>Logout</span>
                  </button>
                </li>
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

      <div className="navbar-spacer" />
    </>
  );
};

export default Navbar;