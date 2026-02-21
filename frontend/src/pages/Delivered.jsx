import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCheckCircle, FaEye, FaSearch } from 'react-icons/fa';
import '../style/delivered.css';

const formatDate = (d) => {
  if (!d) return 'N/A';
  try {
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return 'N/A'; }
};

const Delivered = () => {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  const adminUser = localStorage.getItem('adminUser');
  const navigate  = useNavigate();

  useEffect(() => {
    if (!adminUser) { navigate('/admin-login'); return; }
    fetchOrders();
  }, [adminUser, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res  = await fetch('http://127.0.0.1:1000/api/orders-delivered/');
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load delivered orders');
    } finally {
      setLoading(false);
    }
  };

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return (
      !q ||
      o.order_number?.toString().toLowerCase().includes(q) ||
      o.customer_name?.toLowerCase().includes(q) ||
      o.customer_email?.toLowerCase().includes(q) ||
      o.customer_phone?.toLowerCase().includes(q)
    );
  });

  const totalRevenue = orders.reduce((sum, o) => sum + (o.total_amount || 0), 0);

  if (loading) {
    return (
      <AdminLayout>
        <div className="orders-loading">
          <div className="spinner-border text-success" role="status">
            <span className="visually-hidden">Loading…</span>
          </div>
          <p>Loading delivered orders…</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="delivered-page">

        {/* Header */}
        <div className="orders-header">
          <div className="header-left">
            <FaCheckCircle className="header-icon" />
            <div>
              <h1>Delivered Orders</h1>
              <p>All successfully delivered orders</p>
            </div>
          </div>
          <div className="header-stats">
            <div className="stat-card stat-today">
              <span className="stat-number">
                {orders.filter(o => {
                  if (!o.created_at) return false;
                  return new Date(o.created_at).toDateString() === new Date().toDateString();
                }).length}
              </span>
              <span className="stat-label">Today</span>
            </div>
            <div className="stat-card stat-revenue">
              <span className="stat-number">৳{totalRevenue.toFixed(0)}</span>
              <span className="stat-label">Total Revenue</span>
            </div>
            <div className="stat-card stat-total">
              <span className="stat-number">{orders.length}</span>
              <span className="stat-label">Total Delivered</span>
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
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="empty-orders">
            <FaCheckCircle className="empty-icon" />
            <h3>No delivered orders</h3>
            <p>There are no delivered orders to display</p>
          </div>
        ) : (
          <div className="table-card">
            <div className="table-responsive">
              <table className="orders-table">
                <thead>
                  <tr>
                    {['Order #', 'Customer', 'Items', 'Total', 'Payment', 'Date', 'Action'].map(h => (
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
              <span>Showing <strong>{filtered.length}</strong> of <strong>{orders.length}</strong> delivered orders</span>
              <span>Last refreshed: {formatDate(new Date().toISOString())}</span>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default Delivered;