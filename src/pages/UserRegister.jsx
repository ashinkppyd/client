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
  const [fieldErrors, setFieldErrors] = useState({});

  const toFieldErrors = (data) => {
    if (!data || typeof data !== "object") return {};
    const next = {};

    Object.keys(data).forEach((key) => {
      if (["error", "detail", "message", "non_field_errors"].includes(key)) return;
      const value = data[key];
      if (Array.isArray(value) && value.length) next[key] = value[0];
      else if (typeof value === "string") next[key] = value;
    });

    return next;
  };

  const handleChange = (e) => {
    if (fieldErrors[e.target.name]) {
      setFieldErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    }
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFieldErrors({});

    try {
      await API.post("/send-otp/", { ...form, role: "worker" }, { withCredentials: true });
      toast.success("OTP sent to your email 📧");
      navigate("/otp");
    } catch (err) {
      const errors = toFieldErrors(err.response?.data);
      if (Object.keys(errors).length) setFieldErrors(errors);
      toast.error(err.response?.data?.error || "Error sending OTP");
    }
  };

  return (
    <div className="user-page-wrapper">
      <div className="user-blob-tr" />
      <div className="user-blob-bl" />

      <div className="user-card">
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
                <input name="username" placeholder="username" onChange={handleChange} required />
                {fieldErrors.username ? <small className="user-field-error">{fieldErrors.username}</small> : null}
              </div>
              <div className="user-field">
                <label>Phone Number</label>
                <input name="phone" placeholder="phone" onChange={handleChange} required />
                {fieldErrors.phone ? <small className="user-field-error">{fieldErrors.phone}</small> : null}
              </div>
            </div>

            <div className="user-field full">
              <label>Email Address</label>
              <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
              {fieldErrors.email ? <small className="user-field-error">{fieldErrors.email}</small> : null}
            </div>

            <div className="user-row-3">
              <div className="user-field">
                <label>State</label>
                <input name="state" placeholder="State" onChange={handleChange} required />
                {fieldErrors.state ? <small className="user-field-error">{fieldErrors.state}</small> : null}
              </div>
              <div className="user-field">
                <label>District</label>
                <input name="district" placeholder="District" onChange={handleChange} required />
                {fieldErrors.district ? <small className="user-field-error">{fieldErrors.district}</small> : null}
              </div>
              <div className="user-field">
                <label>Place</label>
                <input name="place" placeholder="Place" onChange={handleChange} required />
                {fieldErrors.place ? <small className="user-field-error">{fieldErrors.place}</small> : null}
              </div>
            </div>

            <div className="user-row">
              <div className="user-field">
                <label>Password</label>
                <input name="password" type="password" placeholder="min. 8 chars" onChange={handleChange} required />
                {fieldErrors.password ? <small className="user-field-error">{fieldErrors.password}</small> : null}
              </div>
              <div className="user-field">
                <label>Confirm Password</label>
                <input name="confirm_password" type="password" placeholder="repeat" onChange={handleChange} required />
                {fieldErrors.confirm_password ? <small className="user-field-error">{fieldErrors.confirm_password}</small> : null}
              </div>
            </div>

            <button type="submit">Send OTP →</button>
          </form>

          <div className="user-footer">
            Already have an account? <span onClick={() => navigate("/login")}>Sign in</span>
          </div>
        </div>

        <div className="user-panel-side">
          <div className="user-panel-content">
            <div className="user-panel-icon">👤</div>
            <div className="user-panel-title">Join the<br />SERVIO Family</div>
            <p className="user-panel-sub">
              Thousands of professionals are already finding great opportunities. Your next job is one step away.
            </p>
            <button className="user-panel-btn" onClick={() => navigate("/login")}>← Back to Sign In</button>
            <button className="user-panel-btn-ghost" onClick={() => navigate("/company-register")}>Register a Company</button>
          </div>
        </div>
      </div>
    </div>
  );
}
