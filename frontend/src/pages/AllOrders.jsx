import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaClipboardList, FaEye, FaSearch } from 'react-icons/fa';
import '../style/allorders.css';

const STATUS_COLORS = {
  pending:          'badge-pending',
  confirmed:        'badge-confirmed',
  preparing:        'badge-preparing',
  out_for_delivery: 'badge-delivery',
  delivered:        'badge-delivered',
  cancelled:        'badge-cancelled',
};

const STATUS_LABELS = {
  pending:          'Pending',
  confirmed:        'Confirmed',
  preparing:        'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
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

const AllOrders = () => {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatus] = useState('all');

  const adminUser = localStorage.getItem('adminUser');
  const navigate  = useNavigate();

  useEffect(() => {
    if (!adminUser) { navigate('/admin-login'); return; }
    fetchOrders();
  }, [adminUser, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res  = await fetch('http://127.0.0.1:1000/api/all-foods/');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter((o) => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      o.order_number?.toString().toLowerCase().includes(q) ||
      o.customer_name?.toLowerCase().includes(q) ||
      o.customer_email?.toLowerCase().includes(q) ||
      o.customer_phone?.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="orders-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading…</span>
          </div>
          <p>Loading orders…</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="all-orders-page">

        {/* Header */}
        <div className="orders-header">
          <div className="header-left">
            <FaClipboardList className="header-icon" />
            <div>
              <h1>All Orders</h1>
              <p>Complete order history across all statuses</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card stat-delivered">
              <span className="stat-number">{orders.filter(o => o.status === 'delivered').length}</span>
              <span className="stat-label">Delivered</span>
            </div>
            <div className="stat-card stat-pending">
              <span className="stat-number">{orders.filter(o => o.status === 'pending').length}</span>
              <span className="stat-label">Pending</span>
            </div>
            <div className="stat-card stat-cancelled">
              <span className="stat-number">{orders.filter(o => o.status === 'cancelled').length}</span>
              <span className="stat-label">Cancelled</span>
            </div>
            <div className="stat-card stat-total">
              <span className="stat-number">{orders.length}</span>
              <span className="stat-label">Total</span>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="orders-toolbar">
          <div className="search-wrap">
            <FaSearch className="search-icon" />
            <input
              className="search-input"
              placeholder="Search by order #, name, email, phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_LABELS).map(([val, label]) => (
              <option key={val} value={val}>{label}</option>
            ))}
          </select>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="empty-orders">
            <FaClipboardList className="empty-icon" />
            <h3>No orders found</h3>
            <p>Try adjusting your search or filter</p>
          </div>
        ) : (
          <div className="table-card">
            <div className="table-responsive">
              <table className="orders-table">
                <thead>
                  <tr>
                    {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Status', 'Date', 'Action'].map(h => (
                      <th key={h}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order) => (
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
                          {STATUS_LABELS[order.status] || 'Pending'}
                        </span>
                      </td>
                      <td className="date-cell">{formatDate(order.created_at)}</td>
                      <td>
                        <Link
                          to={`/view-food-order/${order.order_number}`}
                          className="view-btn"
                        >
                          <FaEye /> View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="table-footer">
              <span>Showing <strong>{filtered.length}</strong> of <strong>{orders.length}</strong> orders</span>
              <span>Last refreshed: {formatDate(new Date().toISOString())}</span>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default AllOrders;