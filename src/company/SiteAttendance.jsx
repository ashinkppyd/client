import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "./SiteAttendance.css";
import { toast } from "react-toastify";

const SiteAttendance = () => {
  const [sites, setSites] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [selectedSite, setSelectedSite] = useState(null);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [attendance, setAttendance] = useState("");
  const [rating, setRating] = useState("");
  const [loadingWorkers, setLoadingWorkers] = useState(false);

  useEffect(() => { fetchSites(); }, []);

  const fetchSites = async () => {
    try {
      const res = await api.get("my-sites/");
      setSites(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load sites ❌");
    }
  };

  const loadWorkers = async (site) => {
    setLoadingWorkers(true);
    try {
      const res = await api.get(`site-report/${site.id}/`);
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.workers || res.data.data || [];
      setWorkers(data);
      setSelectedSite(site);
    } catch {
      toast.error("Failed to load workers ❌");
    }
    setLoadingWorkers(false);
  };

  const openWorker = (worker) => {
    setSelectedWorker(worker);
    setAttendance(worker.attendance || "pending");
    setRating(worker.rating || "");
  };

  const handleSubmit = async () => {
    if (!attendance) { toast.error("Select attendance ❌"); return; }
    try {
      await api.patch(`booking-update/${selectedWorker.booking_id}/`, {
        attendance,
        rating: attendance === "present" ? rating : null,
      });
      toast.success("Updated successfully ✅");
      loadWorkers(selectedSite);
      setSelectedWorker(null);
    } catch (err) {
      console.log(err.response?.data);
      toast.error("Update failed ❌");
    }
  };

  const removeWorker = async () => {
    if (!window.confirm(`Remove ${selectedWorker.worker_name} from this site?`)) return;

    try {
      await api.post(`update/${selectedWorker.booking_id}/`, { status: "rejected" });
      toast.success("Worker removed successfully ✅");
      loadWorkers(selectedSite);
      setSelectedWorker(null);
    } catch (err) {
      console.log(err.response?.data);
      toast.error("Remove worker failed ❌");
    }
  };

  const attendanceMeta = {
    present: { label: "Present", icon: "✅", cls: "present" },
    absent:  { label: "Absent",  icon: "❌", cls: "absent"  },
    pending: { label: "Pending", icon: "⏳", cls: "pending" },
  };

  const presentCount = workers.filter(w => w.attendance === "present").length;
  const absentCount  = workers.filter(w => w.attendance === "absent").length;
  const pendingCount = workers.filter(w => !w.attendance || w.attendance === "pending").length;

  return (
    <div className="sa-page">
      <div className="sa-blob-tr" />
      <div className="sa-blob-bl" />
      <div className="sa-dot-grid" />

      <div className="sa-inner">

        {/* ── Page header ── */}
        <div className="sa-page-header">
          {selectedSite && (
            <button className="sa-back-btn" onClick={() => { setSelectedSite(null); setWorkers([]); }}>
              ← Back to Sites
            </button>
          )}
          <div className="sa-header-badge">
            {selectedSite ? "📍 " + selectedSite.name : "📍 Site Attendance"}
          </div>
          <h1 className="sa-page-title">
            {selectedSite
              ? <><span className="sa-gradient-text">Workers</span> on Site</>
              : <>Site <span className="sa-gradient-text">Attendance</span></>}
          </h1>
          <p className="sa-page-sub">
            {selectedSite
              ? `Manage attendance and ratings for ${selectedSite.name}.`
              : "Select a site to manage worker attendance and ratings."}
          </p>
        </div>

        {/* ══════════════ SITES VIEW ══════════════ */}
        {!selectedSite && (
          <>
            {sites.length === 0 ? (
              <div className="sa-empty">
                <div className="sa-empty-icon">🏗️</div>
                <h3>No sites found</h3>
                <p>Your created event sites will appear here.</p>
              </div>
            ) : (
              <div className="sa-sites-grid">
                {sites.map((site) => (
                  <div key={site.id} className="sa-site-card" onClick={() => loadWorkers(site)}>
                    <div className="sa-site-card-top">
                      <div className="sa-site-icon">🎪</div>
                      <span className="sa-site-arrow">→</span>
                    </div>
                    <div className="sa-site-name">{site.name}</div>
                    <div className="sa-site-meta">
                      {site.location && <span>📍 {site.location}</span>}
                      {site.date     && <span>📅 {new Date(site.date).toLocaleDateString("en-GB", { day:"numeric", month:"short" })}</span>}
                    </div>
                    <div className="sa-site-cta">View Workers →</div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* ══════════════ WORKERS VIEW ══════════════ */}
        {selectedSite && (
          <>
            {/* Stats strip */}
            {workers.length > 0 && (
              <div className="sa-stats-strip">
                {[
                  { icon: "👥", num: workers.length, lbl: "Total"   },
                  { icon: "✅", num: presentCount,   lbl: "Present" },
                  { icon: "❌", num: absentCount,    lbl: "Absent"  },
                  { icon: "⏳", num: pendingCount,   lbl: "Pending" },
                ].map(s => (
                  <div className="sa-stat-card" key={s.lbl}>
                    <span className="sa-stat-icon">{s.icon}</span>
                    <span className="sa-stat-num">{s.num}</span>
                    <span className="sa-stat-lbl">{s.lbl}</span>
                  </div>
                ))}
              </div>
            )}

            {loadingWorkers && (
              <div className="sa-loading">
                <div className="sa-spinner" />
                <p>Loading workers…</p>
              </div>
            )}

            {!loadingWorkers && workers.length === 0 && (
              <div className="sa-empty">
                <div className="sa-empty-icon">👷</div>
                <h3>No workers assigned</h3>
                <p>Workers booked for this site will appear here.</p>
              </div>
            )}

            {!loadingWorkers && workers.length > 0 && (
              <div className="sa-workers-grid">
                {workers.map((w) => {
                  const att = w.attendance || "pending";
                  const meta = attendanceMeta[att] || attendanceMeta.pending;
                  return (
                    <div
                      key={w.booking_id}
                      className={`sa-worker-card att-${meta.cls}`}
                      onClick={() => openWorker(w)}
                    >
                      <div className="sa-worker-card-top">
                        <div className="sa-worker-avatar">
                          {(w.worker_name || "W")[0].toUpperCase()}
                        </div>
                        <span className={`sa-att-badge ${meta.cls}`}>
                          {meta.icon} {meta.label}
                        </span>
                      </div>

                      <div className="sa-worker-name">{w.worker_name}</div>
                      <div className="sa-worker-role">{w.role?.replace(/_/g, " ")}</div>

                      <div className="sa-worker-details">
                        <span>📞 {w.phone}</span>
                        <span>📍 {w.location}</span>
                        <span>💰 ₹{w.salary || 0}</span>
                        {w.rating && <span>⭐ {w.rating}/5</span>}
                      </div>

                      <div className="sa-worker-edit-hint">Tap to update →</div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>

      {/* ══════════════ MODAL ══════════════ */}
      {selectedWorker && (
        <div className="sa-overlay" onClick={(e) => e.target === e.currentTarget && setSelectedWorker(null)}>
          <div className="sa-modal">

            {/* Modal header */}
            <div className="sa-modal-header">
              <div className="sa-modal-avatar">
                {(selectedWorker.worker_name || "W")[0].toUpperCase()}
              </div>
              <div className="sa-modal-title-wrap">
                <h2>{selectedWorker.worker_name}</h2>
                <span className="sa-modal-role">{selectedWorker.role?.replace(/_/g, " ")}</span>
              </div>
              <button className="sa-modal-close-x" onClick={() => setSelectedWorker(null)}>✕</button>
            </div>

            <div className="sa-neural-bar" />

            <div className="sa-modal-body">

              {/* Info grid */}
              <div className="sa-info-grid">
                {[
                  { icon: "📞", label: "Phone",    val: selectedWorker.phone },
                  { icon: "📍", label: "Location", val: selectedWorker.location },
                  { icon: "💰", label: "Salary",   val: `₹${selectedWorker.salary}` },
                  { icon: "🎭", label: "Role",     val: selectedWorker.role?.replace(/_/g, " ") },
                ].map(row => (
                  <div className="sa-info-row" key={row.label}>
                    <span className="sa-info-icon">{row.icon}</span>
                    <div>
                      <span className="sa-info-label">{row.label}</span>
                      <span className="sa-info-val">{row.val || "—"}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Attendance toggle */}
              <div className="sa-section-divider">Mark Attendance</div>
              <div className="sa-att-toggle">
                {["present", "absent", "pending"].map(opt => (
                  <button
                    key={opt}
                    className={`sa-att-opt ${opt} ${attendance === opt ? "selected" : ""}`}
                    onClick={() => setAttendance(opt)}
                  >
                    {attendanceMeta[opt].icon} {attendanceMeta[opt].label}
                  </button>
                ))}
              </div>

              {/* Star rating */}
              {attendance === "present" && (
                <>
                  <div className="sa-section-divider">Rate Worker</div>
                  <div className="sa-star-row">
                    {[5, 4, 3, 2, 1].map(n => (
                      <button
                        key={n}
                        className={`sa-star-btn ${parseInt(rating) >= n ? "active" : ""}`}
                        onClick={() => setRating(String(n))}
                      >★</button>
                    ))}
                  </div>
                  {rating && (
                    <div className="sa-rating-display">{rating} / 5 stars selected</div>
                  )}
                </>
              )}

            </div>

            {/* Footer */}
            <div className="sa-modal-footer">
              <button className="sa-save-btn" onClick={handleSubmit}>
                Save Changes
              </button>
              <button className="sa-remove-btn" onClick={removeWorker}>
                Remove Worker
              </button>
              <button className="sa-close-btn" onClick={() => setSelectedWorker(null)}>
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default SiteAttendance;
