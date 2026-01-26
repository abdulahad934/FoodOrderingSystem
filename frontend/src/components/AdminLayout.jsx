import React from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import '../style/admin.css'

const AdminLayout = ({children}) => {
  return (
    <div className='d-flex'>
        <AdminSidebar/>
        <div id='page-content-wrapper' className='w-100'>
            <AdminHeader/>
            <div className='container-flueid mt-3'>
                {children}

            </div>
        </div>
    </div>
  )
}

export default AdminLayout