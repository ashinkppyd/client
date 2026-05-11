import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./UserRegister.css";
import { toast } from "react-toastify";

export default function UserRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    state: "",
    district: "",
    place: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/send-otp/",
        { ...form, role: "worker" },
        { withCredentials: true }
      );

      toast.success("OTP sent to your email 📧");
      navigate("/otp");

    } catch (err) {
      toast.error(err.response?.data?.error || "Error sending OTP");
    }
  };

  return (
    <div className="user-page-wrapper">
      <div className="user-blob-tr" />
      <div className="user-blob-bl" />

      <div className="user-card">

        {/* LEFT — Form */}
        <div className="user-form-side">
          <div className="user-logo">
            <div className="user-logo-icon">🍽️</div>
            <span className="user-logo-text">SER<span>VIO</span></span>
          </div>

          <h2>Create Account</h2>
          <p className="user-subheading">Join SERVIO and start your journey</p>

          <form onSubmit={handleSubmit}>
            <div className="user-row">
              <div className="user-field">
                <label>Username</label>
                <input name="username" placeholder="arjun_k" onChange={handleChange} required />
              </div>
              <div className="user-field">
                <label>Phone Number</label>
                <input name="phone" placeholder="+91 98765..." onChange={handleChange} required />
              </div>
            </div>

            <div className="user-field full">
              <label>Email Address</label>
              <input name="email" type="email" placeholder="you@email.com" onChange={handleChange} required />
            </div>

            <div className="user-row-3">
              <div className="user-field">
                <label>State</label>
                <input name="state" placeholder="Kerala" onChange={handleChange} required />
              </div>
              <div className="user-field">
                <label>District</label>
                <input name="district" placeholder="Ernakulam" onChange={handleChange} required />
              </div>
              <div className="user-field">
                <label>Place</label>
                <input name="place" placeholder="Kochi" onChange={handleChange} required />
              </div>
            </div>

            <div className="user-row">
              <div className="user-field">
                <label>Password</label>
                <input name="password" type="password" placeholder="min. 8 chars" onChange={handleChange} required />
              </div>
              <div className="user-field">
                <label>Confirm Password</label>
                <input name="confirm_password" type="password" placeholder="repeat" onChange={handleChange} required />
              </div>
            </div>

            <button type="submit">Send OTP →</button>
          </form>

          <div className="user-footer">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Sign in</span>
          </div>
        </div>

        {/* RIGHT — Decorative Panel */}
        <div className="user-panel-side">
          <div className="user-panel-content">
            <div className="user-panel-icon">👤</div>
            <div className="user-panel-title">Join the<br />SERVIO Family</div>
            <p className="user-panel-sub">
              Thousands of professionals are already finding great opportunities. Your next job is one step away.
            </p>
            <button className="user-panel-btn" onClick={() => navigate("/login")}>
              ← Back to Sign In
            </button>
            <button className="user-panel-btn-ghost" onClick={() => navigate("/company-register")}>
              Register a Company
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}