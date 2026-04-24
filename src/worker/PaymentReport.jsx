import { useEffect, useState } from "react";
import api from "../api/axios";
import "./PaymentReport.css";

function PaymentReport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("payments/").then((res) => setData(res.data));
  }, []);

  const totalPaid = data
    .filter(p => p.status.toLowerCase() === "paid")
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  const pendingAmount = data
    .filter(p => p.status.toLowerCase() === "pending")
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  return (
    <div className="payment-page">
      <div className="payment-header">
        <div className="title-area">
          <h2>Earnings Ledger</h2>
          <p>Detailed breakdown of your service payments</p>
        </div>
        
        <div className="balance-summary">
          <div className="summary-item paid">
            <small>Total Received</small>
            <h3>₹{totalPaid.toLocaleString('en-IN')}</h3>
          </div>
          <div className="summary-item pending">
            <small>Pending Settlement</small>
            <h3>₹{pendingAmount.toLocaleString('en-IN')}</h3>
          </div>
        </div>
      </div>

      <div className="ledger-container">
        {data.length === 0 ? (
          <div className="empty-ledger">No payment transactions found.</div>
        ) : (
          <div className="ledger-list">
            <div className="ledger-row header">
              <span>Event / Site</span>
              <span>Role</span>
              <span>Status</span>
              <span>Amount</span>
            </div>
            
            {data.map((p, i) => (
              <div key={i} className="ledger-row">
                <div className="site-info">
                  <span className="site-name">{p.site}</span>
                  <span className="transaction-id">ID: #{i + 100}</span>
                </div>
                <span className="role-text">{p.role.replace("_", " ")}</span>
                <div className="status-col">
                  <span className={`status-pill ${p.status.toLowerCase()}`}>
                    {p.status}
                  </span>
                </div>
                <span className={`amount-text ${p.status.toLowerCase()}`}>
                  ₹{p.amount}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PaymentReport;