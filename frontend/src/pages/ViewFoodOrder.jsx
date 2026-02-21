import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminLayout from '../components/AdminLayout';
import { FaArrowLeft, FaBox } from 'react-icons/fa';
import '../style/viewfoodorder.css';

const STATUS_LABELS = {
  pending:          'Not Confirmed',
  confirmed:        'Order Confirmed',
  preparing:        'Food being Preparing',
  out_for_delivery: 'Food Pickup',
  delivered:        'Food Delivered',
  cancelled:        'Order Cancelled',
};

const STATUS_OPTIONS = [
  { value: 'confirmed',        label: 'Order Confirmed'      },
  { value: 'preparing',        label: 'Food being Preparing' },
  { value: 'out_for_delivery', label: 'Food Pickup'          },
  { value: 'delivered',        label: 'Food Delivered'       },
  { value: 'cancelled',        label: 'Order Cancelled'      },
];

const STATUS_COLORS = {
  pending:          '#f39c12',
  confirmed:        '#16a085',
  preparing:        '#e67e22',
  out_for_delivery: '#8e44ad',
  delivered:        '#27ae60',
  cancelled:        '#e74c3c',
};

const formatDate = (d) => {
  if (!d) return 'N/A';
  try {
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric', month: 'numeric', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch { return 'N/A'; }
};

const ViewFoodOrder = () => {
  const params      = useParams();
  const rawNumber   = params.order_number || '';
  const orderNumber = rawNumber.replace(/^:order_number/, '');

  const adminUser                   = localStorage.getItem('adminUser');
  const [order, setOrder]           = useState(null);
  const [foods, setFoods]           = useState([]);
  const [tracking, setTracking]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [newStatus, setNewStatus]   = useState('confirmed');
  const [remark, setRemark]         = useState('');
  const [updating, setUpdating]     = useState(false);
  const navigate                    = useNavigate();

  const fetchOrder = () => {
    setLoading(true);
    fetch(`http://127.0.0.1:1000/api/view-order-details/${orderNumber}/`)
      .then(res => { if (!res.ok) throw new Error(); return res.json(); })
      .then(json => {
        setOrder(json.order       || null);
        setFoods(json.foods       || []);
        setTracking(json.tracking || []);
      })
      .catch(() => toast.error('Failed to load order details'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    if (!adminUser) { navigate('/admin-login'); return; }
    fetchOrder();
  }, [orderNumber]);

  const handleUpdateStatus = async () => {
    if (!remark.trim()) { toast.error('Please enter a remark'); return; }
    try {
      setUpdating(true);
      const res = await fetch(
        `http://127.0.0.1:1000/api/update-order-status/${orderNumber}/`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus, remark }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success('Order status updated successfully');
        setRemark('');
        fetchOrder();
      } else {
        toast.error(data.message || 'Failed to update status');
      }
    } catch { toast.error('Something went wrong'); }
    finally { setUpdating(false); }
  };

  const totalAmount = foods.reduce(
    (s, i) => s + parseFloat(i.item_price) * i.quantity, 0
  );

  const currentStatus = order?.order_final_status || 'pending';

  if (loading) {
    return (
      <AdminLayout>
        <div className="vfo-loading">
          <div className="spinner-border text-success" />
          <p>Loading order details…</p>
        </div>
      </AdminLayout>
    );
  }

  if (!order) {
    return (
      <AdminLayout>
        <div className="vfo-not-found">
          <FaBox className="vfo-nf-icon" />
          <h3>Order not found</h3>
          <button className="vfo-back-btn" onClick={() => navigate(-1)}>
            <FaArrowLeft /> Go Back
          </button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ToastContainer position="top-right" autoClose={2500} />

      <div className="vfo-page">

        {/* Top back button */}
        <button className="vfo-back-btn" onClick={() => navigate(-1)}>
          <FaArrowLeft /> Back
        </button>

        <div className="vfo-two-col">

          {/* ── LEFT COLUMN ── */}
          <div className="vfo-left">

            {/* Order Info Table */}
            <div className="vfo-section">
              <table className="vfo-info-table">
                <tbody>
                  <tr>
                    <th>Name</th>
                    <td>{order.user_first_name} {order.user_last_name}</td>
                  </tr>
                  <tr>
                    <th>Email</th>
                    <td>{order.user_email || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Mobile</th>
                    <td>{order.user_phone_number || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Address</th>
                    <td>{order.address || 'N/A'}</td>
                  </tr>
                  <tr>
                    <th>Order Time</th>
                    <td>{formatDate(order.order_time)}</td>
                  </tr>
                  <tr>
                    <th>Final Status</th>
                    <td>
                      <span
                        className="vfo-status-chip"
                        style={{ background: STATUS_COLORS[currentStatus] || '#95a5a6' }}
                      >
                        {STATUS_LABELS[currentStatus] || currentStatus}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Tracking History */}
            <div className="vfo-section">
              <h3 className="vfo-section-title">Tracking History</h3>
              {tracking.length > 0 ? (
                <table className="vfo-track-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Status</th>
                      <th>Remark</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tracking.map((t, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{STATUS_LABELS[t.status] || t.status}</td>
                        <td>{t.remark || '—'}</td>
                        <td>{formatDate(t.status_date)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="vfo-empty-text">No tracking history yet</p>
              )}
            </div>

            {/* Update Status */}
            <div className="vfo-section">
              <h3 className="vfo-section-title">Update Order Status</h3>
              <div className="vfo-form-group">
                <label>Status</label>
                <select
                  className="vfo-select"
                  value={newStatus}
                  onChange={e => setNewStatus(e.target.value)}
                >
                  {STATUS_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>
              <div className="vfo-form-group">
                <label>Remark</label>
                <textarea
                  className="vfo-textarea"
                  rows={4}
                  placeholder="Enter remark…"
                  value={remark}
                  onChange={e => setRemark(e.target.value)}
                />
              </div>
              <div className="vfo-update-row">
                <button
                  className="vfo-update-btn"
                  onClick={handleUpdateStatus}
                  disabled={updating}
                >
                  {updating
                    ? <><span className="spinner-border spinner-border-sm" /> Updating…</>
                    : 'Update Status'
                  }
                </button>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Food Items ── */}
          <div className="vfo-right">
            <div className="vfo-section">
              {foods.length > 0 ? (
                <>
                  {foods.map((item, idx) => (
                    <div key={idx} className="vfo-food-card">
                      {item.image
                        ? <img src={item.image} alt={item.item_name} className="vfo-food-img" />
                        : <div className="vfo-food-img-placeholder">🍽️</div>
                      }
                      <div className="vfo-food-info">
                        <div className="vfo-food-name">{item.item_name}</div>
                        <div className="vfo-food-price">
                          ৳{(parseFloat(item.item_price) * item.quantity).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div className="vfo-total-bar">
                    <span>Total Amount</span>
                    <span className="vfo-total-num">৳{totalAmount.toFixed(2)}</span>
                  </div>
                </>
              ) : (
                <p className="vfo-empty-text">No items found</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
};

export default ViewFoodOrder;