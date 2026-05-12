import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./WorkerSites.css";
import { toast } from "react-toastify";

function WorkerSites() {
  const [sites, setSites] = useState([]);
  const [bookingMap, setBookingMap] = useState({});
  const [loading, setLoading] = useState(false);
  const [applyingId, setApplyingId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    setLoading(true);
    try {
      const res = await api.get("all-sites/");
      setSites(res.data.sites || []);
      setBookingMap(res.data.user_bookings || {});
    } catch (err) {
      console.log("ERROR:", err.response?.data);
      toast.error("Failed to load sites ❌");
    }
    setLoading(false);
  };

  const hasActiveBooking = (siteDate) =>
    Object.entries(bookingMap).some(([slotId, status]) => {
      if (status !== "pending" && status !== "approved") return false;
      if (!siteDate) return true;

      return sites.some(
        (site) =>
          site.date === siteDate &&
          site.slots?.some((slot) => String(slot.id) === String(slotId))
      );
    });

  const apply = async (slotId) => {
    const site = sites.find((item) =>
      item.slots?.some((slot) => slot.id === slotId)
    );

    if (site && hasActiveBooking(site.date)) {
      toast.error("You can only apply for one role on the same day ❌");
      return;
    }
    setApplyingId(slotId);
    try {
      await api.post("apply/", { slot: slotId });
      toast.success("Application Sent! ✅");
      fetchSites();
    } catch (err) {
      toast.error(err.response?.data?.error || "Application failed ❌");
    }
    setApplyingId(null);
  };

  const getButtonLabel = (slot) => {
    const status = bookingMap[slot.id];
    if (status === "pending")  return { icon: "⏳", text: "Pending Review" };
    if (status === "approved") return { icon: "✓",  text: "Approved" };
    if (status === "rejected") return { icon: "✕",  text: "Rejected" };
    return slot.available_slots > 0
      ? { icon: "→", text: "Apply Now" }
      : { icon: "—", text: "Position Full" };
  };

  const isDisabled = (slot) => {
    const status = bookingMap[slot.id];
    return (
      slot.available_slots <= 0 ||
      applyingId === slot.id ||
      status === "pending" ||
      status === "approved" ||
      hasActiveBooking(slot.site_date)
    );
  };

  // Count active slots across all sites
  const totalOpenSlots = sites.reduce(
    (acc, site) =>
      acc + (site.slots?.reduce((s, sl) => s + (sl.available_slots || 0), 0) || 0),
    0
  );

  const formatDate = (dateStr) => {
    if (!dateStr) return { day: "—", month: "" };
    const d = new Date(dateStr);
    return {
      day: d.toLocaleDateString("en-GB", { day: "numeric" }),
      month: d.toLocaleDateString("en-GB", { month: "short" }).toUpperCase(),
    };
  };

  return (
    <div className="worker-sites-page">
      {/* Background blobs */}
      <div className="ws-blob-tr" />
      <div className="ws-blob-bl" />

      {/* ── Hero Band ─────────────────────────────── */}
      <div className="worker-hero-band">
        <div className="hero-band-inner">
          <div className="hero-band-left">
            <div className="hero-section-pill">
              <span className="pill-dot" />
              Live Opportunities
            </div>

            <h1>
              Find Your Next <br />
              <span>Event Role</span>
            </h1>

            <p>
              Browse open positions across upcoming events and apply instantly.
              Get hired by top companies in the events industry.
            </p>

            <div className="hero-stat-chips">
              <div className="stat-chip">
                <span className="stat-chip-num">{sites.length}</span>
                <span className="stat-chip-lbl">Events</span>
              </div>
              <div className="stat-chip">
                <span className="stat-chip-num">{totalOpenSlots}</span>
                <span className="stat-chip-lbl">Open Slots</span>
              </div>
              <div className="stat-chip">
                <span className="stat-chip-num">
                  {hasActiveBooking() ? "1" : "0"}
                </span>
                <span className="stat-chip-lbl">Applied</span>
              </div>
            </div>
          </div>

          {hasActiveBooking() && (
            <div className="hero-band-right">
              <div className="active-booking-card">
                <span className="abc-icon">📋</span>
                <div className="abc-text">
                  <strong>Application Active</strong>
                  <span>You have a pending or approved application</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── Main Content ──────────────────────────── */}
      <div className="ws-content">
        {loading && (
          <div className="ws-loading">
            <div className="ws-loading-spinner" />
            <p>Loading opportunities…</p>
          </div>
        )}

        {!loading && sites.length === 0 && (
          <div className="ws-empty">
            <span className="ws-empty-icon">🔍</span>
            <p>No available opportunities right now. Check back soon!</p>
          </div>
        )}

        <div className="sites-container">
          {sites.map((site) => {
            const { day, month } = formatDate(site.date);
            const siteOpenSlots = site.slots?.reduce(
              (s, sl) => s + (sl.available_slots || 0),
              0
            ) || 0;

            return (
              <div key={site.id} className="job-site-group">
                {/* Site Header */}
                <div className="site-info-header">
                  <div className="title-box">
                    <h3>{site.name}</h3>
                    <div className="site-meta-row">
                      <span className="site-location">
                        📍 {site.location || "Location TBD"}
                      </span>
                      <span className="site-slots-count">
                        ✦ {siteOpenSlots} slot{siteOpenSlots !== 1 ? "s" : ""} open
                      </span>
                    </div>
                  </div>

                  <div className="date-tag">
                    <span className="date-day">{day}</span>
                    <span className="date-month">{month}</span>
                  </div>
                </div>

                {/* Slot Cards */}
                <div className="job-slots-grid">
                  {site.slots?.map((slot) => {
                    const slotWithDate = { ...slot, site_date: site.date };
                    const status = bookingMap[slot.id];
                    const { icon, text } = getButtonLabel(slotWithDate);
                    const isAvail = slot.available_slots > 0;

                    return (
                      <div key={slot.id} className="job-slot-card">
                        {/* Top row */}
                        <div className="slot-main">
                          <span className="position-name">
                            {slot.position.replace(/_/g, " ")}
                          </span>
                          <span
                            className={`availability-pill ${isAvail ? "available" : "full"}`}
                          >
                            <span className="avail-dot" />
                            {isAvail
                              ? `${slot.available_slots} left`
                              : "Full"}
                          </span>
                        </div>

                        <div className="card-divider" />

                        {/* Approved banner */}
                        {status === "approved" && (
                          <div className="approved-banner">
                            <span>🎉 You're hired for this role!</span>
                          </div>
                        )}

                        {/* Apply Button */}
                        <button
                          className={`apply-btn ${status || ""}`}
                          onClick={() => apply(slot.id)}
                          disabled={isDisabled(slotWithDate)}
                        >
                          {applyingId === slot.id ? (
                            "Applying…"
                          ) : (
                            <>
                              <span className="btn-icon">{icon}</span>
                              {text}
                            </>
                          )}
                        </button>

                        {/* Chat Button */}
                        {status === "approved" && (
                          <button
                            className="chat-btn"
                            onClick={() =>
                              navigate("/chat", {
                                state: {
                                  receiver_id: site.company,
                                  receiver_role: "worker",
                                },
                              })
                            }
                          >
                            💬 Chat with Company
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default WorkerSites;
