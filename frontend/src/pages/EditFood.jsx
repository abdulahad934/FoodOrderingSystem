import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../components/AdminLayout';
import {
  FaUtensils,
  FaArrowLeft,
  FaSave,
  FaTimes,
  FaImage,
  FaTrash,
} from 'react-icons/fa';
import '../style/editfood.css';

const EditFood = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    category: '',
    item_name: '',
    item_description: '',
    item_price: '',
    item_quantity: '',
    is_available: true,
  });

  const [currentImage, setCurrentImage] = useState(null);
  const [newImage, setNewImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalData, setOriginalData] = useState({});

  useEffect(() => {
    fetchCategories();
    fetchFoodItem();
  }, [id]);

  useEffect(() => {
    const changed =
      JSON.stringify(formData) !== JSON.stringify(originalData) || newImage !== null;
    setHasChanges(changed);
  }, [formData, newImage, originalData]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://127.0.0.1:1000/api/categories/');
      const data = await response.json();
      setCategories(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchFoodItem = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://127.0.0.1:1000/api/food/${id}/`);
      const data = await response.json();

      if (response.ok) {
        const foodData = {
          category: data.category,
          item_name: data.item_name,
          item_description: data.item_description,
          item_price: data.item_price,
          item_quantity: data.item_quantity,
          is_available: data.is_available,
        };
        setFormData(foodData);
        setOriginalData(foodData);

        // ✅ Fix: Full image URL set করা
        const imageUrl = data.image_url || data.image;
        if (imageUrl) {
          setCurrentImage(
            imageUrl.startsWith('http')
              ? imageUrl
              : `http://127.0.0.1:1000${imageUrl}`
          );
        }
      } else {
        toast.error('Food item not found');
        setTimeout(() => navigate('/manage-food'), 2000);
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load food item');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setNewImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveNewImage = () => {
    setNewImage(null);
    setImagePreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.item_name.trim()) {
      toast.error('Item name is required');
      return;
    }
    if (!formData.item_price || formData.item_price <= 0) {
      toast.error('Valid price is required');
      return;
    }

    setSaving(true);

    try {
      const submitData = new FormData();
      submitData.append('category', formData.category);
      submitData.append('item_name', formData.item_name);
      submitData.append('item_description', formData.item_description);
      submitData.append('item_price', formData.item_price);
      submitData.append('item_quantity', formData.item_quantity);
      submitData.append('is_available', formData.is_available);

      if (newImage) {
        submitData.append('image', newImage);
      }

      const response = await fetch(`http://127.0.0.1:1000/api/food/update/${id}/`, {
        method: 'PUT',
        body: submitData,
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Food item updated successfully!');
        setTimeout(() => {
          navigate('/manage-food');
        }, 1500);
      } else {
        toast.error(data.message || 'Failed to update food item');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error updating food item');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (window.confirm('You have unsaved changes. Are you sure you want to leave?')) {
        navigate('/manage-food');
      }
    } else {
      navigate('/manage-food');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="edit-food-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading food item...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="edit-food-page">
        <div className="container">
          {/* Back Button */}
          <button className="back-button" onClick={handleCancel}>
            <FaArrowLeft /> Back to Food Items
          </button>

          {/* Edit Form Card */}
          <div className="edit-food-card">
            {/* Header */}
            <div className="card-header">
              <div className="header-icon">
                <FaUtensils />
              </div>
              <h2>Edit Food Item</h2>
              <p>Update food item information</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="edit-form">
              <div className="form-grid">
                {/* Left Column */}
                <div className="form-column">
                  {/* Category */}
                  <div className="form-group">
                    <label>
                      Category <span className="required">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="form-select"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.category_name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Item Name */}
                  <div className="form-group">
                    <label>
                      Item Name <span className="required">*</span>
                    </label>
                    <input
                      type="text"
                      name="item_name"
                      value={formData.item_name}
                      onChange={handleChange}
                      placeholder="Enter item name"
                      className="form-input"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div className="form-group">
                    <label>Description</label>
                    <textarea
                      name="item_description"
                      value={formData.item_description}
                      onChange={handleChange}
                      placeholder="Enter item description"
                      className="form-textarea"
                      rows="4"
                    />
                  </div>

                  {/* Price and Quantity Row */}
                  <div className="form-row">
                    <div className="form-group">
                      <label>
                        Price (৳) <span className="required">*</span>
                      </label>
                      <input
                        type="number"
                        name="item_price"
                        value={formData.item_price}
                        onChange={handleChange}
                        placeholder="0.00"
                        className="form-input"
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>
                        Quantity <span className="required">*</span>
                      </label>
                      <input
                        type="text"
                        name="item_quantity"
                        value={formData.item_quantity}
                        onChange={handleChange}
                        placeholder="e.g., 1 piece"
                        className="form-input"
                        required
                      />
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="form-group">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        name="is_available"
                        checked={formData.is_available}
                        onChange={handleChange}
                        className="form-checkbox"
                      />
                      <span className="checkbox-text">Available for order</span>
                    </label>
                  </div>
                </div>

                {/* Right Column - Image Upload */}
                <div className="form-column">
                  <div className="form-group">
                    <label>Food Image</label>

                    {/* ✅ Current Image with error fallback */}
                    {currentImage && !imagePreview && (
                      <div className="image-preview-box">
                        <img
                          src={currentImage}
                          alt="Current"
                          className="preview-image"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/200x150?text=No+Image';
                          }}
                        />
                        <div className="image-label">Current Image</div>
                      </div>
                    )}

                    {/* New Image Preview */}
                    {imagePreview && (
                      <div className="image-preview-box">
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="preview-image"
                        />
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={handleRemoveNewImage}
                        >
                          <FaTrash /> Remove
                        </button>
                        <div className="image-label">New Image</div>
                      </div>
                    )}

                    {/* Upload Button */}
                    <div className="upload-box">
                      <input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="file-input"
                      />
                      <label htmlFor="imageUpload" className="upload-label">
                        <FaImage />
                        <span>
                          {imagePreview ? 'Change Image' : 'Upload New Image'}
                        </span>
                      </label>
                      <p className="upload-hint">
                        Supported: JPG, PNG, GIF (Max 5MB)
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Change Warning */}
              {hasChanges && (
                <div className="change-warning">
                  <span className="badge-warning">⚠️ You have unsaved changes</span>
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
                  disabled={saving || !hasChanges}
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
        </div>
      </div>
    </AdminLayout>
  );
};

export default EditFood;