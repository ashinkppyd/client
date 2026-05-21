import { useEffect, useState } from "react";
import API from "../../api/axios";
import Sidebar from "../components/Sidebar";
import "../Admin.css";

const initialStats = {
  total_workers: 0,
  total_companies: 0,
  active_workers: 0,
  active_companies: 0,
  blocked_workers: 0,
  blocked_companies: 0,
};

export default function Dashboard() {
  const [stats, setStats] = useState(initialStats);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get("/admin/dashboard/")
      .then((res) => {
        setStats({ ...initialStats, ...res.data });
        setError("");
      })
      .catch(() => {
        setError("Could not load dashboard details.");
      });
  }, []);

  const cards = [
    ["Total Workers", stats.total_workers],
    ["Total Companies", stats.total_companies],
    ["Active Workers", stats.active_workers],
    ["Active Companies", stats.active_companies],
    ["Blocked Workers", stats.blocked_workers],
    ["Blocked Companies", stats.blocked_companies],
  ];

  return (
    <div className="admin-shell">
      <Sidebar />

      <main className="admin-main">
        <div className="admin-page-head">
          <div>
            <h1>Dashboard</h1>
            <p>Live overview of SERVIO workers and companies.</p>
          </div>
        </div>

        {error ? <div className="admin-error">{error}</div> : null}

        <section className="admin-grid">
          {cards.map(([label, value]) => (
            <div className="admin-card" key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
