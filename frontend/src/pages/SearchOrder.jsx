import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../components/AdminLayout';
import {
  FaSearch,
  FaBox,
  FaUser,
  FaCalendar,
  FaMapMarkerAlt,
  FaEye,
  FaPhone,
  FaEnvelope,
  FaCreditCard,
  FaTimesCircle
} from 'react-icons/fa';
import '../style/searchorder.css';

const SearchOrder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const navigate = useNavigate();

  const handleSearch = async (e) => {
  e.preventDefault();

  if (!searchQuery.trim()) {
    toast.error('Please enter order number or customer name');
    return;
  }

  setLoading(true);
  setHasSearched(true);

  try {
    const url = `http://127.0.0.1:1000/api/search-orders/?query=${encodeURIComponent(searchQuery)}`;
    console.log('🔍 Searching:', url);  // ✅ Debug
    
    const response = await fetch(url);
    const data = await response.json();
    
    console.log('📦 Response status:', response.status);  // ✅ Debug
    console.log('📦 Response data:', data);  // ✅ Debug

    if (response.ok) {
      setSearchResults(Array.isArray(data) ? data : []);
      if (data.length === 0) {
        toast.info('No orders found');
      } else {
        toast.success(`Found ${data.length} order(s)`);
      }
    } else {
      console.error('❌ Error response:', data);
      toast.error('Failed to search orders');
      setSearchResults([]);
    }
  } catch (error) {
    console.error('❌ Fetch error:', error);
    toast.error('Error searching orders');
    setSearchResults([]);
  } finally {
    setLoading(false);
  }
};

  const handleClearSearch = () => {
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return '#ffa500';
      case 'processing':
        return '#3498db';
      case 'shipped':
        return '#9b59b6';
      case 'delivered':
        return '#27ae60';
      case 'cancelled':
        return '#e74c3c';
      default:
        return '#95a5a6';
    }
  };

  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="search-order-page">
        {/* Header */}
        <div className="search-header">
          <div className="header-content">
            <FaSearch className="header-icon" />
            <div>
              <h1>Search Orders</h1>
              <p>Find orders by order number or customer name</p>
            </div>
          </div>
        </div>

        {/* Search Form */}
        <div className="search-form-card">
          <form onSubmit={handleSearch} className="search-form">
            <div className="search-input-wrapper">
              <FaSearch className="search-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter order number or customer name..."
                className="search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="clear-btn"
                >
                  <FaTimesCircle />
                </button>
              )}
            </div>
            <button type="submit" disabled={loading} className="search-btn">
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2"></span>
                  Searching...
                </>
              ) : (
                <>
                  <FaSearch /> Search
                </>
              )}
            </button>
          </form>

          {/* Search Tips */}
          <div className="search-tips">
            <h4>💡 Search Tips:</h4>
            <ul>
              <li>Enter complete order number (e.g., 123456789)</li>
              <li>Enter customer's first name, last name, or email</li>
              <li>Search is case-insensitive</li>
            </ul>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="search-loading">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Searching...</span>
            </div>
            <p>Searching orders...</p>
          </div>
        )}

        {/* Search Results */}
        {!loading && hasSearched && (
          <div className="search-results">
            {searchResults.length === 0 ? (
              <div className="no-results">
                <FaBox className="no-results-icon" />
                <h3>No Orders Found</h3>
                <p>
                  We couldn't find any orders matching "<strong>{searchQuery}</strong>"
                </p>
                <button onClick={handleClearSearch} className="try-again-btn">
                  Try Another Search
                </button>
              </div>
            ) : (
              <>
                <div className="results-header">
                  <h3>
                    <FaBox /> Found {searchResults.length} Order(s)
                  </h3>
                </div>

                <div className="results-grid">
                  {searchResults.map((order) => (
                    <div key={order.id} className="result-card">
                      {/* Card Header */}
                      <div className="result-card-header">
                        <div className="order-id">
                          <FaBox /> Order #{order.order_number}
                        </div>
                        <span
                          className="status-badge"
                          style={{ background: getStatusColor(order.status) }}
                        >
                          {order.status || 'Processing'}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="result-section">
                        <h4>
                          <FaUser /> Customer
                        </h4>
                        <div className="info-row">
                          <span className="label">Name:</span>
                          <span className="value">{order.customer_name || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">
                            <FaEnvelope /> Email:
                          </span>
                          <span className="value">{order.customer_email || 'N/A'}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">
                            <FaPhone /> Phone:
                          </span>
                          <span className="value">{order.customer_phone || 'N/A'}</span>
                        </div>
                      </div>

                      {/* Order Details */}
                      <div className="result-section">
                        <h4>
                          <FaCalendar /> Order Details
                        </h4>
                        <div className="info-row">
                          <span className="label">Date:</span>
                          <span className="value">{formatDate(order.created_at)}</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Items:</span>
                          <span className="value">{order.item_count || 0} items</span>
                        </div>
                        <div className="info-row">
                          <span className="label">Total:</span>
                          <span className="value total">
                            ৳{order.total_amount?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                        <div className="info-row">
                          <span className="label">
                            <FaCreditCard /> Payment:
                          </span>
                          <span className="value">
                            {order.payment_mode === 'cod'
                              ? 'Cash on Delivery'
                              : 'Online Payment'}
                          </span>
                        </div>
                      </div>

                      {/* Address */}
                      <div className="result-section">
                        <h4>
                          <FaMapMarkerAlt /> Delivery Address
                        </h4>
                        <p className="address-text">
                          {order.address || 'No address provided'}
                        </p>
                      </div>

                      {/* Action Button */}
                      <button
                        className="view-details-btn"
                        onClick={() =>
                          navigate(`/admin/view-order/${order.order_number}`)
                        }
                      >
                        <FaEye /> View Full Details
                      </button>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        )}

        {/* Initial State */}
        {!loading && !hasSearched && (
          <div className="search-placeholder">
            <div className="placeholder-icon">🔍</div>
            <h3>Start Searching</h3>
            <p>Enter an order number or customer name to find orders</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default SearchOrder;