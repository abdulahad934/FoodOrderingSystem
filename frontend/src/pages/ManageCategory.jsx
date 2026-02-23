import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../style/manageCategory.css';
import { CSVLink } from 'react-csv';
import { FaTrash, FaEdit, FaExclamationTriangle } from 'react-icons/fa';

const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [allcategories, setAllcategories] = useState([]);
  const [deletingId, setDeletingId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch('http://127.0.0.1:1000/api/categories/')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setAllcategories(data);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Failed to load categories');
      });
  };

  const handleSearch = (s) => {
    const keyword = s.toLowerCase();
    if (!keyword) {
      setCategories(allcategories);
    } else {
      const filtered = allcategories.filter((c) =>
        c.category_name.toLowerCase().includes(keyword)
      );
      setCategories(filtered);
    }
  };

  const openDeleteModal = (category) => {
    setCategoryToDelete(category);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setCategoryToDelete(null);
  };

  const handleDelete = async () => {
    if (!categoryToDelete) return;

    const categoryId = categoryToDelete.id;
    const categoryName = categoryToDelete.category_name;

    setDeletingId(categoryId);
    closeDeleteModal();

    try {
      const response = await fetch(
        `http://127.0.0.1:1000/api/category/${categoryId}/`,
        {
          method: 'DELETE',
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Remove from state
        setCategories(categories.filter((cat) => cat.id !== categoryId));
        setAllcategories(allcategories.filter((cat) => cat.id !== categoryId));
        
        toast.success(`Category "${categoryName}" deleted successfully!`, {
          position: 'top-center',
          autoClose: 3000,
        });
      } else {
        toast.error(data.message || 'Failed to delete category', {
          position: 'top-center',
        });
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Error deleting category. Please try again.', {
        position: 'top-center',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <ToastContainer />

      <div className="card shadow-sm border-0">
        <div className="card-body">
          {/* Header */}
          <h3 className="text-center text-primary mb-3 fw-bold">
            <i className="fas fa-list-alt me-2"></i> Manage Food Category
          </h3>
          <h5 className="text-end text-muted mb-4">
            <i className="fas fa-database me-2"></i>
            Total Categories
            <span className="ms-2 badge bg-success">{categories.length}</span>
          </h5>

          {/* Search */}
          <div className="mb-3 d-flex justify-content-between flex-wrap gap-2">
            <div className="d-flex align-items-center">
              <input
                type="text"
                className="form-control"
                style={{ width: '250px' }}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search by category name..."
              />
              <button className="btn btn-outline-primary ms-2">
                <i className="fas fa-search"></i>
              </button>
            </div>

            <CSVLink
              data={categories}
              className="btn btn-success"
              filename="category_list.csv"
            >
              <i className="fas fa-file-csv me-2"></i> Export to CSV
            </CSVLink>
          </div>

          {/* Table */}
          <table className="table table-bordered table-hover table-striped align-middle">
            <thead className="table-dark">
              <tr>
                <th style={{ width: '70px' }}>S.No</th>
                <th>Category Name</th>
                <th>Creation Date</th>
                <th style={{ width: '180px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {categories.length > 0 ? (
                categories.map((cat, index) => (
                  <tr key={cat.id || index}>
                    <td>{index + 1}</td>
                    <td>{cat.category_name}</td>
                    <td>
                      {cat.creation_date
                        ? new Date(cat.creation_date).toLocaleDateString()
                        : 'N/A'}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/edit-category/${cat.id}`}
                          className="btn btn-sm btn-primary"
                        >
                          <FaEdit className="me-1" /> Edit
                        </Link>
                        <button
                          onClick={() => openDeleteModal(cat)}
                          disabled={deletingId === cat.id}
                          className="btn btn-sm btn-danger"
                        >
                          {deletingId === cat.id ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-1"></span>
                              Deleting...
                            </>
                          ) : (
                            <>
                              <FaTrash className="me-1" /> Delete
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center text-muted">
                    No categories found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={closeDeleteModal}>
          <div className="delete-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-icon-container">
              <FaExclamationTriangle className="modal-warning-icon" />
            </div>
            <h3>Delete Category?</h3>
            <p className="modal-message">
              Are you sure you want to delete{' '}
              <strong>"{categoryToDelete?.category_name}"</strong>?
            </p>
            <p className="modal-warning">
              This action cannot be undone. All food items in this category may
              be affected.
            </p>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={closeDeleteModal}>
                Cancel
              </button>
              <button className="btn-delete" onClick={handleDelete}>
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageCategory;