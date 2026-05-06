import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import NotificationBell from "./NotificationBell"; 
import "./Navbar.css";

export default function Navbar() {
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    API.get("/me/", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch(() => {
        setUser(null);
      });
  }, [location.pathname]);

  return (
    <nav className="navbar">
      <h2 className="logo">SERVIO</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/ai-service" className="ai-nav-link">AI Service</Link>

        
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/company-register">Company Register</Link>
          </>
        )}

        
        {user && (
          <div className="nav-right">
            
           
            {user.role === "worker" && (
              <>
                <Link to="/sites">Sites</Link>
                <Link to="/site-report">Site Report</Link>
                <Link to="/payment-report">Payment Report</Link>
              </>
            )}

            
            {user.role === "company" && (
              <>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/create-site">Create Site</Link>
                <Link to="/bookings">Bookings</Link>
                <Link to="/site-attendance">Site Attendance</Link>
              </>
            )}

            
            <Link to="/chat">💬 Chat</Link>

            
            <NotificationBell />

            
            <Link to="/profile" className="profile-link">
              {user.profile_image ? (
                <img
                  src={`http://127.0.0.1:8000${user.profile_image}`}
                  alt="profile"
                  className="nav-profile-img"
                />
              ) : (
                "👤"
              )}
              {user.username}
            </Link>

          </div>
        )}
      </div>
    </nav>
  );
}
