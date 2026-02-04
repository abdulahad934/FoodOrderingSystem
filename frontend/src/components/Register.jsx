import React, { useState } from 'react';
import PublicLayout from './PublicLayout';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/register.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '', lastname: '', mobilenumber: '', email: '', password: '', confirmpassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'password') setPasswordStrength(checkPasswordStrength(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { firstname, lastname, mobilenumber, email, password, confirmpassword } = formData;

    if (!firstname || !lastname || !mobilenumber || !email || !password || !confirmpassword) {
      toast.error('Please fill in all fields');
      return;
    }
    if (password !== confirmpassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:1000/api/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstname, lastname, mobilenumber, email, password })
      });
      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Registration successful");
        setFormData({ firstname: '', lastname: '', mobilenumber: '', email: '', password: '', confirmpassword: '' });
        setTimeout(() => navigate('/login'), 1500);
      } else {
        toast.error(result.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      toast.error("Error connecting to server");
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthLabel = () => {
    const labels = [
      { text: 'Weak', color: '#dc3545' },
      { text: 'Weak', color: '#dc3545' },
      { text: 'Fair', color: '#ffc107' },
      { text: 'Good', color: '#17a2b8' },
      { text: 'Strong', color: '#28a745' }
    ];
    return labels[passwordStrength] || { text: '', color: '' };
  };

  const strengthInfo = getPasswordStrengthLabel();

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

  const benefits = [
    { title: 'Fast Delivery', desc: 'Get your food within 30 minutes' },
    { title: 'Exclusive Offers', desc: 'Special deals for members only' },
    { title: 'Order Tracking', desc: 'Track your order in real-time' },
    { title: 'Loyalty Rewards', desc: 'Earn points with every order' }
  ];

  return (
    <PublicLayout>
      <div className="register-page">
        <ToastContainer position="top-center" autoClose={2000} />
        <div className="register-decoration">
          <div className="decoration-shape shape-1"></div>
          <div className="decoration-shape shape-2"></div>
          <div className="decoration-shape shape-3"></div>
        </div>

        <div className="container py-5">
          <div className="row justify-content-center">
            {/* Left Info */}
            <div className="col-lg-5 d-none d-lg-block">
              <div className="register-info">
                <div className="info-content">
                  <div className="info-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z"/>
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"/>
                    </svg>
                  </div>
                  <h2 className="info-title">Join Our Food Community</h2>
                  <p className="info-description">
                    Create an account to enjoy exclusive benefits and get your favorite food delivered fast!
                  </p>
                  <div className="benefits-list">
                    {benefits.map((benefit, idx) => (
                      <div className="benefit-item" key={idx}>
                        <div className="benefit-icon">
                          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                            <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                          </svg>
                        </div>
                        <div className="benefit-text">
                          <h6>{benefit.title}</h6>
                          <small>{benefit.desc}</small>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="col-lg-7 col-md-10">
              <div className="register-card">
                <div className="register-card-header">
                  <div className="header-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M15 14s1 0 1-1-1-4-5-4-5 3-5 4 1 1 1 1h8Zm-7.978-1A.261.261 0 0 1 7 12.996c.001-.264.167-1.03.76-1.72C8.312 10.629 9.282 10 11 10c1.717 0 2.687.63 3.24 1.276.593.69.758 1.457.76 1.72l-.008.002a.274.274 0 0 1-.014.002H7.022ZM11 7a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm3-2a3 3 0 1 1-6 0 3 3 0 0 1 6 0ZM6.936 9.28a5.88 5.88 0 0 0-1.23-.247A7.35 7.35 0 0 0 5 9c-4 0-5 3-5 4 0 .667.333 1 1 1h4.216A2.238 2.238 0 0 1 5 13c0-1.01.377-2.042 1.09-2.904.243-.294.526-.569.846-.816ZM4.92 10A5.493 5.493 0 0 0 4 13H1c0-.26.164-1.03.76-1.724.545-.636 1.492-1.256 3.16-1.275ZM1.5 5.5a3 3 0 1 1 6 0 3 3 0 0 1-6 0Zm3-2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z"/>
                    </svg>
                  </div>
                  <h2 className="register-title">Create Account</h2>
                  <p className="register-subtitle">Join us today and start ordering!</p>
                </div>

                <form onSubmit={handleSubmit} className="register-form">
                  <div className="row g-3">
                    {['firstname', 'lastname'].map((field) => (
                      <div className="col-md-6" key={field}>
                        <div className="form-group">
                          <label className="form-label">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                              <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4Zm-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10c-2.29 0-3.516.68-4.168 1.332-.678.678-.83 1.418-.832 1.664h10Z"/>
                            </svg>
                            {field === 'firstname' ? 'First Name' : 'Last Name'}
                          </label>
                          <input name={field} type="text" className="form-input" value={formData[field]} onChange={handleChange} placeholder={field === 'firstname' ? 'John' : 'Doe'} required />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M11 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h6zM5 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H5z"/>
                        <path d="M8 14a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>
                      </svg>
                      Mobile Number
                    </label>
                    <input name="mobilenumber" type="tel" className="form-input" value={formData.mobilenumber} onChange={handleChange} placeholder="01XXXXXXXXX" required />
                  </div>

                  <div className="form-group">
                    <label className="form-label">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M0 4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V4Zm2-1a1 1 0 0 0-1 1v.217l7 4.2 7-4.2V4a1 1 0 0 0-1-1H2Zm13 2.383-4.708 2.825L15 11.105V5.383Zm-.034 6.876-5.64-3.471L8 9.583l-1.326-.795-5.64 3.47A1 1 0 0 0 2 13h12a1 1 0 0 0 .966-.741ZM1 11.105l4.708-2.897L1 5.383v5.722Z"/>
                      </svg>
                      Email Address
                    </label>
                    <input name="email" type="email" className="form-input" value={formData.email} onChange={handleChange} placeholder="john.doe@example.com" required />
                  </div>

                  {['password', 'confirmpassword'].map((field) => (
                    <div className="form-group" key={field}>
                      <label className="form-label">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M8 1a2 2 0 0 1 2 2v4H6V3a2 2 0 0 1 2-2zm3 6V3a3 3 0 0 0-6 0v4a2 2 0 0 0-2 2v5a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2z"/>
                        </svg>
                        {field === 'password' ? 'Password' : 'Confirm Password'}
                      </label>
                      <div className="password-input-wrapper">
                        <input name={field} type={field === 'password' ? (showPassword ? 'text' : 'password') : (showConfirmPassword ? 'text' : 'password')} className="form-input" value={formData[field]} onChange={handleChange} placeholder={field === 'password' ? 'Enter your password' : 'Re-enter your password'} required />
                        <button type="button" className="password-toggle" onClick={() => field === 'password' ? setShowPassword(!showPassword) : setShowConfirmPassword(!showConfirmPassword)}>
                          <EyeIcon show={field === 'password' ? showPassword : showConfirmPassword} />
                        </button>
                      </div>
                      {field === 'password' && formData.password && (
                        <div className="password-strength-bar">
                          <div className="strength-bars">
                            {[1, 2, 3, 4].map((level) => (
                              <div key={level} className={`strength-bar ${passwordStrength >= level ? 'active' : ''}`} style={{ backgroundColor: passwordStrength >= level ? strengthInfo.color : '#e0e0e0' }}></div>
                            ))}
                          </div>
                          {strengthInfo.text && <span className="strength-text" style={{ color: strengthInfo.color }}>{strengthInfo.text}</span>}
                        </div>
                      )}
                    </div>
                  ))}

                  <div className="form-check-custom">
                    <input type="checkbox" className="custom-checkbox" id="termsCheck" required />
                    <label className="checkbox-label" htmlFor="termsCheck">
                      I agree to the <Link to="/terms" className="terms-link">Terms & Conditions</Link> and <Link to="/privacy" className="terms-link">Privacy Policy</Link>
                    </label>
                  </div>

                  <button type="submit" className="btn-submit" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z"/>
                        </svg>
                        <span>Create Account</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="login-link">
                  Already have an account? <Link to="/login" className="link-primary">Sign in here</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default Register;