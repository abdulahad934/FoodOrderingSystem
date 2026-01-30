import React, { useState } from 'react';
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import '../style/admin_login.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PublicLayout from '../components/PublicLayout';

const AdminLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://127.0.0.1:1000/api/admin-login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        localStorage.setItem("adminUser", username);
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
    <PublicLayout>
    <div
      className="d-flex vh-100 align-items-center justify-content-center position-relative login-bg"
    >
      <div className="card login-card shadow-lg">
        <h4 className="text-center mb-4 text-primary fw-bold">
          <FaLock className="me-2" /> Admin Login
        </h4>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <FaUser className="me-1" /> Username
            </label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              <FaLock className="me-1" /> Password
            </label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 mt-3 fw-bold">
            <FaSignInAlt className="me-1" /> Login
          </button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={2000} />
    </div>
    </PublicLayout>
  );
};

export default AdminLogin;
