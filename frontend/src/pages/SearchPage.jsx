import React, { useEffect, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link, useLocation } from 'react-router-dom';
import '../style/search.css';

const SearchPage = () => {
  const query = new URLSearchParams(useLocation().search).get('q') || "";
  const [foods, setFoods] = useState([]);

  useEffect(() => {
    if (query) {
      fetch(`http://127.0.0.1:1000/api/food_search/?q=${query}`)
        .then(res => res.json())
        .then(data => {
          setFoods(data);
        });
    }
  }, [query]);

  return (
    <PublicLayout>
      <div className="container py-5">
        <h3 className="text-center text-primary mb-4">
          Results for: <span className="fw-bold">{query}</span>
        </h3>

        <div className="row mt-4">
          {foods.length === 0 ? (
            <p className="text-center text-muted">No Foods Found</p>
          ) : (
            foods.map((food, index) => (
              <div className="col-md-4 mb-4" key={index}>
                <div className="card food-card h-100 shadow-sm">
                  {/* Image + Hover Overlay */}
                  <div className="card-img-wrapper">
                    <img
                      src={`http://127.0.0.1:1000/${food.image}`}
                      className="card-img-top"
                      alt={food.item_name}
                    />
                    <div className="overlay">
                      {food.is_available ? (
                        <Link to="#" className="btn btn-warning btn-sm fw-semibold">
                          <i className="fas fa-shopping-basket me-1"></i> Order Now
                        </Link>
                      ) : (
                        <button className="btn btn-secondary btn-sm fw-semibold" disabled>
                          <i className="fas fa-ban me-1"></i> Unavailable
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to="#" className="text-decoration-none text-dark fw-bold">
                        {food.item_name}
                      </Link>
                    </h5>
                    <p className="card-text text-muted">
                      {food.item_description?.slice(0, 60)}...
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="card-footer d-flex justify-content-between align-items-center">
                    <span className="fw-bold text-primary">TK. {food.item_price}</span>
                    <Link to="#" className="btn btn-outline-primary btn-sm">
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default SearchPage;
