import React, { useState } from 'react';
import PublicLayout from './PublicLayout';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    mobilenumber: '',
    email: '',
    password: '',
    confirmpassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmpassword) {
      toast.error("Passwords do not match!");
      return;
    }

    // এখানে তোমার API call হবে (backend এ user create করার জন্য)
    toast.success("Registration successful!");
    navigate('/login'); // সফল হলে login page এ redirect করবে
  };

  return (
    <PublicLayout>
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-lg rounded-4 border-0">
              <div className="card-body p-5">
                <h3 className="text-center mb-4 text-primary fw-bold">
                  <i className="fas fa-user-plus me-2"></i> User Registration
                </h3>

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">First Name</label>
                    <input
                      name="firstname"
                      type="text"
                      className="form-control"
                      value={formData.firstname}
                      onChange={handleChange}
                      placeholder="Enter First Name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Last Name</label>
                    <input
                      name="lastname"
                      type="text"
                      className="form-control"
                      value={formData.lastname}
                      onChange={handleChange}
                      placeholder="Enter Last Name"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Mobile Number</label>
                    <input
                      name="mobilenumber"
                      type="number"
                      className="form-control"
                      value={formData.mobilenumber}
                      onChange={handleChange}
                      placeholder="Enter Mobile Number"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Email</label>
                    <input
                      name="email"
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Enter Email"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Password</label>
                    <input
                      name="password"
                      type="password"
                      className="form-control"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Enter Password"
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-semibold">Confirm Password</label>
                    <input
                      name="confirmpassword"
                      type="password"
                      className="form-control"
                      value={formData.confirmpassword}
                      onChange={handleChange}
                      placeholder="Confirm Password"
                    />
                  </div>

                  {/* Checkbox */}
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="termsCheck"
                    />
                    <label className="form-check-label" htmlFor="termsCheck">
                      I agree to the <Link to="/terms">Terms & Conditions</Link>
                    </label>
                  </div>

                  {/* Submit Button */}
                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-primary fw-semibold">
                      <i className="fas fa-check-circle me-2"></i> Register
                    </button>
                  </div>
                </form>

                {/* Divider */}
                <div className="text-center my-3">
                  <span className="text-muted">OR</span>
                </div>

                {/* Google/Gmail Register Option */}
                <div className="d-grid mb-3">
                  <button className="btn btn-danger fw-semibold">
                    <i className="fab fa-google me-2"></i> Register with Google
                  </button>
                </div>

                {/* Already Registered Link */}
                <div className="text-center mt-3">
                  Already registered? <Link to="/login" className="text-decoration-none fw-bold">Login here</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </PublicLayout>
  );
};

export default Register;
