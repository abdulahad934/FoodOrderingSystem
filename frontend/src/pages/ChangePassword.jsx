import React, { useState, useEffect } from "react";
import PublicLayout from "../components/PublicLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaLock, 
  FaEye, 
  FaEyeSlash, 
  FaKey,
  FaShieldAlt,
  FaCheckCircle
} from "react-icons/fa";
import '../style/changepassword.css';

const ChangePassword = () => {
  const userId = localStorage.getItem('userId');
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
  }, [userId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Calculate password strength for new password
    if (name === 'newPassword') {
      calculatePasswordStrength(value);
    }
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (password.length >= 12) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 15;
    if (/[^a-zA-Z0-9]/.test(password)) strength += 10;
    setPasswordStrength(Math.min(strength, 100));
  };

  const getStrengthLabel = () => {
    if (passwordStrength < 30) return 'Weak';
    if (passwordStrength < 60) return 'Fair';
    if (passwordStrength < 80) return 'Good';
    return 'Strong';
  };

  const getStrengthColor = () => {
    if (passwordStrength < 30) return '#e74c3c';
    if (passwordStrength < 60) return '#f39c12';
    if (passwordStrength < 80) return '#3498db';
    return '#27ae60';
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords({ ...showPasswords, [field]: !showPasswords[field] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.currentPassword) {
      toast.error('Please enter your current password');
      return;
    }

    if (!formData.newPassword) {
      toast.error('Please enter a new password');
      return;
    }

    if (formData.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('New password and confirm password do not match');
      return;
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error('New password must be different from current password');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://127.0.0.1:1000/api/change-password/${userId}/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          current_password: formData.currentPassword,
          new_password: formData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Password changed successfully!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setPasswordStrength(0);
        setTimeout(() => {
          navigate('/profile');
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to change password');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error connecting to server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="change-password-page">
        <div className="container py-5">
          <div className="password-container">
            {/* Left Side - Info */}
            <div className="password-info">
              <div className="info-header">
                <FaShieldAlt className="shield-icon" />
                <h2>Change Password</h2>
                <p>Keep your account secure</p>
              </div>

              <div className="security-tips">
                <h3>Password Requirements</h3>
                <ul>
                  <li>
                    <FaCheckCircle /> At least 8 characters long
                  </li>
                  <li>
                    <FaCheckCircle /> Contains uppercase and lowercase letters
                  </li>
                  <li>
                    <FaCheckCircle /> Includes at least one number
                  </li>
                  <li>
                    <FaCheckCircle /> Has at least one special character
                  </li>
                </ul>
              </div>

              <div className="security-note">
                <h4>🔒 Security Tips</h4>
                <p>
                  Never share your password with anyone. Choose a unique password 
                  that you don't use for other accounts.
                </p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="password-form-card">
              <div className="form-header">
                <FaKey className="key-icon" />
                <h3>Update Your Password</h3>
              </div>

              <form onSubmit={handleSubmit}>
                {/* Current Password */}
                <div className="form-group">
                  <label>
                    <FaLock /> Current Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      name="currentPassword"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => togglePasswordVisibility('current')}
                    >
                      {showPasswords.current ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                {/* New Password */}
                <div className="form-group">
                  <label>
                    <FaLock /> New Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswords.new ? "text" : "password"}
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleChange}
                      placeholder="Enter new password"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => togglePasswordVisibility('new')}
                    >
                      {showPasswords.new ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {formData.newPassword && (
                    <div className="password-strength">
                      <div className="strength-bar">
                        <div
                          className="strength-fill"
                          style={{
                            width: `${passwordStrength}%`,
                            background: getStrengthColor()
                          }}
                        ></div>
                      </div>
                      <span
                        className="strength-label"
                        style={{ color: getStrengthColor() }}
                      >
                        {getStrengthLabel()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="form-group">
                  <label>
                    <FaLock /> Confirm New Password
                  </label>
                  <div className="password-input-wrapper">
                    <input
                      type={showPasswords.confirm ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="Confirm new password"
                      required
                    />
                    <button
                      type="button"
                      className="toggle-password"
                      onClick={() => togglePasswordVisibility('confirm')}
                    >
                      {showPasswords.confirm ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>

                  {/* Password Match Indicator */}
                  {formData.confirmPassword && (
                    <div className="password-match">
                      {formData.newPassword === formData.confirmPassword ? (
                        <span className="match-success">
                          <FaCheckCircle /> Passwords match
                        </span>
                      ) : (
                        <span className="match-error">
                          ✗ Passwords do not match
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Updating...
                    </>
                  ) : (
                    <>
                      <FaShieldAlt /> Change Password
                    </>
                  )}
                </button>

                {/* Cancel Button */}
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate('/profile')}
                  disabled={loading}
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ChangePassword;