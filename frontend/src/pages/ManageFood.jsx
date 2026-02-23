import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import '../style/managefood.css';

const ManageFood = () => {
  const [foods, setFoods] = useState([]);
  const [allfoods, setAllfoods] = useState([]);
  const [foodToDelete, setFoodToDelete] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetch('http://127.0.0.1:1000/api/foods/')
      .then((res) => res.json())
      .then((data) => {
        setFoods(data);
        setAllfoods(data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSearch = (s) => {
    const keyword = s.toLowerCase();
    if (!keyword) {
      setFoods(allfoods);
    } else {
      const filtered = allfoods.filter((c) =>
        c.item_name.toLowerCase().includes(keyword)
      );
      setFoods(filtered);
    }
  };

  const openDeleteModal = (food) => {
    setFoodToDelete(food);
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setFoodToDelete(null);
    setShowModal(false);
  };

  const handleDelete = async () => {
    if (!foodToDelete) return;

    const foodId = foodToDelete.id;
    const foodName = foodToDelete.item_name;

    setDeletingId(foodId);
    closeDeleteModal();

    try {
      const response = await fetch(
  `http://127.0.0.1:1000/api/food/delete/${foodId}/`,
  { method: 'DELETE' }
);

      if (response.ok) {
        setFoods((prev) => prev.filter((f) => f.id !== foodId));
        setAllfoods((prev) => prev.filter((f) => f.id !== foodId));
        toast.success(`"${foodName}" deleted successfully!`, {
          position: 'top-center',
          autoClose: 3000,
        });
      } else {
        const data = await response.json();
        toast.error(data.message || 'Failed to delete food item', {
          position: 'top-center',
        });
      }
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Error deleting food item. Please try again.', {
        position: 'top-center',
      });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <AdminLayout>
      <div className="card shadow-lg border-0 rounded-3">
        {/* Header */}
        <div className="card-header bg-gradient bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0 fw-bold">
            <i className="fas fa-list-alt me-2"></i> Manage Food Items
          </h4>
          <span className="badge bg-light text-dark fs-6">
            Total: {foods.length}
          </span>
        </div>

        <div className="card-body">
          {/* Search + Export */}
          <div className="mb-4 d-flex justify-content-between align-items-center flex-wrap gap-2">
            <div className="input-group" style={{ maxWidth: '300px' }}>
              <span className="input-group-text bg-primary text-white">
                <i className="fas fa-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="Search food item..."
              />
            </div>

            <CSVLink
              data={foods}
              className="btn btn-success shadow-sm"
              filename="food_list.csv"
            >
              <i className="fas fa-file-csv me-2"></i> Export CSV
            </CSVLink>
          </div>

          {/* Table */}
          <div className="table-responsive">
            <table className="table table-hover table-striped shadow-sm rounded">
              <thead className="table-primary">
                <tr>
                  <th>S.No</th>
                  <th>Category Name</th>
                  <th>Food Item Name</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {foods.length > 0 ? (
                  foods.map((food, index) => (
                    <tr key={food.id || index}>
                      <td>{index + 1}</td>
                      <td className="fw-semibold">{food.category_name}</td>
                      <td>{food.item_name}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Link
                            to={`/edit-food/${food.id}`}
                            className="btn btn-sm btn-outline-primary"
                          >
                            <i className="fas fa-edit me-1"></i> Edit
                          </Link>
                          <button
                            onClick={() => openDeleteModal(food)}
                            disabled={deletingId === food.id}
                            className="btn btn-sm btn-outline-danger"
                          >
                            {deletingId === food.id ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-1"></span>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-trash me-1"></i> Delete
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
                      No food items found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-3 shadow">
              <div className="modal-header bg-danger text-white">
                <h5 className="modal-title">
                  <i className="fas fa-exclamation-triangle me-2"></i>
                  Delete Confirmation
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={closeDeleteModal}
                ></button>
              </div>
              <div className="modal-body text-center py-4">
                <p className="fs-5">
                  Are you sure you want to delete{' '}
                  <strong>"{foodToDelete?.item_name}"</strong>?
                </p>
                <p className="text-muted small">This action cannot be undone.</p>
              </div>
              <div className="modal-footer justify-content-center">
                <button
                  className="btn btn-secondary px-4"
                  onClick={closeDeleteModal}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-danger px-4"
                  onClick={handleDelete}
                >
                  <i className="fas fa-trash me-1"></i> Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ManageFood;