import React from 'react';
import PublicLayout from '../components/PublicLayout';
import '../style/home.css';

const Home = () => {
  return (
    <PublicLayout>
      <section className="hero">
        <div className="container-fluid h-100">
          <div className="row h-100 g-0">
            
            {/* Left Column - Image Slider */}
            <div className="col-lg-6 col-md-12 p-0">
              <div className="slider-container">
                <div id="bgCarousel" className="carousel slide carousel-fade h-100" data-bs-ride="carousel" data-bs-interval="4000">
                  
                  {/* Custom Navigation Arrows */}
                  <button className="carousel-control-prev custom-carousel-control" type="button" data-bs-target="#bgCarousel" data-bs-slide="prev">
                    <span className="carousel-control-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
                      </svg>
                    </span>
                  </button>
                  <button className="carousel-control-next custom-carousel-control" type="button" data-bs-target="#bgCarousel" data-bs-slide="next">
                    <span className="carousel-control-icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 16 16">
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
                </div>
              </div>
            </div>

            {/* Right Column - Content */}
            <div className="col-lg-6 col-md-12 d-flex align-items-center">
              <div className="hero-content-wrapper w-100 px-5 py-5">
                <div className="hero-content">
                  {/* Badge */}
                  <div className="hero-badge mb-3">
                    <span className="badge-text">🔥 Fast Delivery</span>
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
                  <form method="GET" action="/search" className="hero-search-form mb-4">
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
                        Search
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
    </PublicLayout>
  );
};

export default Home;