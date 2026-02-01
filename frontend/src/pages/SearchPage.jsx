import React, { useEffect, useState } from 'react';
import PublicLayout from '../components/PublicLayout';
import { Link, useLocation } from 'react-router-dom';
import '../style/search.css';

const SearchPage = () => {
  const query = new URLSearchParams(useLocation().search).get('q') || "";
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (query) {
      setIsLoading(true);
      fetch(`http://127.0.0.1:1000/api/food_search/?q=${query}`)
        .then(res => res.json())
        .then(data => {
          setFoods(data);
          setIsLoading(false);
        })
        .catch(err => {
          console.error("Error fetching foods:", err);
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [query]);

  return (
    <PublicLayout>
      {/* Search Header Section */}
      <section className="search-header">
        <div className="container">
          <div className="search-header-content">
            <div className="search-icon-wrapper">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" viewBox="0 0 16 16">
                <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
              </svg>
            </div>
            <h1 className="search-title">Search Results</h1>
            <div className="search-query-display">
              <span className="query-label">Showing results for:</span>
              <span className="query-text">"{query}"</span>
            </div>
            {!isLoading && foods.length > 0 && (
              <div className="results-count">
                <span className="count-badge">{foods.length} {foods.length === 1 ? 'item' : 'items'} found</span>
              </div>
            )}
          </div>
        </div>
        
        {/* Decorative Background Elements */}
        <div className="search-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </section>

      {/* Search Results Section */}
      <section className="search-results-section py-5">
        <div className="container">
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="loading-text">Searching for delicious food...</p>
            </div>
          ) : (
            <div className="row g-4">
              {foods.length === 0 ? (
                <div className="col-12">
                  <div className="no-results-container">
                    <div className="no-results-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" viewBox="0 0 16 16">
                        <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                      </svg>
                    </div>
                    <h3 className="no-results-title">No Foods Found</h3>
                    <p className="no-results-text">
                      We couldn't find any dishes matching "<strong>{query}</strong>"
                    </p>
                    <div className="no-results-suggestions">
                      <p>Try:</p>
                      <ul>
                        <li>Checking your spelling</li>
                        <li>Using more general keywords</li>
                        <li>Searching for a different dish</li>
                      </ul>
                    </div>
                    <Link to="/" className="btn btn-back-home">
                      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
                      </svg>
                      <span>Back to Home</span>
                    </Link>
                  </div>
                </div>
              ) : (
                foods.map((food, index) => (
                  <div className="col-lg-4 col-md-6 mb-4" key={index}>
                    <div className="card food-card h-100">
                      {/* Image + Hover Overlay */}
                      <div className="card-img-wrapper">
                        <img
                          src={`http://127.0.0.1:1000/${food.image}`}
                          className="card-img-top"
                          alt={food.item_name}
                          loading="lazy"
                        />
                        <div className="image-overlay">
                          {food.is_available ? (
                            <Link to="#" className="btn btn-order">
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM3.102 4l1.313 7h8.17l1.313-7H3.102zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                              </svg>
                              <span>Order Now</span>
                            </Link>
                          ) : (
                            <button className="btn btn-unavailable" disabled>
                              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                                <path d="M11.354 4.646a.5.5 0 0 0-.708 0l-6 6a.5.5 0 0 0 .708.708l6-6a.5.5 0 0 0 0-.708z"/>
                              </svg>
                              <span>Unavailable</span>
                            </button>
                          )}
                        </div>
                        {!food.is_available && (
                          <div className="availability-badge">Out of Stock</div>
                        )}
                      </div>

                      {/* Card Body */}
                      <div className="card-body">
                        <h5 className="card-title">
                          <Link to="#" className="food-title-link">
                            {food.item_name}
                          </Link>
                        </h5>
                        <p className="card-description">
                          {food.item_description?.slice(0, 80)}{food.item_description?.length > 80 ? '...' : ''}
                        </p>
                      </div>

                      {/* Footer */}
                      <div className="card-footer">
                        <div className="price-section">
                          <span className="price-label">Price</span>
                          <span className="price-value">৳{food.item_price}</span>
                        </div>
                        <Link to="#" className="btn btn-details">
                          View Details
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </section>
    </PublicLayout>
  );
};

export default SearchPage;