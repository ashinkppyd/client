import { NavLink } from "react-router-dom";
import "../Admin.css";

export default function Sidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-brand">
        <span className="admin-brand-mark">S</span>
        <div>
          <strong>SERVIO</strong>
          <small>Admin</small>
        </div>
      </div>

      <nav className="admin-nav">
        <NavLink to="/admin/dashboard">Dashboard</NavLink>
        <NavLink to="/admin/workers">Workers</NavLink>
        <NavLink to="/admin/companies">Companies</NavLink>
      </nav>
    </aside>
  );
}
