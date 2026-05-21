import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import API from "../api/axios";
import "./ResetPassword.css";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await API.post("/reset-password/", { uid, token, password }, { withCredentials: true });
      toast.success("Password reset successful 🎉");
      navigate("/login");
    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.error || "Error resetting password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-password-page">
      <div className="rp-blob1" />
      <div className="rp-blob2" />
      <div className="reset-card">
        <div className="rp-badge">✦ Servio Account</div>
        <h2 className="reset-title">Reset your <span>Password</span></h2>
        <p className="reset-sub">Enter a new password below to secure your account.</p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? "Updating..." : "Update Password →"}
          </button>
        </form>
        <Link to="/login" className="rp-back">← Back to login</Link>
      </div>
    </div>
  );
}