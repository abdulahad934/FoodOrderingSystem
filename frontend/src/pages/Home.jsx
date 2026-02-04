import React, {useState, useEffect} from 'react';
import PublicLayout from '../components/PublicLayout';
import '../style/home.css';
import { Link } from 'react-router-dom';

const Home = () => {
  const [foods, setFoods] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
 

 
  
  useEffect(()=> {
    fetch('http://127.0.0.1:1000/api/random_foods')
    .then(res => res.json())
    .then(data => {
      setFoods(data);
      setIsLoading(false);
    })
    .catch(err => {
      console.error('Error fetching foods:', err);
      setIsLoading(false);
    });
  }, []);

  return (
    <PublicLayout>
      <section className="hero">
        <div className="container-fluid h-100">
          <div className="row h-100 g-0">
            
            {/* Left Column - Image Slider */}
            <div className="col-lg-6 col-md-12 p-0">
              <div className="slider-container">
                <div id="bgCarousel" className="carousel slide carousel-fade h-100" data-bs-ride="carousel" data-bs-interval="5000">
                  
                  {/* Custom Navigation Arrows */}
                  <button className="carousel-control-prev custom-carousel-control" type="button" data-bs-target="#bgCarousel" data-bs-slide="prev">
                    <span className="carousel-control-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                      </svg>
                    </span>
                  </button>
                  <button className="carousel-control-next custom-carousel-control" type="button" data-bs-target="#bgCarousel" data-bs-slide="next">
                    <span className="carousel-control-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
                      </svg>
                    </span>
                  </button>

                  {/* Slider Items */}
                  <div className="carousel-inner h-100">
                    <div className="carousel-item active h-100">
                      <img src="/img/123.jpg" className="d-block w-100 h-100 object-fit-cover" alt="Delicious Food 1" />
                      <div className="carousel-overlay"></div>
                      <div className="carousel-caption-custom">
                        <span className="slide-badge">Popular Choice</span>
                        <h3 className="slide-title">Fresh & Delicious</h3>
                        <p className="slide-desc">Premium quality food delivered fresh</p>
                      </div>
                    </div>
                    <div className="carousel-item h-100">
                      <img src="/img/5.jpg" className="d-block w-100 h-100 object-fit-cover" alt="Delicious Food 2" />
                      <div className="carousel-overlay"></div>
                      <div className="carousel-caption-custom">
                        <span className="slide-badge">Chef's Special</span>
                        <h3 className="slide-title">Authentic Flavors</h3>
                        <p className="slide-desc">Experience the taste of excellence</p>
                      </div>
                    </div>
                    <div className="carousel-item h-100">
                      <img src="/img/1.jpg" className="d-block w-100 h-100 object-fit-cover" alt="Delicious Food 3" />
                      <div className="carousel-overlay"></div>
                      <div className="carousel-caption-custom">
                        <span className="slide-badge">Hot Deal</span>
                        <h3 className="slide-title">Quick Delivery</h3>
                        <p className="slide-desc">Fast & reliable service guaranteed</p>
                      </div>
                    </div>
                  </div>

                  {/* Modern Indicators */}
                  <div className="carousel-indicators custom-indicators">
                    <button type="button" data-bs-target="#bgCarousel" data-bs-slide-to="0" className="active" aria-current="true"></button>
                    <button type="button" data-bs-target="#bgCarousel" data-bs-slide-to="1"></button>
                    <button type="button" data-bs-target="#bgCarousel" data-bs-slide-to="2"></button>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="slider-decoration">
                  <div className="decoration-circle decoration-1"></div>
                  <div className="decoration-circle decoration-2"></div>
                  <div className="decoration-circle decoration-3"></div>
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="col-lg-6 col-md-12 d-flex align-items-center">
              <div className="hero-content-wrapper w-100 px-5 py-5">
                <div className="hero-content">
                  {/* Badge */}
                  <div className="hero-badge mb-3">
                    <span className="badge-icon">🔥</span>
                    <span className="badge-text">Fast Delivery </span>
                  </div>

                  {/* Main Heading */}
                  <h1 className="hero-title mb-4">
                    Quick & Hot Food,<br />
                    <span className="text-highlight">Delivered to You</span>
                  </h1>

                  {/* Subheading */}
                  <p className="hero-subtitle mb-4">
                    Craving something tasty? Let's get it to your door in minutes!
                  </p>

                  {/* Search Form */}
                  <form method="GET" action="/search" name='q' className="hero-search-form mb-4">
                    <div className="search-wrapper">
                      <div className="search-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
                        </svg>
                      </div>
                      <input 
                        type="text" 
                        name="q" 
                        placeholder="Search for dishes, restaurants..."  
                        className="form-control search-input"
                        required
                      />
                      <button type="submit" className="btn btn-search">
                        <span>Search</span>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"/>
                        </svg>
                      </button>
                    </div>
                  </form>

                  {/* Features */}
                  <div className="hero-features">
                    <div className="feature-item">
                      <div className="feature-icon">⚡</div>
                      <div className="feature-text">
                        <h6 className="mb-0">Fast Delivery</h6>
                        <small className="text-muted">Within 30 minutes</small>
                      </div>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">🍔</div>
                      <div className="feature-text">
                        <h6 className="mb-0">Fresh Food</h6>
                        <small className="text-muted">Quality guaranteed</small>
                      </div>
                    </div>
                    <div className="feature-item">
                      <div className="feature-icon">💳</div>
                      <div className="feature-text">
                        <h6 className="mb-0">Easy Payment</h6>
                        <small className="text-muted">Multiple options</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      <section className='food-section py-5'>
        <div className='container'>
          <div className="section-header text-center mb-5">
            <h2 className='section-title'>
              Most Loved Dishes This Month
            </h2>
            <span className='section-badge'>Top Picks</span>
            <p className="section-subtitle">Handpicked favorites that keep our customers coming back</p>
          </div>
          
          {isLoading ? (
            <div className="loading-container">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row mt-4 g-4">
              {foods.length === 0 ? (
                <div className="col-12">
                  <div className="no-foods-message">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z"/>
                    </svg>
                    <p className="mt-3">No Foods Found</p>
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

export default Home;