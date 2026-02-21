import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaBox, 
  FaEye, 
  FaUser,
  FaMapMarkerAlt,
  FaMoneyBillWave
} from 'react-icons/fa';
import '../style/ordersnotconfirmed.css';

const OrdersNotConfirmed = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const adminUser = localStorage.getItem('adminUser');
  const navigate = useNavigate();

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin-login');
      return;
    }
    fetchOrders();
  }, [adminUser, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:1000/api/orders-not-confirmed/');
      const data = await response.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
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

  if (loading) {
    return (
      <AdminLayout>
        <div className="orders-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading orders...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="orders-not-confirmed-page">

        {/* Header */}
        <div className="orders-header">
          <div className="header-left">
            <FaBox className="header-icon" />
            <div>
              <h1>Pending Orders</h1>
              <p>Manage unconfirmed customer orders</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card">
              <span className="stat-number">{orders.length}</span>
              <span className="stat-label">Total Pending</span>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="empty-orders">
            <FaBox className="empty-icon" />
            <h3>No pending orders</h3>
            <p>All orders have been processed</p>
          </div>
        ) : (
          <div className="orders-grid">
            {orders.map((order) => (
              <div key={order.id} className="order-card">

                {/* Card Header */}
                <div className="order-card-header">
                  <div className="order-id">
                    <FaBox /> Order #{order.order_number}
                  </div>
                </div>

                {/* Customer Info */}
                <div className="order-section">
                  <h4><FaUser /> Customer Information</h4>
                  <div className="info-row">
                    <span className="label">Name:</span>
                    <span className="value">{order.customer_name || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Email:</span>
                    <span className="value">{order.customer_email || 'N/A'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Phone:</span>
                    <span className="value">{order.customer_phone || 'N/A'}</span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="order-section">
                  <h4><FaMapMarkerAlt /> Order Details</h4>
                  <div className="info-row">
                    <span className="label">Order Date:</span>
                    <span className="value">{formatDate(order.created_at)}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Items:</span>
                    <span className="value">{order.item_count || 0} items</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Total Amount:</span>
                    <span className="value total-amount">৳{order.total_amount?.toFixed(2) || '0.00'}</span>
                  </div>
                  <div className="info-row">
                    <span className="label">Payment:</span>
                    <span className="value">
                      <FaMoneyBillWave /> {order.payment_mode === 'cod' ? 'Cash on Delivery' : 'Online'}
                    </span>
                  </div>
                </div>

                {/* Address */}
                <div className="order-section">
                  <h4><FaMapMarkerAlt /> Delivery Address</h4>
                  <p className="address-text">{order.address || 'No address provided'}</p>
                </div>

                {/* Actions */}
                <div className="order-actions">
                  <Link
                    to={`/view-food-order/${order.order_number}`}
                    className="action-btn view-btn"
                  >
                    <FaEye /> View Details
                  </Link>
                </div>

              </div>
            ))}
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default OrdersNotConfirmed;