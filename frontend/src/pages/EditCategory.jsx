import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../components/AdminLayout';
import { FaEdit, FaArrowLeft, FaSave, FaTimes } from 'react-icons/fa';
import '../style/editcategory.css';

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [originalName, setOriginalName] = useState('');

  useEffect(() => {
    fetchCategory();
  }, [id]);

  const fetchCategory = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:1000/api/category/${id}/`);
      const data = await response.json();

      if (response.ok) {
        setCategoryName(data.category_name);
        setOriginalName(data.category_name);
      } else {
        toast.error('Category not found');
        setTimeout(() => navigate('/admin/manage-category'), 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load category');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (categoryName.trim() === originalName) {
      toast.info('No changes made');
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`http://127.0.0.1:1000/api/category/${id}/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category_name: categoryName.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Category updated successfully!');
        setTimeout(() => {
          navigate('/manage-category');
        }, 1500);
      } else {
        toast.error(data.message || 'Failed to update category');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating category');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (categoryName !== originalName) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/admin/manage-category');
      }
    } else {
      navigate('/admin/manage-category');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="edit-category-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading category...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="edit-category-page">
        <div className="container">
          {/* Back Button */}
          <button className="back-button" onClick={handleCancel}>
            <FaArrowLeft /> Back to Categories
          </button>

          {/* Edit Form Card */}
          <div className="edit-category-card">
            {/* Header */}
            <div className="card-header">
              <div className="header-icon">
                <FaEdit />
              </div>
              <h2>Edit Category</h2>
              <p>Update category information</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-group">
                <label htmlFor="categoryName">
                  Category Name <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="categoryName"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="Enter category name"
                  className="form-input"
                  required
                  autoFocus
                />
                <div className="input-hint">
                  {categoryName.length > 0 && (
                    <span className={categoryName.length > 50 ? 'text-danger' : 'text-muted'}>
                      {categoryName.length}/50 characters
                    </span>
                  )}
                </div>
              </div>

              {/* Changed Indicator */}
              {categoryName !== originalName && (
                <div className="change-indicator">
                  <span className="badge-warning">
                    ⚠️ Unsaved changes
                  </span>
                  <div className="change-preview">
                    <div className="change-item">
                      <span className="label">Original:</span>
                      <span className="value old">{originalName}</span>
                    </div>
                    <div className="change-arrow">→</div>
                    <div className="change-item">
                      <span className="label">New:</span>
                      <span className="value new">{categoryName}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="form-actions">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-cancel"
                  disabled={saving}
                >
                  <FaTimes /> Cancel
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={saving || !categoryName.trim() || categoryName === originalName}
                >
                  {saving ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      Saving...
                    </>
                  ) : (
                    <>
                      <FaSave /> Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Info Box */}
          <div className="info-box">
            <h4>📝 Important Notes</h4>
            <ul>
              <li>Category name must be unique</li>
              <li>Changes will affect all food items in this category</li>
              <li>Category name should be descriptive and easy to understand</li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditCategory;