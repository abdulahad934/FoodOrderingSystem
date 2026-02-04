import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from './PublicLayout';
import '../style/login.css';

const Login = () => {
  const [formData, setFormData] = useState({ identifier: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { identifier, password } = formData;

    if (!identifier || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:1000/api/login/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Login successful");
        localStorage.setItem('userId', result.userId);
        localStorage.setItem('userName', result.userName);
        localStorage.setItem('authToken', result.token);
        setFormData({ identifier: '', password: '' });
        setTimeout(() => navigate('/'), 1500);
      } else {
        toast.error(result.message || "Invalid Credentials");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  };

  const EyeIcon = ({ show }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
      {show ? (
        <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7.028 7.028 0 0 0-2.79.588l.77.771A5.944 5.944 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.134 13.134 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755-.165.165-.337.328-.517.486l.708.709zM11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829l.822.822zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829zM3.35 5.47c-.18.16-.353.322-.518.487A13.134 13.134 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7.029 7.029 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12-.708.708z"/>
      ) : (
        <><path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z"/>
        <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z"/></>
      )}
    </svg>
  );

  const features = [
    { icon: '🍔', title: 'Wide Selection', desc: 'Thousands of restaurants' },
    { icon: '⚡', title: 'Fast Delivery', desc: 'Under 30 minutes' },
    { icon: '💰', title: 'Best Prices', desc: 'Great deals daily' },
    { icon: '⭐', title: 'Top Rated', desc: '4.8+ star reviews' }
  ];

  return (
    <PublicLayout>
      <div className="login-page">
        <ToastContainer position="top-center" autoClose={2000} />
        
        <div className="login-decoration">
          <div className="decoration-shape shape-1"></div>
          <div className="decoration-shape shape-2"></div>
          <div className="decoration-shape shape-3"></div>
        </div>

        <div className="container py-5">
          <div className="row justify-content-center align-items-center">
            {/* Left Info */}
            <div className="col-lg-5 d-none d-lg-block">
              <div className="login-info">
                <div className="info-content">
                  <div className="info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                    </svg>
                  </div>
                  <h2 className="info-title">Welcome Back!</h2>
                  <p className="info-description">
                    Login to your account and continue enjoying delicious food delivered fast!
                  </p>
                  
                  <div className="features-grid">
                    {features.map((feature, idx) => (
                      <div className="feature-card" key={idx}>
                        <div className="feature-icon-lg">{feature.icon}</div>
                        <h6>{feature.title}</h6>
                        <small>{feature.desc}</small>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="col-lg-6 col-md-8">
              <div className="login-card">
                <div className="login-card-header">
                  <div className="header-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                    </svg>
                  </div>
                  <h2 className="login-title">Sign In</h2>
                  <p className="login-subtitle">Access your account</p>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                  <div className="form-group">
                    <label className="form-label">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                      </svg>
                      Email or Phone Number
                    </label>
                    <input
                      name="identifier"
                      type="text"
                      className="form-input"
                      value={formData.identifier}
                      onChange={handleChange}
                      placeholder="Email or phone number"
                      required
                    />
                    <small className="input-hint">Enter your email address or phone number</small>
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                      </svg>
                      Password
                    </label>
                    <div className="password-input-wrapper">
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        className="form-input"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        <EyeIcon show={showPassword} />
                      </button>
                    </div>
                  </div>

                  <div className="form-options">
                    <div className="remember-me">
                      <input type="checkbox" id="rememberMe" className="custom-checkbox" />
                      <label htmlFor="rememberMe" className="checkbox-label">Remember me</label>
                    </div>
                    <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
                  </div>

                  <button type="submit" className="btn-submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        Signing in...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z"/>
                          <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z"/>
                        </svg>
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="signup-link">
                  Don't have an account? <Link to="/register" className="link-primary">Create one now</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Login;