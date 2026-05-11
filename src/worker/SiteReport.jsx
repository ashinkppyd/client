import { useEffect, useState } from "react";
import api from "../api/axios";
import "./SiteReport.css";

function SiteReport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("report/").then((res) => setData(res.data));
  }, []);

  const totalEarnings = data.reduce(
    (acc, curr) => acc + (parseFloat(curr.salary) || 0),
    0
  );

  const completedCount = data.filter(
    (r) => r.status?.toLowerCase() === "completed"
  ).length;

  const pendingCount = data.filter(
    (r) => r.status?.toLowerCase() === "pending"
  ).length;

  return (
    <div className="report-page">
      {/* Background blobs */}
      <div className="rp-blob-tr" />
      <div className="rp-blob-bl" />

      {/* ── Hero Band ─────────────────────────────── */}
      <div className="report-hero-band">
        <div className="report-hero-inner">
          <div className="report-hero-left">
            <div className="report-section-pill">
              <span className="pill-dot" />
              Earnings Overview
            </div>

            <h1>
              Your Work <br />
              <span>History</span>
            </h1>

            <p>
              A full record of your completed events, roles, and payments —
              all verified by Servio.
            </p>

            <div className="report-summary-chips">
              <div className="rsc">
                <span className="rsc-num">{data.length}</span>
                <span className="rsc-lbl">Total Jobs</span>
              </div>
              <div className="rsc">
                <span className="rsc-num">{completedCount}</span>
                <span className="rsc-lbl">Completed</span>
              </div>
              <div className="rsc">
                <span className="rsc-num">{pendingCount}</span>
                <span className="rsc-lbl">Pending</span>
              </div>
            </div>
          </div>

          <div className="report-hero-right">
            <div className="total-earnings-card">
              <span className="earnings-label">Total Earnings</span>
              <span className="earnings-amount">
                ₹{totalEarnings.toLocaleString("en-IN")}
              </span>
              <span className="earnings-sub">
                Across {data.length} event{data.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────── */}
      <div className="report-content">
        <div className="report-section-header">
          <span className="report-section-label">✦ Event Records</span>
          {data.length > 0 && (
            <span className="report-count-badge">
              {data.length} record{data.length !== 1 ? "s" : ""} found
            </span>
          )}
        </div>

        <div className="report-grid">
          {data.length === 0 ? (
            <div className="no-reports">
              <span className="no-reports-icon">📋</span>
              <p>No work history found yet.</p>
              <span style={{ fontSize: 13, opacity: 0.7 }}>
                Completed events will appear here once approved.
              </span>
            </div>
          ) : (
            data.map((r, i) => (
              <div key={i} className="report-card">
                {/* Top */}
                <div className="report-card-top">
                  <span className="event-label">Event · Site</span>
                  <span className={`status-pill ${r.status?.toLowerCase()}`}>
                    {r.status}
                  </span>
                </div>

                {/* Site name */}
                <h3 className="site-name">{r.site}</h3>

                {/* Details row */}
                <div className="report-details">
                  <div className="detail-item">
                    <span className="label">Your Role</span>
                    <span className="value">{r.role.replace(/_/g, " ")}</span>
                  </div>
                  <div className="detail-divider" />
                  <div className="detail-item">
                    <span className="label">Payment</span>
                    <span className="value earnings">₹{r.salary}</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="report-footer">
                  <span className="verified-check">🛡️ Verified by Servio</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default SiteReport;