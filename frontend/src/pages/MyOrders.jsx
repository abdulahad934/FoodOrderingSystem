import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaBox, FaCheckCircle, FaTruck, FaClock, FaReceipt, FaEye, FaTimes, FaTrash } from 'react-icons/fa';
import '../style/myorders.css';

const MyOrders = () => {
  const userId = localStorage.getItem('userId');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [userId, navigate]);

  const fetchOrders = () => {
    setLoading(true);
    fetch(`http://127.0.0.1:1000/api/orders/${userId}`)
      .then(res => res.json())
      .then(data => {
        console.log('Orders data:', data);
        setOrders(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.error('Error:', error);
        toast.error('Failed to load orders');
      })
      .finally(() => setLoading(false));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <FaClock className="status-icon pending" />;
      case 'processing':
        return <FaBox className="status-icon processing" />;
      case 'delivered':
        return <FaCheckCircle className="status-icon delivered" />;
      case 'cancelled':
        return <FaTimes className="status-icon cancelled" />;
      default:
        return <FaTruck className="status-icon" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Order Placed';
      case 'processing':
        return 'Preparing';
      case 'shipped':
        return 'On the way';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Processing';
    }
  };

  const handleCancelOrder = async (orderNumber) => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:1000/api/orders/cancel/${orderNumber}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Order cancelled successfully');
        fetchOrders(); // Refresh orders
      } else {
        toast.error(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error cancelling order');
    }
  };

  const handleDeleteOrder = async (orderNumber) => {
    if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:1000/api/orders/delete/${orderNumber}/`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Order deleted successfully');
        fetchOrders(); // Refresh orders
      } else {
        toast.error(data.message || 'Failed to delete order');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error deleting order');
    }
  };

  const handleReorder = (order) => {
    toast.info('Reorder feature coming soon!');
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="orders-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      
      <div className="myorders-page">
        <div className="container py-5">
          {/* Header */}
          <div className="orders-header">
            <div className="header-content">
              <FaReceipt className="header-icon" />
              <h1 className="orders-title">My Orders</h1>
            </div>
            <p className="orders-subtitle">Track and manage your orders</p>
          </div>

          {orders.length === 0 ? (
            <div className="empty-orders">
              <div className="empty-icon">📦</div>
              <h3>No orders yet</h3>
              <p>Looks like you haven't placed any orders</p>
              <button className="browse-btn" onClick={() => navigate('/menu')}>
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="orders-list">
              {orders.map((order) => (
                <div className="order-card" key={order.id}>
                  {/* Order Header */}
                  <div className="order-header">
                    <div className="order-info">
                      <h4 className="order-number">Order #{order.order_number}</h4>
                      <p className="order-date">
                        {new Date(order.created_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="order-status">
                      {getStatusIcon(order.status)}
                      <span className={`status-text ${order.status}`}>
                        {getStatusText(order.status)}
                      </span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="order-items">
                    {order.items && order.items.map((item, idx) => (
                      <div className="order-item" key={idx}>
                        <img
                          src={`http://127.0.0.1:1000${item.food.image}`}
                          alt={item.food.item_name}
                          className="item-image"
                          onError={(e) => e.target.src = '/placeholder-food.jpg'}
                        />
                        <div className="item-details">
                          <h6 className="item-name">{item.food.item_name}</h6>
                          <p className="item-quantity">Quantity: {item.quantity}</p>
                          <p className="item-unit-price">৳{item.food.item_price} each</p>
                        </div>
                        <div className="item-price">
                          ৳{(item.food.item_price * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer */}
                  <div className="order-footer">
                    <div className="order-details">
                      <div className="order-total">
                        <span>Total Amount:</span>
                        <strong>৳{order.total_amount?.toFixed(2) || '0.00'}</strong>
                      </div>
                      <div className="order-payment">
                        <span>Payment: </span>
                        <span className="payment-mode">
                          {order.payment_mode === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                        </span>
                      </div>
                    </div>
                    <div className="order-actions">
                      <button 
                        className="btn-track"
                        onClick={() => navigate(`/track-order/${order.order_number}`)}
                        title="Track Order"
                      >
                        <FaTruck /> Track
                      </button>
                      <button 
                        className="btn-details"
                        onClick={() => navigate(`/order-details/${order.order_number}`)}
                        title="View Details"
                      >
                        <FaEye /> Details
                      </button>
                      
                      {/* Cancel button - only for pending/processing orders */}
                      {(order.status === 'pending' || order.status === 'processing') && (
                        <button 
                          className="btn-cancel"
                          onClick={() => handleCancelOrder(order.order_number)}
                          title="Cancel Order"
                        >
                          <FaTimes /> Cancel
                        </button>
                      )}

                      {/* Delete button - only for cancelled/delivered orders */}
                      {(order.status === 'cancelled' || order.status === 'delivered') && (
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteOrder(order.order_number)}
                          title="Delete Order"
                        >
                          <FaTrash /> Delete
                        </button>
                      )}

                      {/* Reorder button - only for delivered */}
                      {order.status === 'delivered' && (
                        <button 
                          className="btn-reorder"
                          onClick={() => handleReorder(order)}
                        >
                          Order Again
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </PublicLayout>
  );
};

export default MyOrders;