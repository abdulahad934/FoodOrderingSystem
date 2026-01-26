import React, {useState} from 'react';
import {FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import '../style/admin.css'
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'


const AdminLogin = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch('http://127.0.0.1:1000/api/admin-login/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username,
        password
      })
    });

    const data = await response.json();

    if (response.ok) {
      toast.success(data.message);
      setTimeout(() => {
        window.location.href = '/admin-dashboard';
      }, 2000);
    } else {
      toast.error(data.message || 'Login failed');
    }

  } catch (error) {
    toast.error('Server error. Try again later');
    console.error(error);
  }
};


  return (

    <div  className="d-flex vh-100 align-items-center justify-content-center position-relative"
  style={{
    backgroundImage: "url('/img/7.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundColor: "#00000",
    
  }}>
        <div className='card p-2 shadow-lg text-white' style={{maxWidth:'400px', width:'100%', backgroundColor: "rgba(0,0,0,0.6)"}}>
            <h4 className='text-center mb-4'> <FaLock className='me-2 icon-fix'/>Admin Login</h4>
            <form onSubmit={handleLogin}>
                <div className='mb-3'>
                    <label className='form-label'> <FaUser className='me-1 icon-fix'/> UserName</label>
                    <input type="text" className='form-control' value={username} onChange={(e)=>setUsername(e.target.value)} placeholder='Enter admin UserName' required/>
                </div>

                <div className='mb-3'>
                    <label className='form-label'> <FaLock className='me-1 icon-fix'/> Password</label>
                    <input type="password" className='form-control' value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter password' required/>
                </div>

                <button type='submit' className='btn btn-primary w-100 mt-3'>
                    <FaSignInAlt className='me-1 icon-fix'/> Login
                </button>


            </form>
        </div>
        <ToastContainer position='top-right' autoClose={2000}/>
    </div>
  )
}

export default AdminLogin