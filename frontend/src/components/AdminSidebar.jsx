import React, { useState } from 'react'
import '../style/admin.css'
import { Link } from 'react-router-dom'
import { FaEdit, FaSearch, FaThLarge, FaUsers } from 'react-icons/fa'

const AdminSidebar = () => {
//   const [openMenus, setOpenMenus] = useState({
//     category: false,
//     food: false,
//   })

//   const toggleMenu = (menu) => {
//     setOpenMenus((prev) => ({
//       ...prev,
//       [menu]: !prev[menu],
//     }))
//   }

const [openMenus, setOpenMenus] = useState({
    category: false,
    food : false
})

const toggleMenu = (menu) => {
    setOpenMenus((prev) => ({
        ...prev,
        [menu]: !prev[menu]
    }))
}

  return (
    <div className="bg-dark text-white sidebar">
      {/* Admin Profile */}
      <div className="text-center p-3 border-bottom">
        <img
          src="/img/admin.jpg"
          alt="admin"
          className="img-fluid rounded-circle"
          style={{ width: '100px', height: '100px', objectFit: 'cover' }}
        />
        <h6 className="pt-2">Admin</h6>
      </div>

      {/* Menu */}
      <div className="list-group list-group-flush">

        <Link to="/admin/dashboard" className="list-group-item list-group-action bg-dark text-white">
          <FaThLarge className="me-2" />
          Dashboard
        </Link>

        <Link to="/admin/users" className="list-group-item list-group-action bg-dark text-white">
          <FaUsers className="me-2" />
          Reg Users
        </Link>

        {/* Category */}
        <button
        onClick={()=> toggleMenu('category')}
          className="list-group-item list-group-action bg-dark text-white border-0 text-start"
        >
          <FaEdit className="me-2" />
          Food Category
        </button>

        {openMenus.category &&(

        
          <div className="ps-4">
            <Link to="/admin/add-category" className="list-group-item list-group-action bg-dark text-white">
              Add Category
            </Link>
            <Link to="/admin/manage-category" className="list-group-item list-group-action bg-dark text-white">
              Manage Category
            </Link>
          </div>
        )}

        {/* Food Item */}
        <button
          onClick={() => toggleMenu('food')}
          className="list-group-item list-group-action bg-dark text-white border-0 text-start"
        >
          <FaEdit className="me-2" />
          Food Item
        </button>

        {openMenus.food && (
          <div className="ps-4">
            <Link to="/admin/add-food" className="list-group-item list-group-action bg-dark text-white">
              Add Food Item
            </Link>
            <Link to="/admin/manage-food" className="list-group-item list-group-action bg-dark text-white">
              Manage Food Item
            </Link>
          </div>
        )}

        <Link to="/admin/search" className="list-group-item list-group-action bg-dark text-white">
          <FaSearch className="me-2" />
          Search
        </Link>

        <Link to="/admin/reviews" className="list-group-item list-group-action bg-dark text-white">
          <FaThLarge className="me-2" />
          Manage Reviews
        </Link>

      </div>
    </div>
  )
}

export default AdminSidebar
