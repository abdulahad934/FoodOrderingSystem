import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Link } from 'react-router-dom';
import '../style/manageCategory.css';
import {CSVLink} from 'react-csv';


const ManageCategory = () => {
  const [categories, setCategories] = useState([]);
  const [allcategories, setAllcategories] = useState([]);

  useEffect(() => {
    fetch('http://127.0.0.1:1000/api/categories/')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setAllcategories(data);
      }) 
      .catch((err) => console.error(err));
  }, []);

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

  return (
    <AdminLayout>
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
                style={{ width: "250px" }}
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
                        <Link className="btn btn-sm btn-primary">
                          <i className="fas fa-edit me-1"></i> Edit
                        </Link>
                        <button className="btn btn-sm btn-danger">
                          <i className="fas fa-trash me-1"></i> Delete
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
    </AdminLayout>
  );
};

export default ManageCategory;
