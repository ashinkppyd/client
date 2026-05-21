import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/forgot-password/", { email }, { withCredentials: true });
      setSent(true);
      toast.success("Reset link sent! Check your inbox 📧");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error sending reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="fp-blob1" />
      <div className="fp-blob2" />

      <div className="fp-card">
        <div className="fp-badge">✦ Servio Account</div>

        {!sent ? (
          <>
            <div className="fp-icon-circle">🔑</div>
            <h2 className="fp-title">Forgot your <span>Password?</span></h2>
            <p className="fp-sub">
              No worries! Enter your email and we'll send you a reset link.
            </p>
            <form onSubmit={handleSubmit}>
              <input
                className="fp-input"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button className="fp-btn" type="submit" disabled={loading}>
                {loading ? "Sending…" : "Send Reset Link →"}
              </button>
            </form>
            <Link to="/login" className="fp-back">← Back to login</Link>
          </>
        ) : (
          <>
            <div className="fp-success-circle">✉️</div>
            <h2 className="fp-title">Check your <span>Inbox</span></h2>
            <p className="fp-sub">
              We've sent a password reset link to<br />
              <strong style={{ color: "#04260E" }}>{email}</strong>
            </p>
            <div className="fp-info-box">
              <span>📌</span>
              <span>Didn't receive it? Check your spam folder or try again.</span>
            </div>
            <button className="fp-btn-outline" onClick={() => setSent(false)}>
              ↩ Try a different email
            </button>
            <Link to="/login" className="fp-back">← Back to login</Link>
          </>
        )}
      </div>
    </div>
  );
}
