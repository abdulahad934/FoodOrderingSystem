import React, { useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://127.0.0.1:1000/api/add-category/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category_name: categoryName }),
      });

      const data = await response.json();

      if (response.status === 201) {
        toast.success(data.message);
        setCategoryName(''); // clear input after success
      } else {
        toast.error("Somthing went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error('Error connecting to server');
    }
  };

  return (
    <AdminLayout>
      <div className="row">
        {/* Left column: Add Category Form */}
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h4 className="mb-4 text-primary fw-bold">
                <i className="fas fa-plus-circle me-2"></i> Add Category
              </h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Category Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter category name"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3 d-flex align-items-center justify-content-center"
                >
                  <i className="fa fa-plus me-2"></i> Add Category
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Right column: Sidebar card */}
        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="fw-bold mb-3 text-secondary">Category Icon</h5>
              <i className="fas fa-utensils" style={{ fontSize: '150px', color: '#e5e5e5' }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer position="top-center" autoClose={2000} />
    </AdminLayout>
  );
};

export default AddCategory;
