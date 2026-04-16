import { Link, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/axios";
import "./Navbar.css";
import { toast } from "react-toastify";

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

  const handleLogout = async () => {
    try {
      await API.post("/logout/", {}, { withCredentials: true });
      setUser(null);
      toast.success("Logged out successfully 👋");

     
      window.location.href = "/login";

    } catch (err) {
      toast.error("Logout failed ❌");
    }
  };

  return (
    <nav className="navbar">
      <h2 className="logo">SERVIO</h2>

      <div className="nav-links">
        <Link to="/">Home</Link>

        
        {!user && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/company-register">Company Register</Link>
          </>
        )}

        
        {user && (
          <>
            
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
              </>
            )}

           
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

            
          </>
        )}
      </div>
    </nav>
  );
}