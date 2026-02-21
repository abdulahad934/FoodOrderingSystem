import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FaChevronDown,
  FaChevronUp,
  FaCommentAlt,
  FaEdit,
  FaFile,
  FaList,
  FaSearch,
  FaThLarge,
  FaUsers
} from 'react-icons/fa'
import '../style/admin.css'

const AdminSidebar = () => {
  const [openMenus, setOpenMenus] = useState({
    category: false,
    food: false,
    orders: false,
  })

  const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }))
  }

  return (
    <div className="sidebar">
      {/* Profile */}
      <div className="profile-card">
        <img src="/img/admin.jpg" alt="admin" />
        <h6>Admin</h6>
        <small className="role">System Administrator</small>
      </div>

      {/* Menu */}
      <div className="menu-list">
        <Link to="/dashboard" className="menu-item">
          <FaThLarge className="me-2" /> Dashboard
        </Link>

        <Link to="/registered-users" className="menu-item">
          <FaUsers className="me-2" /> Registered Users
        </Link>

        {/* Category */}
        <button onClick={() => toggleMenu('category')} className="menu-item toggle">
          <span><FaEdit className="me-2" /> Food Category</span>
          {openMenus.category ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <div className={`submenu ${openMenus.category ? 'open' : ''}`}>
          <Link to="/add-category">Add Category</Link>
          <Link to="/manage-category">Manage Category</Link>
        </div>

        {/* Food Item */}
        <button onClick={() => toggleMenu('food')} className="menu-item toggle">
          <span><FaEdit className="me-2" /> Food Item</span>
          {openMenus.food ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <div className={`submenu ${openMenus.food ? 'open' : ''}`}>
          <Link to="/add-food">Add Food Item</Link>
          <Link to="/manage-food">Manage Food Item</Link>
        </div>

        {/* Orders */}
        <button onClick={() => toggleMenu('orders')} className="menu-item toggle">
          <span><FaList className="me-2" /> Orders</span>
          {openMenus.orders ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <div className={`submenu ${openMenus.orders ? 'open' : ''}`}>
          <Link to="/order-not-confirmed">Not Confirmed</Link>
          <Link to="/confirmed">Confirmed</Link>
          <Link to="/being-prepared">Being Prepared</Link>
          <Link to="/food-pickup">Food Pickup</Link>
          <Link to="/delivered">Delivered</Link>
          <Link to="/order-cancelled">Cancelled</Link>
          <Link to="/all-orders">All Orders</Link>
        </div>

        <Link to="/order-report" className="menu-item">
          <FaFile className="me-2" /> B/W Dates Report
        </Link>

        <Link to="/admin/search" className="menu-item">
          <FaSearch className="me-2" /> Search
        </Link>

        <Link to="/admin/reviews" className="menu-item">
          <FaCommentAlt className="me-2" /> Manage Reviews
        </Link>
      </div>
    </div>
  )
}

export default AdminSidebar
