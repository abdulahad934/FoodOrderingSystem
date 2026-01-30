import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../components/AdminLayout';

const AddFood = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [formData, setFormData] = useState({
    category: '',
    item_name: '',
    item_price: '',
    item_description: '',
    image: null,
    item_quantity: '',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://127.0.0.1:1000/api/categories/');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load categories');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 20 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      setFormData((prev) => ({
        ...prev,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    if (!formData.category) {
      toast.error('Please select a category');
      return false;
    }
    if (!formData.item_name.trim()) {
      toast.error('Please enter item name');
      return false;
    }
    if (!formData.item_price || formData.item_price <= 0) {
      toast.error('Please enter a valid price');
      return false;
    }
    if (!formData.item_description.trim()) {
      toast.error('Please enter item description');
      return false;
    }
    if (!formData.item_quantity.trim()) {
      toast.error('Please enter item quantity');
      return false;
    }
    if (!formData.image) {
      toast.error('Please select an image');
      return false;
    }
    return true;
  };

  const resetForm = () => {
    setFormData({
      category: '',
      item_name: '',
      item_price: '',
      item_description: '',
      image: null,
      item_quantity: '',
    });
    setImagePreview(null);
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('category', formData.category);
      formDataToSend.append('item_name', formData.item_name);
      formDataToSend.append('item_description', formData.item_description);
      formDataToSend.append('item_price', formData.item_price);
      formDataToSend.append('item_quantity', formData.item_quantity);
      formDataToSend.append('image', formData.image);

      const response = await fetch('http://127.0.0.1:1000/api/add-food-item/', {
        method: 'POST',
        body: formDataToSend,
      });

      const data = await response.json();

      if (response.ok || response.status === 201) {
        toast.success(data.message || 'Food item added successfully!');
        resetForm();
      } else {
        toast.error(data.message || 'Failed to add food item');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error connecting to server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <h4 className="mb-4 text-primary fw-bold">
                <i className="fas fa-plus-circle me-2"></i> Add Food Item
              </h4>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Food Category <span className="text-danger">*</span>
                  </label>
                  <select
                    name="category"
                    className="form-select"
                    value={formData.category}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select a category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.category_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Food Item Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    name="item_name"
                    className="form-control"
                    value={formData.item_name}
                    onChange={handleChange}
                    placeholder="Enter food item name"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    name="item_description"
                    className="form-control"
                    value={formData.item_description}
                    onChange={handleChange}
                    placeholder="Enter description"
                    rows="3"
                    required
                    disabled={loading}
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Price (TK) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      name="item_price"
                      className="form-control"
                      value={formData.item_price}
                      onChange={handleChange}
                      placeholder="Enter price"
                      required
                      disabled={loading}
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold">
                      Item Quantity <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      name="item_quantity"
                      className="form-control"
                      value={formData.item_quantity}
                      onChange={handleChange}
                      placeholder="e.g., 250g, 1 piece"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Image <span className="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    name="image"
                    className="form-control"
                    onChange={handleFileChange}
                    required
                    disabled={loading}
                  />
                  <small className="text-muted">Max file size: 5MB</small>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 mt-3 d-flex align-items-center justify-content-center"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Adding...
                    </>
                  ) : (
                    <>
                      <i className="fa fa-plus me-2"></i> Add Food Item
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-body d-flex flex-column justify-content-center align-items-center">
              <h5 className="fw-bold mb-3 text-secondary">Image Preview</h5>
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="img-fluid rounded shadow"
                  style={{ maxHeight: '300px', objectFit: 'cover' }}
                />
              ) : (
                <i
                  className="fas fa-utensils"
                  style={{ fontSize: '150px', color: '#e5e5e5' }}
                ></i>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer position="top-center" autoClose={3000} />
    </AdminLayout>
  );
};

export default AddFood;