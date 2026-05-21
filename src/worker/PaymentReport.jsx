import { useEffect, useState } from "react";
import api from "../api/axios";
import "./PaymentReport.css";

function PaymentReport() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api.get("payments/").then((res) => setData(res.data));
  }, []);

  const totalPaid = data
    .filter((p) => p.status.toLowerCase() === "paid")
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  const pendingAmount = data
    .filter((p) => p.status.toLowerCase() === "pending")
    .reduce((acc, curr) => acc + (parseFloat(curr.amount) || 0), 0);

  const paidCount    = data.filter((p) => p.status.toLowerCase() === "paid").length;
  const pendingCount = data.filter((p) => p.status.toLowerCase() === "pending").length;

  return (
    <div className="payment-page">
      {/* Background blobs */}
      <div className="pp-blob-tr" />
      <div className="pp-blob-bl" />

      {/* ── Hero Band ─────────────────────────────── */}
      <div className="payment-hero-band">
        <div className="payment-hero-inner">
          <div className="payment-hero-left">
            <div className="payment-section-pill">
              <span className="pill-dot" />
              Financial Overview
            </div>

            <h1>
              Earnings <br />
              <span>Ledger</span>
            </h1>

            <p>
              A detailed breakdown of every payment — received, pending, and
              settled — for your work across all events.
            </p>
          </div>

          <div className="payment-hero-right">
            <div className="balance-card received">
              <span className="balance-card-label">Total Received</span>
              <span className="balance-card-amount">
                ₹{totalPaid.toLocaleString("en-IN")}
              </span>
              <span className="balance-card-sub">
                {paidCount} transaction{paidCount !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="balance-card pending-bal">
              <span className="balance-card-label">Pending Settlement</span>
              <span className="balance-card-amount">
                ₹{pendingAmount.toLocaleString("en-IN")}
              </span>
              <span className="balance-card-sub">
                {pendingCount} awaiting
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────── */}
      <div className="payment-content">
        <div className="ledger-section-header">
          <span className="ledger-section-label">✦ Transaction History</span>
          {data.length > 0 && (
            <span className="ledger-count">
              {data.length} record{data.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        <div className="ledger-container">
          {data.length === 0 ? (
            <div className="empty-ledger">
              <span className="empty-ledger-icon">💳</span>
              <p>No payment transactions found.</p>
              <span>Payments will appear here once your bookings are processed.</span>
            </div>
          ) : (
            <>
              {/* Table header */}
              <div className="ledger-header-row">
                <span>Event · Site</span>
                <span>Role</span>
                <span>Status</span>
                <span style={{ textAlign: "right" }}>Amount</span>
              </div>

              {/* Rows */}
              <div className="ledger-list">
                {data.map((p, i) => (
                  <div key={i} className="ledger-row">
                    <div className="site-info">
                      <span className="site-name">{p.site}</span>
                      <span className="transaction-id">TXN #{String(i + 100).padStart(4, "0")}</span>
                    </div>

                    <span className="role-text">
                      {p.role.replace(/_/g, " ")}
                    </span>

                    <div className="status-col">
                      <span className={`status-pill ${p.status.toLowerCase()}`}>
                        {p.status}
                      </span>
                    </div>

                    <span className={`amount-text ${p.status.toLowerCase()}`}>
                      ₹{parseFloat(p.amount).toLocaleString("en-IN")}
                    </span>
                  </div>
                ))}
              </div>

              {/* Footer totals bar */}
              <div className="ledger-footer-bar">
                <div className="lf-item">
                  <span className="lf-label">Received</span>
                  <span className="lf-amount green">
                    ₹{totalPaid.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="lf-divider" />
                <div className="lf-item">
                  <span className="lf-label">Pending</span>
                  <span className="lf-amount amber">
                    ₹{pendingAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="lf-divider" />
                <div className="lf-item">
                  <span className="lf-label">Total</span>
                  <span className="lf-amount green">
                    ₹{(totalPaid + pendingAmount).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentReport;