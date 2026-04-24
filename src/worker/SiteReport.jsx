import { useEffect, useState } from "react";
import api from "../api/axios";
import "./SiteReport.css";

function SiteReport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("report/").then((res) => setData(res.data));
  }, []);

  
  const totalEarnings = data.reduce((acc, curr) => acc + (parseFloat(curr.salary) || 0), 0);

  return (
    <div className="report-page">
      <div className="report-header">
        <div className="header-text">
          <h2>Work History</h2>
          <p>Track your completed events and earnings</p>
        </div>
        <div className="total-earnings-card">
          <span>Total Earnings</span>
          <h3>₹{totalEarnings.toLocaleString('en-IN')}</h3>
        </div>
      </div>

      <div className="report-grid">
        {data.length === 0 ? (
          <div className="no-reports">No work history found yet.</div>
        ) : (
          data.map((r, i) => (
            <div key={i} className="report-card">
              <div className="report-card-top">
                <span className="event-label">Event / Site</span>
                <span className={`status-pill ${r.status.toLowerCase()}`}>
                  {r.status}
                </span>
              </div>
              
              <h3 className="site-name">{r.site}</h3>
              
              <div className="report-details">
                <div className="detail-item">
                  <span className="label">Your Role</span>
                  <span className="value">{r.role.replace("_", " ")}</span>
                </div>
                <div className="detail-item salary-item">
                  <span className="label">Payment</span>
                  <span className="value earnings">₹{r.salary}</span>
                </div>
              </div>
              
              <div className="report-footer">
                <span className="verified-check">🛡️ Verified by Servio</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default SiteReport;