import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import GoogleAuth from "./GoogleAuth";
import "./Login.css";
import { toast } from "react-toastify";
import { getFCMToken } from "../../firebase";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await API.post("/login/", form, {
        withCredentials: true,
      });

      // MFA check
      if (res.data.mfa_required) {
        toast.info("Enter MFA code 🔐");
        navigate("/mfa");
        return;
      }

      const user = res.data.user;

      // Save user info
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Login successful 🎉");

      // Save FCM token
      try {
        const token = await getFCMToken();

        if (token) {
          await API.post(
            "/save-token/",
            { token },
            { withCredentials: true }
          );
        }
      } catch (err) {
        console.log("FCM Error:", err);
      }

      // Role-based redirect
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });

      } else if (user.role === "company") {
        navigate("/company-dashboard", { replace: true });

      } else if (user.role === "worker") {
        navigate("/", { replace: true });

      } else {
        toast.error("Unknown user role");
        navigate("/login");
      }

    } catch (err) {
      toast.error(
        err.response?.data?.error || "Login failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-blob-tr" />
      <div className="login-blob-bl" />

      <div className="login-card">

        {/* LEFT SIDE */}
        <div className="login-form-side">
          <div className="login-logo">
            <div className="login-logo-icon">🍽️</div>
            <span className="login-logo-text">
              SER<span>VIO</span>
            </span>
          </div>

          <h2>Welcome back</h2>
          <p className="login-subheading">
            Sign in to your account to continue
          </p>

          <GoogleAuth />

          <div className="login-divider">
            or sign in with email
          </div>

          <form onSubmit={handleLogin}>
            <div className="input-group">
              <label>Username or Email</label>
              <input
                name="username"
                placeholder="Enter your username or email"
                value={form.username}
                onChange={handleChange}
                required
              />
            </div>

            <div className="input-group">
              <label>
                Password
                <span
                  className="login-forgot"
                  onClick={() =>
                    navigate("/forgot-password")
                  }
                >
                  Forgot password?
                </span>
              </label>

              <input
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Signing In..." : "Sign In →"}
            </button>
          </form>

          <div className="login-footer">
            <span onClick={() => navigate("/user-register")}>
              Create Account
            </span>

            <span onClick={() => navigate("/company-register")}>
              Register Company
            </span>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="login-panel-side">
          <div className="login-panel-content">
            <div className="login-panel-icon">🍽️</div>

            <div className="login-panel-title">
              New to
              <br />
              SERVIO?
            </div>

            <p className="login-panel-sub">
              Set up your account in seconds and connect with
              the best service professionals around you.
            </p>

            <button
              className="login-panel-btn"
              onClick={() => navigate("/user-register")}
            >
              Create Account →
            </button>

            <button
              className="login-panel-btn-ghost"
              onClick={() => navigate("/company-register")}
            >
              Register a Company
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}