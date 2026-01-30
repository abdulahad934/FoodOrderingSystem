import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { CSVLink } from 'react-csv';
import { Link } from 'react-router-dom';
import '../style/managefood.css';

const ManageFood = () => {
  const [foods, setFoods] = useState([]);
  const [allfoods, setAllfoods] = useState([]);

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
                          <Link className="btn btn-sm btn-outline-primary">
                            <i className="fas fa-edit me-1"></i> Edit
                          </Link>
                          <button className="btn btn-sm btn-outline-danger">
                            <i className="fas fa-trash me-1"></i> Delete
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
    </AdminLayout>
  );
};

export default ManageFood;
