import React, {useState, useEffect} from 'react'
import AdminSidebar from './AdminSidebar'
import AdminHeader from './AdminHeader'
import '../style/admin.css'

const AdminLayout = ({children}) => {

  
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() =>{
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      }
      else{
        setSidebarOpen(true);
      }
    }
    handleResize(); 
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);

  }, []);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);


  return (
    <div className='d-flex'>
        {sidebarOpen && <AdminSidebar/>}
        <div id='page-content-wrapper' className='w-100'>
            <AdminHeader toggleSidebar= {toggleSidebar} sidebarOpen= {sidebarOpen}/>
            <div className='container-fluid mt-3'>
                {children}

            </div>
        </div>
    </div>
  )
}

export default AdminLayout