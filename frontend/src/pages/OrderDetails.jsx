import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PublicLayout from '../components/PublicLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  FaBox, 
  FaCheckCircle, 
  FaTruck, 
  FaClock, 
  FaMapMarkerAlt, 
  FaCreditCard,
  FaPhone,
  FaEnvelope,
  FaArrowLeft,
  FaReceipt,
  FaCalendar,
  FaMoneyBillWave
} from 'react-icons/fa';
import '../style/orderdetails.css';

const OrderDetails = () => {
  const userId = localStorage.getItem('userId');
  const [orderItems, setOrderItems] = useState([]);
  const [orderAddress, setOrderAddress] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { order_number } = useParams();

  useEffect(() => {
    if (!userId) {
      navigate('/login');
      return;
    }
    fetchOrderDetails();
  }, [order_number, userId, navigate]);

  const fetchOrderDetails = () => {
    setLoading(true);
    
    // Fetch order items
    fetch(`http://127.0.0.1:1000/api/orders/by_order_number/${order_number}/`)
      .then(res => res.json())
      .then(data => {
        console.log('Order Items:', data);
        setOrderItems(data);
        const totalAmount = data.reduce(
          (sum, item) => sum + item.food.item_price * item.quantity,
          0
        );
        setTotal(totalAmount);
      })
      .catch((err) => {
        console.error('Error loading items:', err);
        toast.error('Failed to load order items');
      });

    // Fetch order address
    fetch(`http://127.0.0.1:1000/api/order-address/${order_number}/`)
      .then(res => res.json())
      .then(data => {
        console.log('Order Address:', data);
        setOrderAddress(data);
      })
      .catch((err) => {
        console.error('Error loading address:', err);
        toast.error('Failed to load address');
      });

    // Fetch payment details
    fetch(`http://127.0.0.1:1000/api/payment-details/${order_number}/`)
      .then(res => res.json())
      .then(data => {
        console.log('Payment Details:', data);
        setPaymentDetails(data);
      })
      .catch((err) => {
        console.error('Error loading payment:', err);
        toast.error('Failed to load payment details');
      })
      .finally(() => setLoading(false));
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:1000/api/invoice/${order_number}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' }
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Order cancelled successfully');
        setTimeout(() => {
          navigate('/my-orders');
        }, 2000);
      } else {
        toast.error(data.message || 'Failed to cancel order');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error cancelling order');
    }
  };

  const handlePrintInvoice = () => {
    window.print();
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
        return '#3498db';
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'Pending';
      case 'processing':
        return 'Processing';
      case 'shipped':
        return 'Shipped';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'Processing';
    }
  };

  const getStatusSteps = () => {
    const steps = [
      { label: 'Order Placed', status: 'pending', icon: <FaReceipt /> },
      { label: 'Processing', status: 'processing', icon: <FaBox /> },
      { label: 'Shipped', status: 'shipped', icon: <FaTruck /> },
      { label: 'Delivered', status: 'delivered', icon: <FaCheckCircle /> }
    ];

    const currentStatus = orderAddress?.order_final_status?.toLowerCase() || 'processing';
    const statusOrder = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = statusOrder.indexOf(currentStatus);

    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      active: index === currentIndex
    }));
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  const getPaymentModeText = (mode) => {
    if (!mode) return 'Cash on Delivery';
    return mode.toLowerCase() === 'cod' ? 'Cash on Delivery' : 'Online Payment';
  };

  const getPaymentModeIcon = (mode) => {
    if (!mode || mode.toLowerCase() === 'cod') {
      return <FaMoneyBillWave />;
    }
    return <FaCreditCard />;
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="order-details-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading order details...</p>
        </div>
      </PublicLayout>
    );
  }

  if (!orderItems || orderItems.length === 0) {
    return (
      <PublicLayout>
        <div className="order-not-found">
          <div className="not-found-icon">📦</div>
          <h3>Order not found</h3>
          <p>We couldn't find the order you're looking for</p>
          <button className="back-to-orders-btn" onClick={() => navigate('/my-orders')}>
            Go to My Orders
          </button>
        </div>
      </PublicLayout>
    );
  }

  const statusSteps = getStatusSteps();
  const currentStatus = orderAddress?.order_final_status || 'processing';

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />
      
      <div className="order-details-page">
        <div className="container py-5">
          {/* Back Button */}
          <button className="back-button" onClick={() => navigate('/my-orders')}>
            <FaArrowLeft /> Back to Orders
          </button>

          {/* Header */}
          <div className="details-header">
            <div className="header-left">
              <h1>Order Details</h1>
              <p className="order-number-text">Order #{order_number}</p>
              <p className="order-date-text">
                <FaCalendar /> Placed on {formatDate(orderAddress?.order_time)}
              </p>
            </div>
            <div className="header-right">
              <div className="order-status-badge" style={{ background: getStatusColor(currentStatus) }}>
                {getStatusText(currentStatus)}
              </div>
            </div>
          </div>

          {/* Order Tracking Timeline */}
          <div className="tracking-timeline">
            <h3>Order Status</h3>
            <div className="timeline-container">
              {statusSteps.map((step, index) => (
                <div key={index} className={`timeline-step ${step.completed ? 'completed' : ''} ${step.active ? 'active' : ''}`}>
                  <div className="timeline-icon">{step.icon}</div>
                  <div className="timeline-label">{step.label}</div>
                  {index < statusSteps.length - 1 && (
                    <div className={`timeline-line ${step.completed ? 'completed' : ''}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="details-grid">
            {/* Left Column */}
            <div className="details-left">
              {/* Order Items */}
              <div className="details-card">
                <h3 className="card-title">
                  <FaBox /> Order Items ({orderItems.length} {orderItems.length === 1 ? 'item' : 'items'})
                </h3>
                <div className="order-items-list">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="order-item-detail">
                      <img
                        src={`http://127.0.0.1:1000${item.food.image}`}
                        alt={item.food.item_name}
                        className="item-img"
                        onError={(e) => e.target.src = '/placeholder-food.jpg'}
                      />
                      <div className="item-info">
                        <h5>{item.food.item_name}</h5>
                        <p className="item-desc">{item.food.item_description || 'Delicious food item'}</p>
                        <div className="item-pricing">
                          <span className="item-qty">Qty: {item.quantity}</span>
                          <span className="item-unit">৳{item.food.item_price} each</span>
                        </div>
                      </div>
                      <div className="item-total">
                        ৳{(item.food.item_price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Price Summary */}
                <div className="price-summary">
                  <div className="price-row">
                    <span>Subtotal</span>
                    <span>৳{total.toFixed(2)}</span>
                  </div>
                  <div className="price-row">
                    <span>Delivery Fee</span>
                    <span className="text-success">৳50.00</span>
                  </div>
                  <div className="price-row">
                    <span>Tax (5%)</span>
                    <span>৳{(total * 0.05).toFixed(2)}</span>
                  </div>
                  <div className="price-divider"></div>
                  <div className="price-row total-row">
                    <strong>Total Amount</strong>
                    <strong className="total-amount">৳{(total + 50 + total * 0.05).toFixed(2)}</strong>
                  </div>

                  {/* Action Buttons */}
                  <div className="order-action-buttons">
                    <button 
                      className="btn-invoice"
                      onClick={handlePrintInvoice}
                    >
                      <i className="fas fa-file-invoice me-2"></i> Print Invoice
                    </button>
                    
                    {(currentStatus?.toLowerCase() === 'pending' || currentStatus?.toLowerCase() === 'processing') && (
                      <button 
                        className="btn-cancel-order"
                        onClick={handleCancelOrder}
                      >
                        <i className="fas fa-times-circle me-2"></i> Cancel Order
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="details-right">
              {/* Delivery Address */}
              <div className="details-card">
                <h3 className="card-title">
                  <FaMapMarkerAlt /> Delivery Address
                </h3>
                <div className="address-content">
                  <p>{orderAddress?.address || 'No address provided'}</p>
                </div>
              </div>

              {/* Order Information */}
              <div className="details-card">
                <h3 className="card-title">
                  <FaCalendar /> Order Information
                </h3>
                <div className="info-list">
                  <div className="info-item">
                    <span className="info-label">
                      <FaCalendar /> Order Date:
                    </span>
                    <span className="info-value">
                      {formatDate(orderAddress?.order_time)}
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <FaReceipt /> Order Number:
                    </span>
                    <span className="info-value">#{order_number}</span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      <FaBox /> Order Status:
                    </span>
                    <span className="info-value">
                      <span 
                        className="status-badge-small" 
                        style={{ background: getStatusColor(currentStatus) }}
                      >
                        {getStatusText(currentStatus)}
                      </span>
                    </span>
                  </div>
                  <div className="info-item">
                    <span className="info-label">
                      {getPaymentModeIcon(paymentDetails?.payment_mode)} Payment Method:
                    </span>
                    <span className="info-value payment-badge">
                      {getPaymentModeText(paymentDetails?.payment_mode)}
                    </span>
                  </div>
                  {paymentDetails?.payment_date && (
                    <div className="info-item">
                      <span className="info-label">
                        <FaCalendar /> Payment Date:
                      </span>
                      <span className="info-value">
                        {formatDate(paymentDetails.payment_date)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer Support */}
              <div className="details-card support-card">
                <h3 className="card-title">Need Help?</h3>
                <div className="support-content">
                  <p>Contact our customer support team</p>
                  <div className="support-links">
                    <a href="tel:+8801234567890" className="support-link">
                      <FaPhone /> +880 1234-567890
                    </a>
                    <a href="mailto:support@foodorder.com" className="support-link">
                      <FaEnvelope /> support@foodorder.com
                    </a>
                  </div>
                </div>
              </div>

              {/* Additional Action Buttons */}
              <div className="action-buttons">
                {currentStatus?.toLowerCase() === 'delivered' && (
                  <button className="btn-action btn-review">
                    Leave a Review
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default OrderDetails;