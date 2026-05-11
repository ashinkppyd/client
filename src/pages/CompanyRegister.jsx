import { useState } from "react";
import API from "../api/axios";
import "./CompanyRegister.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function CompanyRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company_name: "",
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
        { ...form, role: "company" },
        { withCredentials: true }
      );

      toast.success("OTP sent to company email 📧");
      navigate("/otp");

    } catch (err) {
      toast.error(err.response?.data?.error || "Error sending OTP");
    }
  };

  return (
    <div className="company-page-wrapper">
      <div className="company-blob-tr" />
      <div className="company-blob-bl" />

      <div className="company-card">

        {/* LEFT — Decorative Panel */}
        <div className="company-panel-side">
          <div className="company-panel-content">
            <div className="company-panel-icon">🏢</div>
            <div className="company-panel-title">Grow your<br />Business</div>
            <p className="company-panel-sub">
              Register your company on SERVIO and connect with skilled professionals ready to work for you.
            </p>
            <button className="company-panel-btn" onClick={() => navigate("/login")}>
              ← Back to Sign In
            </button>
            <button className="company-panel-btn-ghost" onClick={() => navigate("/user-register")}>
              Register as Worker
            </button>
          </div>
        </div>

        {/* RIGHT — Form */}
        <div className="company-form-side">
          <div className="company-logo">
            <div className="company-logo-icon">🍽️</div>
            <span className="company-logo-text">SER<span>VIO</span></span>
          </div>

          <h2>Register Company</h2>
          <p className="company-subheading">Create your business account to get started</p>

          <form onSubmit={handleSubmit}>
            <div className="company-field full">
              <label>Company Name</label>
              <input name="company_name" placeholder="Acme Hospitality Pvt. Ltd." onChange={handleChange} required />
            </div>

            <div className="company-row">
              <div className="company-field">
                <label>Email Address</label>
                <input name="email" type="email" placeholder="company@email.com" onChange={handleChange} required />
              </div>
              <div className="company-field">
                <label>Phone Number</label>
                <input name="phone" placeholder="+91 98765..." onChange={handleChange} required />
              </div>
            </div>

            <div className="company-row-3">
              <div className="company-field">
                <label>State</label>
                <input name="state" placeholder="Kerala" onChange={handleChange} required />
              </div>
              <div className="company-field">
                <label>District</label>
                <input name="district" placeholder="Ernakulam" onChange={handleChange} required />
              </div>
              <div className="company-field">
                <label>Place</label>
                <input name="place" placeholder="Kochi" onChange={handleChange} required />
              </div>
            </div>

            <div className="company-row">
              <div className="company-field">
                <label>Password</label>
                <input name="password" type="password" placeholder="min. 8 chars" onChange={handleChange} required />
              </div>
              <div className="company-field">
                <label>Confirm Password</label>
                <input name="confirm_password" type="password" placeholder="repeat" onChange={handleChange} required />
              </div>
            </div>

            <button type="submit">Send OTP →</button>
          </form>

          <div className="company-footer">
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}>Sign in</span>
          </div>
        </div>

      </div>
    </div>
  );
}