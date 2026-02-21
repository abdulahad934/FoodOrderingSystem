import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useNavigate, Link } from 'react-router-dom';
import {
  FaShoppingBag, FaUsers, FaCheckCircle, FaClock,
  FaTruck, FaBan, FaUtensils, FaMoneyBillWave,
  FaArrowUp, FaClipboardList
} from 'react-icons/fa';
import '../style/dashboard.css';

const STATUS_LABELS = {
  pending:          'Pending',
  confirmed:        'Confirmed',
  preparing:        'Preparing',
  out_for_delivery: 'Out for Delivery',
  delivered:        'Delivered',
  cancelled:        'Cancelled',
};

const STATUS_CLASS = {
  pending:          'ds-badge-pending',
  confirmed:        'ds-badge-confirmed',
  preparing:        'ds-badge-preparing',
  out_for_delivery: 'ds-badge-delivery',
  delivered:        'ds-badge-delivered',
  cancelled:        'ds-badge-cancelled',
};

const formatDate = (d) => {
  if (!d) return 'N/A';
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return 'N/A'; }
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Morning';
  if (h < 17) return 'Afternoon';
  return 'Evening';
}

const Dashboard = () => {
  const adminUser = localStorage.getItem('adminUser');
  const navigate  = useNavigate();

  const [stats, setStats]         = useState(null);
  const [recentOrders, setRecent] = useState([]);
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    if (!adminUser) { navigate('/admin-login'); return; }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, ordersRes] = await Promise.all([
        fetch('http://127.0.0.1:1000/api/dashboard-stats/'),
        fetch('http://127.0.0.1:1000/api/all-orders/'),
      ]);

      const statsData  = await statsRes.json();
      const ordersData = await ordersRes.json();

      setStats(statsData);
      setRecent(Array.isArray(ordersData) ? ordersData.slice(0, 6) : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !stats) {
    return (
      <AdminLayout>
        <div className="ds-loading">
          <div className="ds-spinner" />
          <p>Loading dashboard...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="ds-page">

        <div className="ds-welcome">
          <div>
            <h1 className="ds-welcome-title">Good {getGreeting()}, Admin</h1>
            <p className="ds-welcome-sub">Here's what's happening with your restaurant today.</p>
          </div>
          <div className="ds-date-chip">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </div>
        </div>

        <div className="ds-stat-grid">
          <div className="ds-stat-card ds-card-orders">
            <div className="ds-stat-icon"><FaShoppingBag /></div>
            <div className="ds-stat-body">
              <div className="ds-stat-num">{stats.total_orders}</div>
              <div className="ds-stat-label">Total Orders</div>
              <div className="ds-stat-today"><FaArrowUp /> {stats.today_orders} today</div>
            </div>
          </div>
          <div className="ds-stat-card ds-card-revenue">
            <div className="ds-stat-icon"><FaMoneyBillWave /></div>
            <div className="ds-stat-body">
              <div className="ds-stat-num">৳{stats.total_revenue?.toFixed(0)}</div>
              <div className="ds-stat-label">Total Revenue</div>
              <div className="ds-stat-today">from delivered orders</div>
            </div>
          </div>
          <div className="ds-stat-card ds-card-users">
            <div className="ds-stat-icon"><FaUsers /></div>
            <div className="ds-stat-body">
              <div className="ds-stat-num">{stats.total_users}</div>
              <div className="ds-stat-label">Registered Users</div>
              <div className="ds-stat-today"><FaArrowUp /> {stats.today_users} today</div>
            </div>
          </div>
          <div className="ds-stat-card ds-card-foods">
            <div className="ds-stat-icon"><FaUtensils /></div>
            <div className="ds-stat-body">
              <div className="ds-stat-num">{stats.total_foods}</div>
              <div className="ds-stat-label">Food Items</div>
              <div className="ds-stat-today">on menu</div>
            </div>
          </div>
        </div>

        <div className="ds-status-row">
          <Link to="/orders-not-confirmed" className="ds-status-chip ds-chip-pending">
            <FaClock />
            <span className="ds-chip-num">{stats.pending}</span>
            <span className="ds-chip-label">Pending</span>
          </Link>
          <Link to="/orders-confirmed" className="ds-status-chip ds-chip-confirmed">
            <FaCheckCircle />
            <span className="ds-chip-num">{stats.confirmed}</span>
            <span className="ds-chip-label">Confirmed</span>
          </Link>
          <Link to="/being-prepared" className="ds-status-chip ds-chip-preparing">
            <FaUtensils />
            <span className="ds-chip-num">{stats.preparing}</span>
            <span className="ds-chip-label">Preparing</span>
          </Link>
          <Link to="/food-pickup" className="ds-status-chip ds-chip-delivery">
            <FaTruck />
            <span className="ds-chip-num">{stats.out_for_delivery}</span>
            <span className="ds-chip-label">Out for Delivery</span>
          </Link>
          <Link to="/delivered" className="ds-status-chip ds-chip-delivered">
            <FaShoppingBag />
            <span className="ds-chip-num">{stats.delivered}</span>
            <span className="ds-chip-label">Delivered</span>
          </Link>
          <Link to="/order-cancelled" className="ds-status-chip ds-chip-cancelled">
            <FaBan />
            <span className="ds-chip-num">{stats.cancelled}</span>
            <span className="ds-chip-label">Cancelled</span>
          </Link>
        </div>

        <div className="ds-table-card">
          <div className="ds-table-header">
            <h2><FaClipboardList /> Recent Orders</h2>
            <Link to="/all-orders" className="ds-view-all">View All</Link>
          </div>
          <div className="ds-table-wrap">
            <table className="ds-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Total</th>
                  <th>Payment</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.length === 0 ? (
                  <tr><td colSpan={6} className="ds-no-data">No orders yet</td></tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.order_number} className="ds-tr">
                      <td><strong>#{order.order_number}</strong></td>
                      <td>
                        <div className="ds-cust">
                          <div className="ds-avatar">
                            {order.customer_name?.[0]?.toUpperCase() || '?'}
                          </div>
                          <div>
                            <div className="ds-cust-name">{order.customer_name || 'N/A'}</div>
                            <div className="ds-cust-phone">{order.customer_phone || ''}</div>
                          </div>
                        </div>
                      </td>
                      <td className="ds-amount">৳{order.total_amount?.toFixed(2)}</td>
                      <td>
                        <span className={`ds-pay ${order.payment_mode === 'cod' ? 'ds-pay-cod' : 'ds-pay-online'}`}>
                          {order.payment_mode === 'cod' ? 'COD' : 'Online'}
                        </span>
                      </td>
                      <td>
                        <span className={`ds-badge ${STATUS_CLASS[order.status] || 'ds-badge-pending'}`}>
                          {STATUS_LABELS[order.status] || 'Pending'}
                        </span>
                      </td>
                      <td className="ds-date">{formatDate(order.created_at)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
};

export default Dashboard;