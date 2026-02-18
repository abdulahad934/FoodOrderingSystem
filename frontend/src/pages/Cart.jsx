import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaMinus, FaPlus, FaTrash, FaShoppingBag, FaArrowLeft } from 'react-icons/fa';
import '../style/cart.css';

const Cart = () => {
  const userId = localStorage.getItem('userId');
  const [cartItems, setCartItems] = useState([]);
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchCartItems();
  }, [userId, navigate]);

  const fetchCartItems = () => {
    setLoading(true);
    fetch(`http://127.0.0.1:1000/api/cart/${userId}`)
      .then(res => res.json())
      .then(data => {
        const items = data.cart_items || data || [];
        setCartItems(Array.isArray(items) ? items : []);
        const total = items.reduce(
          (sum, item) => sum + item.food.item_price * item.quantity,
          0
        );
        setGrandTotal(total);
      })
      .catch(() => toast.error("Failed to load cart"))
      .finally(() => setLoading(false));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    fetch(`http://127.0.0.1:1000/api/cart/update/${itemId}/`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: newQuantity })
    })
      .then(res => res.json())
      .then(() => {
        fetchCartItems();
        toast.success('Quantity updated');
      })
      .catch(() => toast.error('Failed to update quantity'));
  };

  const removeItem = (itemId) => {
    fetch(`http://127.0.0.1:1000/api/cart/remove/${itemId}/`, {
      method: 'DELETE'
    })
      .then(res => res.json())
      .then(() => {
        fetchCartItems();
        toast.success('Item removed');
      })
      .catch(() => toast.error('Failed to remove item'));
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="cart-loading">
          <div className="spinner-border text-danger" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      
      <div className="cart-page">
        <div className="container py-5">
          {/* Header */}
          <div className="cart-header">
            <button className="back-btn" onClick={() => navigate('/menu')}>
              <FaArrowLeft /> Continue Shopping
            </button>
            <h1 className="cart-title">
              <FaShoppingBag className="cart-icon" />
              Your Cart
            </h1>
            {cartItems.length > 0 && (
              <span className="cart-badge">{cartItems.length} Items</span>
            )}
          </div>

          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <div className="empty-cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>Looks like you haven't added anything to your cart yet</p>
              <button className="browse-btn" onClick={() => navigate('/menu')}>
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="row g-4">
              {/* Cart Items */}
              <div className="col-lg-8">
                <div className="cart-items-container">
                  {cartItems.map((item) => (
                    <div className="cart-item" key={item.id}>
                      <div className="item-image">
                        <img
                          src={`http://127.0.0.1:1000${item.food.image}`}
                          alt={item.food.item_name}
                          onError={(e) => e.target.src = '/placeholder-food.jpg'}
                        />
                      </div>

                      <div className="item-details">
                        <h5 className="item-name">{item.food.item_name}</h5>
                        <p className="item-description">
                          {item.food.item_description || 'Delicious food item'}
                        </p>
                        <div className="item-price">৳{item.food.item_price}</div>
                      </div>

                      <div className="item-actions">
                        <div className="quantity-controls">
                          <button 
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                          >
                            <FaMinus />
                          </button>
                          <span className="qty-display">{item.quantity}</span>
                          <button 
                            className="qty-btn"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <FaPlus />
                          </button>
                        </div>

                        <div className="item-subtotal">
                          ৳{(item.food.item_price * item.quantity).toFixed(2)}
                        </div>

                        <button 
                          className="remove-btn"
                          onClick={() => removeItem(item.id)}
                          title="Remove item"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="col-lg-4">
                <div className="order-summary">
                  <h4 className="summary-title">Order Summary</h4>
                  
                  <div className="summary-row">
                    <span>Subtotal ({cartItems.length} items)</span>
                    <span>৳{grandTotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="summary-row">
                    <span>Delivery Fee</span>
                    <span className="text-success">৳50.00</span>
                  </div>

                  <div className="summary-row">
                    <span>Tax (5%)</span>
                    <span>৳{(grandTotal * 0.05).toFixed(2)}</span>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-row total-row">
                    <span>Total</span>
                    <span className="total-amount">৳{(grandTotal + 50 + grandTotal * 0.05).toFixed(2)}</span>
                  </div>

                  <button className="checkout-btn" onClick={() => navigate('/payment')}>
                    Proceed to payment
                  </button>

                  <div className="promo-section">
                    <input 
                      type="text" 
                      placeholder="Enter promo code" 
                      className="promo-input"
                    />
                    <button className="apply-btn">Apply</button>
                  </div>

                  <div className="secure-checkout">
                    <span>🔒</span> Secure Checkout
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default Cart;