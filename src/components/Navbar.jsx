import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import NotificationBell from "./NotificationBell";
import "./Navbar.css";

function LogoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M7 3v8M11 3v8M7 7h4M9 11v10M16 3v8a3 3 0 0 0 3 3V3"
        fill="none"
        stroke="#ffffff"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ChatIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.8 8.8 0 0 1-3.9-.9L3 20l1.3-4.3a8.2 8.2 0 0 1-.9-3.8 8.4 8.4 0 0 1 8.5-8.4 8.5 8.5 0 0 1 9.1 8Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20 21a8 8 0 0 0-16 0M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function Navbar() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    API.get("/me/", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, [location.pathname]);

  return (
    <nav className="navbar">

      {/* Logo */}
      <h2 className="logo">
        <span className="logo-icon"><LogoIcon /></span>
        SER<span>VIO</span>
      </h2>

      {/* Centre Links */}
      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/ai-service" className="ai-nav-link">AI Service</Link>

        {user?.role === "worker" && (
          <>
            <Link to="/sites">Sites</Link>
            <Link to="/site-report">Site Report</Link>
            <Link to="/payment-report">Payment Report</Link>
          </>
        )}

        {user?.role === "company" && (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/create-site">Create Site</Link>
            <Link to="/bookings">Bookings</Link>
            <Link to="/site-attendance">Site Attendance</Link>
          </>
        )}

        {user && (
          <Link to="/chat">
            <ChatIcon />
            Chat
          </Link>
        )}
      </div>

      {/* Right Side */}
      <div className="nav-right">
        {!user ? (
          <>
            <Link to="/login" className="login-link">Login</Link>
            <Link to="/company-register" className="register-btn">Company Register</Link>
          </>
        ) : (
          <>
            <NotificationBell />
            <Link to="/profile" className="profile-link">
              {user.profile_image ? (
                <img
                  src={`http://127.0.0.1:8000${user.profile_image}`}
                  alt="profile"
                  className="nav-profile-img"
                />
              ) : (
                <UserIcon />
              )}
              {user.username}
            </Link>
          </>
        )}
      </div>

    </nav>
  );
}
