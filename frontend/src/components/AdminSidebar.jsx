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
        <Link to="/admin/dashboard" className="menu-item">
          <FaThLarge className="me-2" /> Dashboard
        </Link>

        <Link to="/admin/users" className="menu-item">
          <FaUsers className="me-2" /> Registered Users
        </Link>

        {/* Category */}
        <button onClick={() => toggleMenu('category')} className="menu-item toggle">
          <span><FaEdit className="me-2" /> Food Category</span>
          {openMenus.category ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <div className={`submenu ${openMenus.category ? 'open' : ''}`}>
          <Link to="/add-category">Add Category</Link>
          <Link to="/admin/manage-category">Manage Category</Link>
        </div>

        {/* Food Item */}
        <button onClick={() => toggleMenu('food')} className="menu-item toggle">
          <span><FaEdit className="me-2" /> Food Item</span>
          {openMenus.food ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <div className={`submenu ${openMenus.food ? 'open' : ''}`}>
          <Link to="/admin/add-food">Add Food Item</Link>
          <Link to="/admin/manage-food">Manage Food Item</Link>
        </div>

        {/* Orders */}
        <button onClick={() => toggleMenu('orders')} className="menu-item toggle">
          <span><FaList className="me-2" /> Orders</span>
          {openMenus.orders ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        <div className={`submenu ${openMenus.orders ? 'open' : ''}`}>
          <Link to="/admin/orders/not-confirmed">Not Confirmed</Link>
          <Link to="/admin/orders/confirmed">Confirmed</Link>
          <Link to="/admin/orders/preparing">Being Prepared</Link>
          <Link to="/admin/orders/pickup">Food Pickup</Link>
          <Link to="/admin/orders/delivered">Delivered</Link>
          <Link to="/admin/orders/cancelled">Cancelled</Link>
          <Link to="/admin/orders/all">All Orders</Link>
        </div>

        <Link to="/admin/report" className="menu-item">
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
