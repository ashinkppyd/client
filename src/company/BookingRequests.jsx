import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./BookingRequests.css";
import { toast } from "react-toastify";

function BookingRequests() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [rating, setRating] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const [bookingRes, waitlistRes] = await Promise.all([
        api.get("company-bookings/"),
        api.get("waitlist/company/"),
      ]);
      setBookings([
        ...bookingRes.data.map((item) => ({ ...item, request_type: "booking" })),
        ...waitlistRes.data.map((item) => ({ ...item, request_type: "waitlist" })),
      ]);
    } catch {
      toast.error("Failed to load bookings ❌");
    }
    setLoading(false);
  };

  const updateStatus = async (item, status) => {
    try {
      if (item.request_type === "waitlist") {
        await api.post(`waitlist/update/${item.id}/`, { status });
        toast.success(`Whitelist ${status} ✅`);
      } else {
        await api.post(`update/${item.id}/`, { status });
        toast.success(`Booking ${status} ✅`);
      }
      fetchBookings();
      setSelectedBooking(null);
    } catch {
      toast.error("Status update failed ❌");
    }
  };

  const markAttendance = async (id, value) => {
    try {
      await api.post(`attendance/${id}/`, { attendance: value });
      toast.success(`Marked ${value} ✅`);
      fetchBookings();
      setSelectedBooking(null);
    } catch {
      toast.error("Attendance failed ❌");
    }
  };

  const submitRating = async (id) => {
    if (!rating) { toast.error("Select rating ❌"); return; }
    try {
      await api.post(`rate/${id}/`, { rating });
      toast.success("Rated successfully ⭐");
      setRating("");
      fetchBookings();
      setSelectedBooking(null);
    } catch {
      toast.error("Rating failed ❌");
    }
  };

  const statusMeta = {
    pending:  { label: "Pending",  icon: "⏳" },
    approved: { label: "Approved", icon: "✅" },
    rejected: { label: "Rejected", icon: "❌" },
  };

  return (
    <div className="br-page">
      {/* Background decorations — identical to CreateSite */}
      <div className="br-blob-tr" />
      <div className="br-blob-bl" />
      <div className="br-dot-grid" />

      <div className="br-inner">

        {/* ── Page header ── */}
        <div className="br-page-header">
          <button className="br-back-btn" onClick={() => navigate("/dashboard")}>
            ← Dashboard
          </button>
          <div className="br-header-badge">📋 Booking Management</div>
          <h1 className="br-page-title">
            Booking <span className="br-gradient-text">Requests</span>
          </h1>
          <p className="br-page-sub">
            Review, approve, and manage your event staffing requests.
          </p>
        </div>

        {/* ── Stats strip ── */}
        {!loading && bookings.length > 0 && (
          <div className="br-stats-strip">
            {[
              { label: "Total",    num: bookings.length,                                          icon: "📋" },
              { label: "Pending",  num: bookings.filter(b => b.status === "pending").length,  icon: "⏳" },
              { label: "Approved", num: bookings.filter(b => b.status === "approved").length, icon: "✅" },
              { label: "Rejected", num: bookings.filter(b => b.status === "rejected").length, icon: "❌" },
            ].map(s => (
              <div className="br-stat-card" key={s.label}>
                <span className="br-stat-icon">{s.icon}</span>
                <span className="br-stat-num">{s.num}</span>
                <span className="br-stat-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div className="br-loading">
            <div className="br-spinner" />
            <p>Loading bookings…</p>
          </div>
        )}

        {/* ── Empty state ── */}
        {!loading && bookings.length === 0 && (
          <div className="br-empty">
            <div className="br-empty-icon">📭</div>
            <h3>No booking requests yet</h3>
            <p>Staffing requests for your events will appear here.</p>
          </div>
        )}

        {/* ── Grid ── */}
        {!loading && bookings.length > 0 && (
          <div className="br-grid">
            {bookings.map((b) => (
              <div key={`${b.request_type}-${b.id}`} className={`br-card status-${b.status}`}>

                {/* Card header */}
                <div className="br-card-top">
                  <span className={`br-status-badge ${b.status}`}>
                    {statusMeta[b.status]?.icon} {statusMeta[b.status]?.label || b.status}
                  </span>
                  <span className="br-card-id">#{b.id}</span>
                </div>

                {b.request_type === "waitlist" && (
                  <div className="br-waitlist-tag">Whitelist Request</div>
                )}

                {/* Position */}
                <div className="br-card-position">
                  {(b.slot_position || b.role)?.replace(/_/g, " ")}
                </div>

                {/* Worker preview */}
                <div className="br-card-worker">
                  <div className="br-worker-avatar">
                    {(b.worker_name || "W")[0].toUpperCase()}
                  </div>
                  <div className="br-worker-info">
                    <span className="br-worker-name">{b.worker_name || "—"}</span>
                    <span className="br-worker-loc">📍 {b.location || "—"}</span>
                  </div>
                  <span className="br-worker-salary">₹{b.salary}</span>
                </div>

                {/* Action */}
                <button className="br-view-btn" onClick={() => setSelectedBooking(b)}>
                  View Details →
                </button>

              </div>
            ))}
          </div>
        )}
      </div>

      {/* ════════════════════════════════
          MODAL
      ════════════════════════════════ */}
      {selectedBooking && (
        <div className="br-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedBooking(null)}>
          <div className="br-modal">

            {/* Modal header */}
            <div className="br-modal-header">
              <div className="br-modal-avatar">
                {(selectedBooking.worker_name || "W")[0].toUpperCase()}
              </div>
              <div className="br-modal-title-wrap">
                <h2>{selectedBooking.worker_name}</h2>
                <span className={`br-status-badge ${selectedBooking.status}`}>
                  {statusMeta[selectedBooking.status]?.icon} {statusMeta[selectedBooking.status]?.label || selectedBooking.status}
                </span>
              </div>
              <button className="br-modal-close-x" onClick={() => setSelectedBooking(null)} aria-label="Close">
                ✕
              </button>
            </div>

            <div className="br-neural-bar" />

            {/* Info grid */}
            <div className="br-modal-body">
              <div className="br-info-grid">
                {[
                  { icon: "📞", label: "Phone",    val: selectedBooking.phone },
                  { icon: "📍", label: "Location", val: selectedBooking.location },
                  { icon: "🎭", label: "Role",     val: (selectedBooking.slot_position || selectedBooking.role)?.replace(/_/g, " ") },
                  { icon: "🪪", label: "Booking",  val: `#${selectedBooking.id}` },
                ].map(row => (
                  <div className="br-info-row" key={row.label}>
                    <span className="br-info-icon">{row.icon}</span>
                    <div>
                      <span className="br-info-label">{row.label}</span>
                      <span className="br-info-val">{row.val || "—"}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Salary highlight */}
              <div className="br-salary-card">
                <span className="br-salary-label">
                  {selectedBooking.request_type === "waitlist" ? "Whitelist" : "Salary"}
                </span>
                <span className="br-salary-amount">₹{selectedBooking.salary}</span>
              </div>

              {/* ── Chat button ── */}
              {selectedBooking.status === "approved" && (
                <button
                  className="br-chat-btn"
                  onClick={() => {
                    if (!selectedBooking.worker_user_id) {
                      toast.error("Worker ID missing ❌"); return;
                    }
                    navigate("/chat", {
                      state: {
                        receiver_id: selectedBooking.worker_user_id,
                        receiver_role: "company",
                        receiver_name: selectedBooking.worker_name,
                      },
                    });
                  }}
                >
                  💬 Chat with Worker
                </button>
              )}

              {/* ── Approve / Reject ── */}
              {selectedBooking.status === "pending" && (
                <div className="br-modal-actions">
                  <button className="br-btn-approve" onClick={() => updateStatus(selectedBooking, "approved")}>
                    ✓ {selectedBooking.request_type === "waitlist" ? "Allow Worker" : "Approve"}
                  </button>
                  <button className="br-btn-reject" onClick={() => updateStatus(selectedBooking, "rejected")}>
                    ✕ Reject
                  </button>
                </div>
              )}

              {/* ── Attendance ── */}
              {selectedBooking.status === "approved" && selectedBooking.attendance === "pending" && (
                <>
                  <div className="br-section-divider">Mark Attendance</div>
                  <div className="br-modal-actions">
                    <button className="br-btn-approve" onClick={() => markAttendance(selectedBooking.id, "present")}>
                      ✓ Present
                    </button>
                    <button className="br-btn-reject" onClick={() => markAttendance(selectedBooking.id, "absent")}>
                      ✕ Absent
                    </button>
                  </div>
                </>
              )}

              {/* ── Rating ── */}
              {selectedBooking.attendance === "present" && (
                <>
                  <div className="br-section-divider">Rate Worker</div>
                  <div className="br-rating-box">
                    <div className="br-star-row">
                      {[5, 4, 3, 2, 1].map(n => (
                        <button
                          key={n}
                          className={`br-star-btn ${parseInt(rating) >= n ? "active" : ""}`}
                          onClick={() => setRating(String(n))}
                        >
                          ★
                        </button>
                      ))}
                    </div>
                    <button
                      className="br-btn-approve"
                      style={{ width: "100%" }}
                      onClick={() => submitRating(selectedBooking.id)}
                    >
                      Submit Rating {rating ? `(${rating}★)` : ""}
                    </button>
                  </div>
                </>
              )}

            </div>

            {/* Close */}
            <div className="br-modal-footer">
              <button className="br-close-btn" onClick={() => setSelectedBooking(null)}>
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}

export default BookingRequests;
