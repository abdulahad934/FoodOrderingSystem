import React, {useState} from 'react'
import { FaBars, FaBell, FaSignOutAlt } from 'react-icons/fa'
import { useNavigate} from 'react-router-dom'
import '../style/admin_headers.css'
const AdminHeader = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("adminUser");
        navigate("/admin-login");
    }

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom px-4 py-3 shadow-sm">
      {/* Brand */}
      <span className="navbar-brand fw-bold d-flex align-items-center">
        <i className="fas fa-utensils me-2 text-primary"></i>
        Food Ordering System
      </span>

      {/* Toggle for mobile */}
      <button
        className="navbar-toggler border-0 ms-auto"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#adminNavbar"
      >
        <FaBars />
      </button>

      {/* Right side menu */}
      <div className="collapse navbar-collapse" id="adminNavbar">
        <ul className="navbar-nav ms-auto align-items-center gap-3">
          {/* Notifications */}
          <li className="nav-item position-relative">
            <button className="btn btn-light position-relative rounded-circle shadow-sm">
              <FaBell />
              
            </button>
          </li>

          {/* Logout */}
          <li className="nav-item">
            <button className="btn btn-danger d-flex align-items-center shadow-sm" onClick={handleLogout}>
              <FaSignOutAlt className="me-2" /> Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  )
}

export default AdminHeader
