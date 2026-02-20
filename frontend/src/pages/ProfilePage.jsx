import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicLayout from "../components/PublicLayout";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaCalendar, 
  FaEdit,
  FaSave,
  FaTimes,
  FaShoppingBag,
  FaHeart,
  FaSignOutAlt
} from "react-icons/fa";
import "../style/profilepage.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");

  const [profile, setProfile] = useState({
    id: "",
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    reg_date: "",
  });

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tempProfile, setTempProfile] = useState({});

  useEffect(() => {
    if (!userId) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [userId, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://127.0.0.1:1000/api/user/${userId}/`);
      const data = await res.json();

      if (!res.ok) throw new Error("Failed to load profile");

      setProfile({
        id: data.id,
        first_name: data.first_name || "",
        last_name: data.last_name || "",
        email: data.email || "",
        phone_number: data.phone_number || "",
        reg_date: data.reg_date || "",
      });
      setTempProfile({
        first_name: data.first_name || "",
        last_name: data.last_name || "",
      });
    } catch (err) {
      console.error("Error:", err);
      toast.error("Unable to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditing(true);
    setTempProfile({
      first_name: profile.first_name,
      last_name: profile.last_name,
    });
  };

  const handleCancel = () => {
    setEditing(false);
    setTempProfile({
      first_name: profile.first_name,
      last_name: profile.last_name,
    });
  };

  const handleChange = (e) => {
    setTempProfile({ ...tempProfile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!tempProfile.first_name.trim()) {
      toast.error("First name is required");
      return;
    }

    setSaving(true);

    try {
      const res = await fetch(`http://127.0.0.1:1000/api/user/update/${userId}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: tempProfile.first_name,
          last_name: tempProfile.last_name,
        }),
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Update failed");

      setProfile({
        ...profile,
        first_name: tempProfile.first_name,
        last_name: tempProfile.last_name,
      });
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error:", err);
      toast.error(err.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      toast.success("Logged out successfully");
      setTimeout(() => navigate("/login"), 1500);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "N/A";
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <div className="profile-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p>Loading Profile...</p>
        </div>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <ToastContainer position="top-center" autoClose={2000} />

      <div className="profile-page">
        <div className="container py-5">
          <div className="profile-grid">
            {/* Left Sidebar */}
            <div className="profile-sidebar">
              {/* Avatar Card */}
              <div className="avatar-card">
                <div className="profile-avatar">
                  {profile.first_name?.charAt(0).toUpperCase()}
                  {profile.last_name?.charAt(0).toUpperCase()}
                </div>
                <h2 className="profile-name">
                  {profile.first_name} {profile.last_name}
                </h2>
                <p className="profile-email">{profile.email}</p>
                <span className="status-badge active">
                  ✓ Active Account
                </span>
              </div>

              {/* Quick Actions */}
              <div className="quick-actions">
                <h4>Quick Actions</h4>
                <button 
                  className="action-btn"
                  onClick={() => navigate('/my-orders')}
                >
                  <FaShoppingBag /> My Orders
                </button>
                <button 
                  className="action-btn"
                  onClick={() => navigate('/wishlist')}
                >
                  <FaHeart /> Wishlist
                </button>
                <button 
                  className="action-btn logout-btn"
                  onClick={handleLogout}
                >
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            </div>

            {/* Right Content */}
            <div className="profile-content">
              {/* Basic Information Card */}
              <div className="info-card">
                <div className="card-header">
                  <h3>
                    <FaUser /> Basic Information
                  </h3>
                  {!editing && (
                    <button className="edit-btn" onClick={handleEdit}>
                      <FaEdit /> Edit
                    </button>
                  )}
                </div>

                <div className="card-body">
                  {editing ? (
                    <form onSubmit={handleSubmit}>
                      <div className="form-row">
                        <div className="form-group">
                          <label>First Name *</label>
                          <input
                            type="text"
                            name="first_name"
                            value={tempProfile.first_name}
                            onChange={handleChange}
                            required
                            placeholder="Enter first name"
                          />
                        </div>

                        <div className="form-group">
                          <label>Last Name</label>
                          <input
                            type="text"
                            name="last_name"
                            value={tempProfile.last_name}
                            onChange={handleChange}
                            placeholder="Enter last name"
                          />
                        </div>
                      </div>

                      <div className="form-actions">
                        <button 
                          type="submit" 
                          className="save-btn"
                          disabled={saving}
                        >
                          <FaSave /> {saving ? "Saving..." : "Save Changes"}
                        </button>
                        <button 
                          type="button" 
                          className="cancel-btn"
                          onClick={handleCancel}
                          disabled={saving}
                        >
                          <FaTimes /> Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="info-grid">
                      <div className="info-item">
                        <label>First Name</label>
                        <p>{profile.first_name || "Not set"}</p>
                      </div>
                      <div className="info-item">
                        <label>Last Name</label>
                        <p>{profile.last_name || "Not set"}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information Card */}
              <div className="info-card">
                <div className="card-header">
                  <h3>
                    <FaEnvelope /> Account Information
                  </h3>
                </div>

                <div className="card-body">
                  <div className="info-grid">
                    <div className="info-item">
                      <label>
                        <FaEnvelope /> Email Address
                      </label>
                      <p className="readonly">{profile.email}</p>
                    </div>

                    <div className="info-item">
                      <label>
                        <FaPhone /> Phone Number
                      </label>
                      <p className="readonly">{profile.phone_number}</p>
                    </div>

                    <div className="info-item">
                      <label>
                        <FaCalendar /> Member Since
                      </label>
                      <p className="readonly">{formatDate(profile.reg_date)}</p>
                    </div>

                    <div className="info-item">
                      <label>
                        User ID
                      </label>
                      <p className="readonly">#{profile.id}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="security-notice">
                <h4>🔒 Account Security</h4>
                <p>
                  Email and phone number cannot be changed. 
                  Contact support if you need to update these details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ProfilePage;