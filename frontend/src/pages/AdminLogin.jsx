import React from 'react'
import {FaUser, FaLock, FaSignInAlt } from "react-icons/fa";

const AdminLogin = () => {
  return (
    <div className='d-flex vh-100 align-items-center justify-content-center'>
        <div className='card p-2 shadow-lg' style={{maxWidth:'400px', width:'100%'}}>
            <h4 className='text-center mb-4'> <FaLock className='me-2'/>Login</h4>
            <form>
                <div className='mb-3'>
                    <label className='form-label'> <FaUser className='me-1'/> UserName</label>
                    <input type="text" className='form-control' placeholder='Enter admin UserName' required/>
                </div>

                <div className='mb-3'>
                    <label className='form-label'> <FaLock className='me-1'/> Password</label>
                    <input type="password" className='form-control' placeholder='Enter password' required/>
                </div>

                <button type='submit' className='btn btn-primary w-100 mt-3'>
                    <FaSignInAlt className='me-1'/> Login
                </button>


            </form>
        </div>
    </div>
  )
}

export default AdminLogin