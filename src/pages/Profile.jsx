import { useEffect, useState } from "react";
import API from "../api/axios";
import { toast } from "react-toastify";
import "./Profile.css";

export default function Profile() {
  const [user, setUser] = useState({});
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [qr, setQr] = useState(null);
  const [otp, setOtp] = useState("");
  const [mfaEnabled, setMfaEnabled] = useState(false);

  const [editData, setEditData] = useState({
    username: "",
    email: "",
    phone: "",
    place: "",
  });

  
  useEffect(() => {
    API.get("/profile/", { withCredentials: true })
      .then((res) => {
        setUser(res.data);

        setEditData({
          username: res.data.username || "",
          email: res.data.email || "",
          phone: res.data.phone || "",
          place: res.data.place || "",
        });

        setMfaEnabled(res.data.is_mfa_enabled);
      })
      .catch(() => toast.error("Failed to load profile"));
  }, []);

  
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
      toast.success("Photo updated 🎉");

    } catch {
      toast.error("Upload failed ❌");
    } finally {
      setLoading(false);
    }
  };

  
  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const res = await API.put("/profile/", {
        username: editData.username,
        phone: editData.phone,
        place: editData.place,
      }, {
        withCredentials: true,
      });

      setUser(res.data);
      setIsEditing(false);
      toast.success("Profile updated ✅");

    } catch {
      toast.error("Update failed ❌");
    }
  };

  
  const handleEnableMFA = async () => {
    try {
      const res = await API.get("/enable-mfa/", {
        withCredentials: true,
      });

      setQr(res.data.qr_code);
      toast.info("Scan QR using Authenticator 📱");

    } catch {
      toast.error("Failed to generate QR");
    }
  };

 
  const handleVerifyMFA = async () => {
    if (!otp || otp.length !== 6) {
      return toast.error("Enter valid 6-digit code");
    }

    try {
      await API.post(
        "/verify-mfa/",
        { otp: otp.trim() },
        { withCredentials: true }
      );

      toast.success("MFA Enabled 🔐");
      setQr(null);
      setMfaEnabled(true);
      setOtp("");

    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.error || "Invalid OTP ❌");
    }
  };

  
  const handleDisableMFA = async () => {
    try {
      await API.post("/disable-mfa/", {}, {
        withCredentials: true,
      });

      setMfaEnabled(false);
      toast.success("MFA Disabled ❌");

    } catch {
      toast.error("Failed to disable MFA");
    }
  };

 
  const handleLogout = async () => {
    await API.post("/logout/", {}, { withCredentials: true });
    toast.success("Logged out 👋");
    window.location.href = "/login";
  };

  return (
  <div className="profile-container">
    <div className="profile-card">
      
      {/* LEFT COLUMN */}
      <div className="visual-column">
        <div className="image-wrapper">
          <img
            src={preview ? preview : user.profile_image ? `http://127.0.0.1:8000${user.profile_image}` : "https://via.placeholder.com/120"}
            alt="profile"
            className="profile-img"
          />
        </div>
        <input type="file" onChange={handleImageChange} />
        <button onClick={handleUpload} className="profile-btn">
          {loading ? "Uploading..." : "Upload Photo"}
        </button>

        {qr && (
          <div className="mfa-box">
            <p>Scan QR Code</p>
            <img src={qr} alt="QR" className="mfa-qr" />
            <input
              className="mfa-input"
              placeholder="000000"
              value={otp}
              maxLength={6}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
            />
            <button onClick={handleVerifyMFA} className="profile-btn">Verify</button>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN */}
      <div className="profile-info-section">
        <div className="profile-info">
          <h3>{user.username}</h3>
          <p>{user.email}</p>
          <span>ID: {user.custom_id}</span>
        </div>

        <button className="edit-toggle" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </button>

        {isEditing && (
          <div className="edit-section">
            <label>Username</label>
            <input name="username" value={editData.username} onChange={handleChange} />
            <label>Phone</label>
            <input name="phone" value={editData.phone} onChange={handleChange} />
            <label>Location</label>
            <input name="place" value={editData.place} onChange={handleChange} />
            <button onClick={handleUpdate} className="profile-btn">Save Changes</button>
          </div>
        )}

        <div className="mfa-section">
          <h3>Security & MFA</h3>
          {mfaEnabled ? (
            <>
              <p className="mfa-enabled">✅ MFA Secured Account</p>
              <button onClick={handleDisableMFA} className="logout-btn">Disable MFA</button>
            </>
          ) : !qr && (
            <button onClick={handleEnableMFA} className="profile-btn">Enable 2FA Security</button>
          )}
        </div>

        <button onClick={handleLogout} className="logout-btn" style={{marginTop: '40px'}}>
          Logout from Session
        </button>
      </div>

    </div>
  </div>
  );
}