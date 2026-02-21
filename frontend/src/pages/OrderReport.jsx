import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaFileAlt, FaSearch, FaEye, FaCalendarAlt } from 'react-icons/fa';
import '../style/orderreport.css';

const STATUS_LABELS = {
  all:              'All',
  pending:          'Pending',
  confirmed:        'Confirmed',
  preparing:        'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
};

const STATUS_COLORS = {
  pending:          'badge-pending',
  confirmed:        'badge-confirmed',
  preparing:        'badge-preparing',
  out_for_delivery: 'badge-pickup',
  delivered:        'badge-delivered',
  cancelled:        'badge-cancelled',
};

const formatDate = (d) => {
  if (!d) return 'N/A';
  try {
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return 'N/A'; }
};

const OrderReport = () => {
  const [formData, setFormData] = useState({
    from_date: '',
    to_date:   '',
    status:    'all',
  });
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(false);
  const [searched, setSearched] = useState(false);

  const adminUser = localStorage.getItem('adminUser');
  const navigate  = useNavigate();

  useEffect(() => {
    if (!adminUser) {
      navigate('/admin-login');
      return;
    }
  }, [adminUser, navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.from_date || !formData.to_date) {
      toast.error('Please select both From and To dates');
      return;
    }
    if (formData.from_date > formData.to_date) {
      toast.error('From date cannot be after To date');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('http://127.0.0.1:1000/api/order_between_dates/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setOrders(Array.isArray(data) ? data : []);
        setSearched(true);
        if (data.length === 0) toast.info('No orders found for the selected range');
      } else {
        toast.error(data.message || 'Failed to fetch report');
      }
    } catch (error) {
      console.error(error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="orderreport-page">

        {/* Header */}
        <div className="report-header">
          <div className="header-left">
            <FaFileAlt className="header-icon" />
            <div>
              <h1>Order Report</h1>
              <p>Filter orders by date range and status</p>
            </div>
          </div>
        </div>

        {/* Filter Form */}
        <div className="filter-card">
          <h3 className="filter-title"><FaCalendarAlt /> Filter Orders</h3>
          <div className="filter-form">
            <div className="form-group">
              <label>From Date</label>
              <input
                type="date"
                name="from_date"
                className="form-input"
                value={formData.from_date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>To Date</label>
              <input
                type="date"
                name="to_date"
                className="form-input"
                value={formData.to_date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Status</label>
              <select
                name="status"
                className="form-input"
                value={formData.status}
                onChange={handleChange}
              >
                {Object.entries(STATUS_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            </div>
            <div className="form-group form-btn-group">
              <button
                className="search-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading
                  ? <><span className="spinner-border spinner-border-sm" /> Searching…</>
                  : <><FaSearch /> Generate Report</>
                }
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {searched && (
          <>
            {/* Summary cards */}
            <div className="summary-row">
              <div className="summary-card s-total">
                <span className="s-number">{orders.length}</span>
                <span className="s-label">Total Orders</span>
              </div>
              <div className="summary-card s-revenue">
                <span className="s-number">৳{totalRevenue.toFixed(0)}</span>
                <span className="s-label">Total Revenue</span>
              </div>
              <div className="summary-card s-delivered">
                <span className="s-number">{orders.filter(o => o.status === 'delivered').length}</span>
                <span className="s-label">Delivered</span>
              </div>
              <div className="summary-card s-cancelled">
                <span className="s-number">{orders.filter(o => o.status === 'cancelled').length}</span>
                <span className="s-label">Cancelled</span>
              </div>
            </div>

            {/* Table */}
            {orders.length === 0 ? (
              <div className="empty-orders">
                <FaFileAlt className="empty-icon" />
                <h3>No orders found</h3>
                <p>Try adjusting the date range or status filter</p>
              </div>
            ) : (
              <div className="table-card">
                <div className="table-responsive">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date'].map(h => (
                          <th key={h}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order) => (
                        <tr key={order.id || order.order_number} className="order-row">
                          <td><strong>#{order.order_number}</strong></td>
                          <td>
                            <div className="customer-cell">
                              <div className="customer-avatar">
                                {order.customer_name?.[0]?.toUpperCase() || '?'}
                              </div>
                              <div>
                                <div className="customer-name">{order.customer_name || 'N/A'}</div>
                                <div className="customer-phone">{order.customer_phone || ''}</div>
                              </div>
                            </div>
                          </td>
                          <td>{order.item_count || 0} items</td>
                          <td className="amount-cell">৳{order.total_amount?.toFixed(2) || '0.00'}</td>
                          <td>
                            <span className={`payment-badge ${order.payment_mode === 'cod' ? 'payment-cod' : 'payment-online'}`}>
                              {order.payment_mode === 'cod' ? 'COD' : 'Online'}
                            </span>
                          </td>
                          <td>
                            <span className={`status-badge ${STATUS_COLORS[order.status] || 'badge-pending'}`}>
                              {STATUS_LABELS[order.status] || order.status}
                            </span>
                          </td>
                          <td className="date-cell">{formatDate(order.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="table-footer">
                  <span>Showing <strong>{orders.length}</strong> orders</span>
                  <span>{formData.from_date} → {formData.to_date}</span>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </AdminLayout>
  );
};

export default OrderReport;