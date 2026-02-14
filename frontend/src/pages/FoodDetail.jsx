import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import PublicLayout from '../components/PublicLayout';
import '../style/food-detail.css';

const FoodDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [food, setFood] = useState(null); // ✅ FIXED: null instead of []
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState('medium');
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    fetchFoodDetail();
  }, [id]);

  const fetchFoodDetail = async () => {
    try {
      const res = await fetch(`http://127.0.0.1:1000/api/foods/${id}/`);
      const data = await res.json();
      setFood(data);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load food details');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (type) => {
    if (type === 'increase') {
      setQuantity(prev => prev + 1);
    } else if (type === 'decrease' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleAddToCart = async() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Please login to add items to cart');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    try{
        const response = await fetch('http://127.0.0.1:1000/api/cart/add/',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                userId: userId,
                foodId: food.id
            })
        });
        const data = await response.json();
        if(response.status === 200){
            toast.success(data.message || "Item added to cart");
            setTimeout(() => {
                navigate('/cart');
            }, 2000);
        }
        else {
            toast.error(data.message || "Something went wrong");
        }
    }
    catch(error) {
        console.error(error);
        toast.error("Error connecting to server")
    }
  };

  const handleAddToWishlist = () => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      toast.error('Please login to add to wishlist');
      setTimeout(() => navigate('/login'), 1500);
      return;
    }

    // Add to wishlist logic here
    toast.success('Added to wishlist!');
  };

  // ✅ FIXED: Check if food exists before calculating sizes
  const sizes = food ? [
    { value: 'small', label: 'Small', price: food.item_price * 0.8 },
    { value: 'medium', label: 'Medium', price: food.item_price },
    { value: 'large', label: 'Large', price: food.item_price * 1.2 }
  ] : [];

  if (loading) {
    return (
      <PublicLayout>
        <div className="loading-container">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PublicLayout>
    );
  }

  if (!food) {
    return (
      <PublicLayout>
        <div className="error-container">
          <h2>Food not found</h2>
          <button onClick={() => navigate('/')} className="btn-back">
            Go Back Home
          </button>
        </div>
      </PublicLayout>
    );
  }

  const currentPrice = sizes.find(s => s.value === selectedSize)?.price || food.item_price || 0;
  const totalPrice = (Number(currentPrice) * quantity).toFixed(2);

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      
      <div className="food-detail-page">
        <div className="container py-5">
          {/* Breadcrumb */}
          <nav className="breadcrumb-nav">
            <a href="/">Home</a>
            <span>/</span>
            <a href="/menu">Menu</a>
            <span>/</span>
            <span className="current">{food.item_name}</span>
          </nav>

          <div className="row g-4">
            {/* Left - Image Section */}
            <div className="col-lg-6">
              <div className="image-section">
                <div className="main-image">
                  <img
                    src={`http://127.0.0.1:1000/${food.image}`}
                    alt={food.item_name}
                    className="img-fluid"
                  />
                  {!food.is_available && (
                    <div className="out-of-stock-badge">Out of Stock</div>
                  )}
                  {food.is_featured && (
                    <div className="featured-badge">⭐ Featured</div>
                  )}
                </div>
                
                {/* Additional Info Cards */}
                <div className="info-cards">
                  <div className="info-card">
                    <div className="info-icon">🚚</div>
                    <div className="info-text">
                      <h6>Fast Delivery</h6>
                      <small>Within 30 minutes</small>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-icon">🔥</div>
                    <div className="info-text">
                      <h6>Fresh & Hot</h6>
                      <small>Quality guaranteed</small>
                    </div>
                  </div>
                  <div className="info-card">
                    <div className="info-icon">💯</div>
                    <div className="info-text">
                      <h6>100% Safe</h6>
                      <small>Hygiene maintained</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right - Details Section */}
            <div className="col-lg-6">
              <div className="details-section">
                {/* Header */}
                <div className="detail-header">
                  <div className="category-badge">{food.category_name}</div>
                  <h1 className="food-title">{food.item_name}</h1>
                  
                  <p><strong>Category:</strong> {food.category_name} </p>
                  
                  <div className="rating-section">
                    <div className="stars">
                      {'★'.repeat(5)}
                    </div>
                    <span className="rating-text">4.8 (124 reviews)</span>
                  </div>

                  <div className="price-section">
                    <span className="current-price">৳{Number(currentPrice).toFixed(2)}</span>
                    {selectedSize !== 'medium' && (
                      <span className="original-price">৳{Number(food.item_price).toFixed(2)}</span>
                    )}
                  </div>
                </div>

                {/* Size Selection */}
                <div className="size-selection">
                  <h6 className="section-title">Select Size</h6>
                  <div className="size-options">
                    {sizes.map((size) => (
                      <button
                        key={size.value}
                        className={`size-btn ${selectedSize === size.value ? 'active' : ''}`}
                        onClick={() => setSelectedSize(size.value)}
                      >
                        <span className="size-label">{size.label}</span>
                        <span className="size-price">৳{Number(size.price).toFixed(2)}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity Selection */}
                <div className="quantity-selection">
                  <h6 className="section-title">Quantity</h6>
                  <div className="quantity-controls">
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange('decrease')}
                      disabled={quantity === 1}
                    >
                      −
                    </button>
                    <span className="qty-value">{quantity}</span>
                    <button
                      className="qty-btn"
                      onClick={() => handleQuantityChange('increase')}
                    >
                      +
                    </button>
                  </div>
                  <div className="total-price">
                    Total: <strong>৳{totalPrice}</strong>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="action-buttons">
                  <button
                    className="btn-add-cart"
                    onClick={handleAddToCart}
                    disabled={!food.is_available}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2zm7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
                    </svg>
                    <span>{food.is_available ? 'Add to Cart' : 'Out of Stock'}</span>
                  </button>
                  <button
                    className="btn-wishlist"
                    onClick={handleAddToWishlist}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="m8 2.748-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
                    </svg>
                  </button>
                </div>

                {/* Tabs */}
                <div className="detail-tabs">
                  <div className="tab-headers">
                    <button
                      className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                      onClick={() => setActiveTab('description')}
                    >
                      Description
                    </button>
                    <button
                      className={`tab-btn ${activeTab === 'ingredients' ? 'active' : ''}`}
                      onClick={() => setActiveTab('ingredients')}
                    >
                      Ingredients
                    </button>
                    <button
                      className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
                      onClick={() => setActiveTab('reviews')}
                    >
                      Reviews (124)
                    </button>
                  </div>

                  <div className="tab-content">
                    {activeTab === 'description' && (
                      <div className="tab-pane">
                        <p>{food.item_description || 'Delicious and freshly prepared food made with high-quality ingredients. Perfect for any meal of the day!'}</p>
                      </div>
                    )}
                    {activeTab === 'ingredients' && (
                      <div className="tab-pane">
                        <ul className="ingredients-list">
                          <li>Fresh vegetables</li>
                          <li>Premium quality meat</li>
                          <li>Authentic spices</li>
                          <li>Natural herbs</li>
                          <li>No artificial preservatives</li>
                        </ul>
                      </div>
                    )}
                    {activeTab === 'reviews' && (
                      <div className="tab-pane">
                        <div className="review-item">
                          <div className="review-header">
                            <strong>John Doe</strong>
                            <span className="review-stars">★★★★★</span>
                          </div>
                          <p>Amazing taste! Highly recommended.</p>
                          <small className="review-date">2 days ago</small>
                        </div>
                        <div className="review-item">
                          <div className="review-header">
                            <strong>Jane Smith</strong>
                            <span className="review-stars">★★★★★</span>
                          </div>
                          <p>Fresh and delicious. Will order again!</p>
                          <small className="review-date">1 week ago</small>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default FoodDetail;