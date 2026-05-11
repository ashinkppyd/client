import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import "./Profile.css";
import { useNavigate } from "react-router-dom";


// ── Helpers ────────────────────────────────────────
const API_ROOT = "http://127.0.0.1:8000";

const activityFeed = [
  { dot: "green",   text: <>Profile <strong>photo updated</strong></>,           time: "2m ago"  },
  { dot: "info",    text: <>Logged in from <strong>Chrome · Kerala</strong></>,   time: "1h ago"  },
  { dot: "green",   text: <>MFA <strong>enabled</strong> successfully</>,         time: "3h ago"  },
  { dot: "warning", text: <>Profile <strong>details updated</strong></>,          time: "Yesterday" },
  { dot: "info",    text: <>Account <strong>created</strong></>,                  time: "3 days ago" },
];

function completeness(user) {
  const fields = [user.profile_image, user.phone, user.place, user.username, user.email];
  const filled = fields.filter(Boolean).length;
  return Math.round((filled / fields.length) * 100);
}

export default function Profile() {
  const [user, setUser]         = useState({});
  const [image, setImage]       = useState(null);
  const [preview, setPreview]   = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading]   = useState(false);

  const [qr, setQr]             = useState(null);
  const [otp, setOtp]           = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const navigate = useNavigate();

  const [editData, setEditData] = useState({
    username: "", email: "", phone: "", place: "",
  });

  const goToChangePassword = () => {
    navigate("/change-password", { state: { email: user.email || editData.email } });
  };

  // ── Load profile ────────────────────────────────
  useEffect(() => {
    API.get("/profile/", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        setEditData({
          username: res.data.username || "",
          email:    res.data.email    || "",
          phone:    res.data.phone    || "",
          place:    res.data.place    || "",
        });
        setMfaEnabled(res.data.is_mfa_enabled);
      })
      .catch(() => toast.error("Failed to load profile"));
  }, []);

  // ── Image upload ────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return toast.error("Select an image first");
    const formData = new FormData();
    formData.append("profile_image", image);
    try {
      setLoading(true);
      const res = await API.put("/profile/", formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUser(res.data);
      setPreview(null);
      setImage(null);
      toast.success("Photo updated 🎉");
    } catch { toast.error("Upload failed ❌"); }
    finally { setLoading(false); }
  };

  // ── Edit ────────────────────────────────────────
  const handleChange = (e) =>
    setEditData({ ...editData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      const res = await API.put("/profile/", {
        username: editData.username,
        phone:    editData.phone,
        place:    editData.place,
      }, { withCredentials: true });
      setUser(res.data);
      setIsEditing(false);
      toast.success("Profile updated ✅");
    } catch { toast.error("Update failed ❌"); }
  };

  // ── MFA ─────────────────────────────────────────
  const handleEnableMFA = async () => {
    try {
      const res = await API.get("/enable-mfa/", { withCredentials: true });
      setQr(res.data.qr_code);
      toast.info("Scan QR using Authenticator 📱");
    } catch { toast.error("Failed to generate QR"); }
  };

  const handleVerifyMFA = async () => {
    if (!otp || otp.length !== 6) return toast.error("Enter valid 6-digit code");
    try {
      await API.post("/verify-mfa/", { otp: otp.trim() }, { withCredentials: true });
      toast.success("MFA Enabled 🔐");
      setQr(null); setMfaEnabled(true); setOtp("");
    } catch (err) { toast.error(err.response?.data?.error || "Invalid OTP ❌"); }
  };

  const handleDisableMFA = async () => {
    try {
      await API.post("/disable-mfa/", {}, { withCredentials: true });
      setMfaEnabled(false);
      toast.success("MFA Disabled");
    } catch { toast.error("Failed to disable MFA"); }
  };

  // ── Logout ──────────────────────────────────────
  const handleLogout = async () => {
    await API.post("/logout/", {}, { withCredentials: true });
    toast.success("Logged out 👋");
    window.location.href = "/login";
  };

  // ── Derived ─────────────────────────────────────
  const avatarSrc = preview
    ? preview
    : user.profile_image
    ? `${API_ROOT}${user.profile_image}`
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(user.username || "U")}&background=41C187&color=fff&size=200`;

  const percent = completeness(user);

  return (
    <div className="profile-page">
      {/* Background decoration */}
      <div className="profile-blob-tr" />
      <div className="profile-blob-bl" />

      {/* ── COVER BANNER ─────────────────────── */}
      <div className="profile-cover">
        <div className="cover-glow" />
        <div className="cover-actions">
          <button className="cover-action-btn" onClick={handleLogout}>
            ↩ Sign Out
          </button>
        </div>
      </div>

      {/* ── MAIN ─────────────────────────────── */}
      <div className="profile-main">

        {/* Identity row */}
        <div className="profile-identity">
          <div className="identity-left">
            <div className="avatar-ring">
              <img src={avatarSrc} alt="avatar" />
              <label className="avatar-upload-btn" title="Change photo">
                📷
                <input type="file" accept="image/*" onChange={handleImageChange} />
              </label>
            </div>
            <div className="identity-meta">
              <div className="identity-name">{user.username || "Your Name"}</div>
              <div className="identity-email">{user.email}</div>
              <div className="identity-badges">
                <span className="badge-pill badge-id">🪪 ID: {user.custom_id}</span>
                {mfaEnabled
                  ? <span className="badge-pill badge-mfa-on">🔐 MFA Active</span>
                  : <span className="badge-pill badge-mfa-off">⚠️ MFA Off</span>
                }
              </div>
            </div>
          </div>

          <div className="identity-right">
            <button className="btn-secondary" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? "✕ Cancel" : "✏️ Edit Profile"}
            </button>
          </div>
        </div>

        {/* Upload preview banner */}
        {preview && (
          <div className="upload-preview-banner">
            <img src={preview} alt="preview" className="upload-preview-img" />
            <div className="upload-preview-text">
              New photo selected
              <span>Click "Save Photo" to apply changes</span>
            </div>
            <button className="btn-primary" onClick={handleUpload} disabled={loading}>
              {loading ? "Uploading…" : "💾 Save Photo"}
            </button>
          </div>
        )}

        {/* Stats row */}
        <div className="profile-stats-row">
          <div className="pstat-card">
            <div className="pstat-icon">📅</div>
            <div>
              <div className="pstat-num">24</div>
              <div className="pstat-lbl">Events Booked</div>
            </div>
          </div>
          <div className="pstat-card">
            <div className="pstat-icon">✅</div>
            <div>
              <div className="pstat-num">18</div>
              <div className="pstat-lbl">Completed</div>
            </div>
          </div>
          <div className="pstat-card">
            <div className="pstat-icon">⭐</div>
            <div>
              <div className="pstat-num">4.9</div>
              <div className="pstat-lbl">Avg Rating</div>
            </div>
          </div>
          <div className="pstat-card">
            <div className="pstat-icon">📍</div>
            <div>
              <div className="pstat-num">{user.place || "—"}</div>
              <div className="pstat-lbl">Location</div>
            </div>
          </div>
        </div>

        {/* Content grid */}
        <div className="profile-content-grid">

          {/* LEFT column */}
          <div>

            {/* Personal Info Panel */}
            <div className="glass-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <div className="panel-title-icon">👤</div>
                  Personal Information
                </div>
                <button
                className="btn-edit-toggle"
                onClick={goToChangePassword}
              >
                Change
              </button>
              </div>
              <div className="panel-body">
                <div className="profile-form-grid">
                  <div className="form-group">
                    <label className="form-label">Username</label>
                    <input
                      className="form-input"
                      name="username"
                      value={editData.username}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="Your username"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      className="form-input"
                      name="email"
                      value={editData.email}
                      disabled
                      placeholder="email@example.com"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Phone Number</label>
                    <input
                      className="form-input"
                      name="phone"
                      value={editData.phone}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="+91 00000 00000"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      className="form-input"
                      name="place"
                      value={editData.place}
                      onChange={handleChange}
                      disabled={!isEditing}
                      placeholder="City, State"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Account ID</label>
                    <input
                      className="form-input"
                      value={user.custom_id || ""}
                      disabled
                    />
                  </div>
                </div>

                {isEditing && (
                  <div className="form-actions">
                    <button className="btn-primary" onClick={handleUpdate}>
                      💾 Save Changes
                    </button>
                    <button className="btn-secondary" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Security Panel */}
            <div className="glass-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <div className="panel-title-icon">🔒</div>
                  Security &amp; Access
                </div>
                <span className="section-label-pill">2 of 3 active</span>
              </div>
              <div className="panel-body">
                <div className="security-item">
                  <div className="security-item-left">
                    <div className="security-icon green">✉️</div>
                    <div>
                      <div className="security-label">Email Verified</div>
                      <div className="security-sublabel">{user.email}</div>
                    </div>
                  </div>
                  <span className="security-status-on">Active</span>
                </div>

                <div className="security-item">
                  <div className="security-item-left">
                    <div className={`security-icon ${mfaEnabled ? "green" : "amber"}`}>🔐</div>
                    <div>
                      <div className="security-label">Two-Factor Auth (TOTP)</div>
                      <div className="security-sublabel">Authenticator app</div>
                    </div>
                  </div>
                  {mfaEnabled ? (
                    <button
                      className="btn-edit-toggle"
                      style={{ borderColor: "rgba(231,76,60,0.35)", color: "#c0392b" }}
                      onClick={handleDisableMFA}
                    >
                      Disable
                    </button>
                  ) : (
                    <button className="btn-edit-toggle" onClick={handleEnableMFA}>
                      Enable
                    </button>
                  )}
                </div>

                <div className="security-item">
                  <div className="security-item-left">
                    <div className="security-icon amber">🗝️</div>
                    <div>
                      <div className="security-label">Password</div>
                      <div className="security-sublabel">Last changed · 30 days ago</div>
                    </div>
                  </div>
                  <button className="btn-edit-toggle" onClick={goToChangePassword}>
                    Change
                  </button>
                </div>

                {/* MFA Setup flow */}
                {qr && (
                  <div className="mfa-setup-box">
                    <div className="mfa-step-label">Step 1 of 2</div>
                    <div className="mfa-setup-title">Scan with Authenticator</div>
                    <div className="mfa-setup-sub">Use Google Authenticator or Authy</div>
                    <img src={qr} alt="MFA QR Code" />
                    <div className="mfa-step-label" style={{ marginTop: 12 }}>Step 2 of 2</div>
                    <div className="mfa-setup-title">Enter 6-digit code</div>
                    <input
                      className="mfa-otp-input"
                      placeholder="000000"
                      value={otp}
                      maxLength={6}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    />
                    <button className="btn-primary" style={{ width: "100%", justifyContent: "center" }} onClick={handleVerifyMFA}>
                      🔐 Verify &amp; Activate MFA
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Recent Activity Panel */}
            <div className="glass-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <div className="panel-title-icon">📋</div>
                  Recent Activity
                </div>
                <span className="section-label-pill">Last 7 days</span>
              </div>
              <div className="panel-body">
                <div className="activity-list">
                  {activityFeed.map((item, i) => (
                    <div className="activity-item" key={i}>
                      <div className="activity-dot-wrap">
                        <div className={`activity-dot ${item.dot}`} />
                        {i < activityFeed.length - 1 && <div className="activity-line" />}
                      </div>
                      <div className="activity-text">{item.text}</div>
                      <div className="activity-time">{item.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT SIDEBAR */}
          <div>

            {/* Mini profile card */}
            <div className="glass-panel">
              <div className="sidebar-profile-card">
                <img src={avatarSrc} alt="avatar" className="sidebar-avatar" />
                <div className="sidebar-name">{user.username || "Your Name"}</div>
                <div className="sidebar-email">{user.email}</div>

                <div className="sidebar-completeness-label">
                  <span>Profile Completeness</span>
                  <span style={{ color: "#41C187" }}>{percent}%</span>
                </div>
                <div className="progress-bar-track">
                  <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
                </div>
                <div className="progress-hint">
                  {percent < 100
                    ? `Add ${["phone", "place"].filter(f => !user[f]).join(" & ")} to complete`
                    : "✓ Profile complete!"}
                </div>
              </div>
            </div>

            {/* Quick navigation */}
            <div className="glass-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <div className="panel-title-icon">⚡</div>
                  Quick Links
                </div>
              </div>
              <div className="quick-links">
                {[
                  { icon: "📅", label: "My Bookings",     path: "/bookings"  },
                  { icon: "🌐", label: "Browse Events",   path: "/sites"     },
                  { icon: "🤖", label: "AI Service",      path: "/ai-service"},
                  { icon: "📊", label: "Dashboard",       path: "/dashboard" },
                ].map((item, i) => (
                  <a key={i} href={item.path} style={{ textDecoration: "none" }}>
                    <div className="quick-link-item">
                      <div className="ql-icon">{item.icon}</div>
                      <span className="ql-text">{item.label}</span>
                      <span className="ql-arrow">→</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Account Info */}
            <div className="glass-panel">
              <div className="panel-header">
                <div className="panel-title">
                  <div className="panel-title-icon">ℹ️</div>
                  Account Info
                </div>
              </div>
              <div className="panel-body">
                <div className="security-item">
                  <div className="security-item-left">
                    <div className="security-icon green">📅</div>
                    <div>
                      <div className="security-label">Member Since</div>
                      <div className="security-sublabel">January 2025</div>
                    </div>
                  </div>
                </div>
                <div className="security-item">
                  <div className="security-item-left">
                    <div className="security-icon info" style={{ background: "rgba(107,208,204,0.1)", border: "1px solid rgba(107,208,204,0.25)" }}>🏷️</div>
                    <div>
                      <div className="security-label">Account Plan</div>
                      <div className="security-sublabel">Professional</div>
                    </div>
                  </div>
                  <span className="security-status-on">Active</span>
                </div>
                <div className="security-item">
                  <div className="security-item-left">
                    <div className="security-icon green">🌍</div>
                    <div>
                      <div className="security-label">Region</div>
                      <div className="security-sublabel">{user.place || "Not set"}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div className="glass-panel">
              <div className="panel-body">
                <div className="danger-zone">
                  <div className="danger-zone-title">⚠️ Danger Zone</div>
                  <button className="btn-danger" onClick={handleLogout}>
                    ↩ Sign Out of Account
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
