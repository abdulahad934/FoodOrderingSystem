import React, { useEffect, useState } from 'react';
import AdminLayout from '../components/AdminLayout';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaUsers, FaSearch, FaEnvelope, FaPhone, FaCalendarAlt } from 'react-icons/fa';
import '../style/registeredusers.css';

const formatDate = (d) => {
  if (!d) return 'N/A';
  try {
    return new Date(d).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  } catch { return 'N/A'; }
};

const getInitials = (firstName, lastName) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase() || '?';
};

const AVATAR_COLORS = [
  '#4f46e5', '#0891b2', '#059669', '#d97706',
  '#dc2626', '#7c3aed', '#db2777', '#0284c7',
];

const getAvatarColor = (name) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
};

const RegisteredUsers = () => {
  const [users, setUsers]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');

  const adminUser = localStorage.getItem('adminUser');
  const navigate  = useNavigate();

  useEffect(() => {
    if (!adminUser) { navigate('/admin-login'); return; }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res  = await fetch('http://127.0.0.1:1000/api/registered-users/');
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    return (
      !q ||
      u.first_name?.toLowerCase().includes(q) ||
      u.last_name?.toLowerCase().includes(q)  ||
      u.email?.toLowerCase().includes(q)      ||
      u.phone_number?.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <AdminLayout>
        <div className="ru-loading">
          <div className="spinner-border text-primary" />
          <p>Loading users…</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="ru-page">

        {/* Header */}
        <div className="ru-header">
          <div className="ru-header-left">
            <div className="ru-header-icon">
              <FaUsers />
            </div>
            <div>
              <h1>Registered Users</h1>
              <p>All customer accounts on the platform</p>
            </div>
          </div>
          <div className="ru-stats">
            <div className="ru-stat-card">
              <span className="ru-stat-number">{users.length}</span>
              <span className="ru-stat-label">Total Users</span>
            </div>
            <div className="ru-stat-card ru-stat-today">
              <span className="ru-stat-number">
                {users.filter(u => {
                  const d = new Date(u.reg_date);
                  const today = new Date();
                  return d.toDateString() === today.toDateString();
                }).length}
              </span>
              <span className="ru-stat-label">Today</span>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="ru-toolbar">
          <div className="ru-search-wrap">
            <FaSearch className="ru-search-icon" />
            <input
              className="ru-search-input"
              placeholder="Search by name, email, phone…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <span className="ru-count">Showing {filtered.length} of {users.length} users</span>
        </div>

        {/* Table */}
        {filtered.length === 0 ? (
          <div className="ru-empty">
            <FaUsers className="ru-empty-icon" />
            <h3>No users found</h3>
            <p>Try adjusting your search</p>
          </div>
        ) : (
          <div className="ru-table-card">
            <table className="ru-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>User</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((user, idx) => {
                  const fullName = `${user.first_name} ${user.last_name}`;
                  const color    = getAvatarColor(fullName);
                  return (
                    <tr key={user.id} className="ru-row">
                      <td className="ru-idx">{idx + 1}</td>
                      <td>
                        <div className="ru-user-cell">
                          <div
                            className="ru-avatar"
                            style={{ background: color }}
                          >
                            {getInitials(user.first_name, user.last_name)}
                          </div>
                          <div>
                            <div className="ru-name">{fullName}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="ru-icon-cell">
                          <FaEnvelope className="ru-cell-icon" />
                          {user.email || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="ru-icon-cell">
                          <FaPhone className="ru-cell-icon" />
                          {user.phone_number || 'N/A'}
                        </div>
                      </td>
                      <td>
                        <div className="ru-icon-cell">
                          <FaCalendarAlt className="ru-cell-icon" />
                          {formatDate(user.reg_date)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="ru-footer">
              <span>Last refreshed: {formatDate(new Date().toISOString())}</span>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
};

export default RegisteredUsers;