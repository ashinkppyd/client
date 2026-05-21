import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

/* ── Event type colour palette — used on site cards ── */
const SITE_PALETTES = [
  { from: "#41C187", to: "#2da96e", accent: "#e8faf2" },
  { from: "#6BD0CC", to: "#3aafab", accent: "#e6f9f8" },
  { from: "#2da96e", to: "#1a7a4e", accent: "#e0f5ea" },
  { from: "#98E5C3", to: "#41C187", accent: "#f0faf4" },
  { from: "#4a9ade", to: "#2d7ab5", accent: "#e8f2fb" },
  { from: "#a78bfa", to: "#7c3aed", accent: "#f0ebff" },
];

function getPalette(idx) { return SITE_PALETTES[idx % SITE_PALETTES.length]; }

function Dashboard() {
  const [sites,        setSites]        = useState([]);
  const [bookings,     setBookings]     = useState([]);
  const [loading,      setLoading]      = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [filterSlot,   setFilterSlot]   = useState(null);
  const navigate = useNavigate();

  useEffect(() => { fetchSites(); fetchBookings(); }, []);

  const fetchSites = async () => {
    setLoading(true);
    try { const r = await api.get("my-sites/"); setSites(r.data); }
    catch (e) { console.log(e.response?.data); }
    setLoading(false);
  };

  const fetchBookings = async () => {
    try { const r = await api.get("company-bookings/"); setBookings(r.data); }
    catch (e) { console.log(e.response?.data); }
  };

  const updateStatus = async (id, status) => {
    try { await api.post(`booking/update/${id}/`, { status }); fetchBookings(); fetchSites(); }
    catch (e) { console.log(e.response?.data); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this site? This action cannot be undone.")) return;
    try { await api.delete(`delete-site/${id}/`); fetchSites(); }
    catch (e) { console.log(e.response?.data); }
  };

  /* ── Helpers ── */
  const getInitials = (name = "") =>
    name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  const formatDate = (d) => {
    if (!d) return "N/A";
    return new Date(d).toLocaleDateString("en-GB", { day:"numeric", month:"short", year:"numeric" });
  };

  const isToday = (d) => {
    if (!d) return false;
    return new Date(d).toDateString() === new Date().toDateString();
  };

  /* ── KPIs ── */
  const totalSlots   = sites.reduce((a,s) => a + (s.slots?.reduce((b,sl) => b + (sl.total_slots||0), 0)||0), 0);
  const filledSlots  = sites.reduce((a,s) => a + (s.slots?.reduce((b,sl) => b + ((sl.total_slots||0)-(sl.available_slots||0)), 0)||0), 0);
  const pendingCount = bookings.filter(b => b.status==="pending").length;
  const approvedCount= bookings.filter(b => b.status==="approved").length;
  const fillRate     = totalSlots ? Math.round((filledSlots/totalSlots)*100) : 0;

  /* ── Modal ── */
  const openModal = (site) => { setSelectedSite(site); setFilterSlot(null); };
  const modalBookings  = selectedSite ? bookings.filter(b => b.site_id===selectedSite.id).filter(b => filterSlot ? b.slot_position===filterSlot : true) : [];
  const modalPending   = selectedSite ? bookings.filter(b => b.site_id===selectedSite.id && b.status==="pending").length   : 0;
  const modalApproved  = selectedSite ? bookings.filter(b => b.site_id===selectedSite.id && b.status==="approved").length  : 0;
  const modalRejected  = selectedSite ? bookings.filter(b => b.site_id===selectedSite.id && b.status==="rejected").length  : 0;

  return (
    <div className="db-root">

      {/* ══════════ SIDEBAR ══════════ */}
      <aside className="db-sidebar">
        <div className="sb-dot-grid" />

        <div className="sb-brand">
          <div className="sb-brand-icon">🍽️</div>
          <span className="sb-brand-text">SER<span>VIO</span></span>
        </div>

        <nav className="sb-nav">
          <div className="sb-nav-group">
            <span className="sb-nav-group-label">Overview</span>
            <div className="sb-nav-item active"><span className="sb-nav-icon">📊</span>Dashboard</div>
            <div className="sb-nav-item" onClick={() => navigate("/create-site")}><span className="sb-nav-icon">➕</span>New Site</div>
          </div>
          <div className="sb-nav-group">
            <span className="sb-nav-group-label">Management</span>
            <div className="sb-nav-item">
              <span className="sb-nav-icon">📅</span>All Sites
              {sites.length > 0 && <span className="sb-nav-badge">{sites.length}</span>}
            </div>
            <div className="sb-nav-item">
              <span className="sb-nav-icon">👥</span>Applications
              {pendingCount > 0 && <span className="sb-nav-badge amber">{pendingCount}</span>}
            </div>
            <div className="sb-nav-item"><span className="sb-nav-icon">💰</span>Payments</div>
          </div>
          <div className="sb-nav-group">
            <span className="sb-nav-group-label">Account</span>
            <div className="sb-nav-item" onClick={() => navigate("/profile")}><span className="sb-nav-icon">👤</span>Profile</div>
            <div className="sb-nav-item" onClick={() => navigate("/settings")}><span className="sb-nav-icon">⚙️</span>Settings</div>
          </div>
        </nav>

        <div className="sb-user">
          <div className="sb-user-avatar">CO</div>
          <div>
            <div className="sb-user-name">Company</div>
            <div className="sb-user-role">Admin · Servio</div>
          </div>
          <button className="sb-user-logout" onClick={() => navigate("/logout")} title="Sign out">🚪</button>
        </div>
      </aside>

      {/* ══════════ MAIN ══════════ */}
      <div className="db-main">

        {/* Top bar */}
        <div className="db-topbar">
          <div className="db-topbar-left">
            <span className="db-topbar-title">Dashboard</span>
            <span className="db-topbar-sub">· {sites.length} active site{sites.length !== 1 ? "s" : ""}</span>
          </div>
          <div className="db-topbar-right">
            <div className="db-topbar-icon-btn" title="Notifications">
              🔔{pendingCount > 0 && <span className="notif-dot" />}
            </div>
            <button className="db-topbar-btn" onClick={() => navigate("/create-site")}>
              + Create Site
            </button>
          </div>
        </div>

        {/* Scrollable content */}
        <div className="db-scroll">

          {/* ── KPI Cards ── */}
          <div className="db-metric-bar">

            <div className="metric-card">
              <div className="metric-card-inner">
                <div className="metric-icon-box">📅</div>
                <div className="metric-value">{sites.length}</div>
              </div>
              <div className="metric-label">Total Sites</div>
              <div className="metric-sub">Active event locations</div>
              <div className="metric-bar-accent green" />
            </div>

            <div className="metric-card">
              <div className="metric-card-inner">
                <div className="metric-icon-box amber">⏳</div>
                <div className="metric-value">{pendingCount}</div>
              </div>
              <div className="metric-label">Pending Review</div>
              <div className="metric-sub">
                {pendingCount > 0 ? <span className="sub-warn">Needs attention</span> : "All clear ✓"}
              </div>
              <div className="metric-bar-accent amber" />
            </div>

            <div className="metric-card">
              <div className="metric-card-inner">
                <div className="metric-icon-box teal">👥</div>
                <div className="metric-value">
                  {filledSlots}<span className="metric-denom">/{totalSlots}</span>
                </div>
              </div>
              <div className="metric-label">Staff Filled</div>
              <div className="metric-sub"><span className="sub-good">{fillRate}% fill rate</span></div>
              <div className="metric-bar-accent teal" />
            </div>

            <div className="metric-card">
              <div className="metric-card-inner">
                <div className="metric-icon-box green-light">✅</div>
                <div className="metric-value">{approvedCount}</div>
              </div>
              <div className="metric-label">Approved Workers</div>
              <div className="metric-sub">Confirmed for events</div>
              <div className="metric-bar-accent green" />
            </div>

          </div>

          {/* ── Sites Section ── */}
          <div>
            <div className="db-section-row">
              <div>
                <h2 className="db-section-title">Your Event Sites</h2>
                <p className="db-section-sub">Manage staffing, view applications, and control your events</p>
              </div>
              {sites.length > 0 && (
                <span className="db-count-pill">{sites.length} site{sites.length !== 1 ? "s" : ""}</span>
              )}
            </div>

            {loading && (
              <div className="db-loading">
                <div className="db-spinner" />
                <p>Loading your sites…</p>
              </div>
            )}

            {!loading && sites.length === 0 && (
              <div className="db-empty">
                <span className="db-empty-icon">🏗️</span>
                <p>No event sites yet</p>
                <span>Create your first site to start managing staff</span>
                <button className="db-empty-cta" onClick={() => navigate("/create-site")}>
                  + Create First Site
                </button>
              </div>
            )}

            {/* ══ NEW SITE CARDS GRID ══ */}
            <div className="sites-grid">
              {sites.map((site, idx) => {
                const pal          = getPalette(idx);
                const siteBookings = bookings.filter(b => b.site_id === site.id);
                const sitePending  = siteBookings.filter(b => b.status === "pending").length;
                const siteApproved = siteBookings.filter(b => b.status === "approved").length;
                const totalFilled  = site.slots?.reduce((a,sl) => a + ((sl.total_slots||0)-(sl.available_slots||0)), 0) || 0;
                const totalCap     = site.slots?.reduce((a,sl) => a + (sl.total_slots||0), 0) || 0;
                const fillPct      = totalCap ? Math.round((totalFilled / totalCap) * 100) : 0;

                return (
                  <div
                    key={site.id}
                    className="site-card"
                    style={{ "--card-from": pal.from, "--card-to": pal.to, "--card-accent": pal.accent }}
                  >
                    {/* Coloured banner header */}
                    <div className="sc-banner">
                      <div className="sc-banner-bg" />
                      <div className="sc-banner-dot-grid" />

                      <div className="sc-banner-top">
                        <span className={`sc-status-chip ${isToday(site.date) ? "today" : "upcoming"}`}>
                          {isToday(site.date) ? "🔴 Today" : "📅 Upcoming"}
                        </span>
                        {sitePending > 0 && (
                          <span className="sc-pending-chip">
                            <span className="sc-blink" />
                            {sitePending} pending
                          </span>
                        )}
                      </div>

                      <div className="sc-banner-body">
                        <div className="sc-event-icon">🎪</div>
                        <h3 className="sc-name">{site.name}</h3>
                        <div className="sc-meta-row">
                          <span>📍 {site.location || "Location TBD"}</span>
                          <span>📅 {formatDate(site.date)}</span>
                        </div>
                      </div>

                      {/* Fill-rate arc badge */}
                      <div className="sc-fill-badge">
                        <div className="sc-fill-num">{fillPct}%</div>
                        <div className="sc-fill-lbl">filled</div>
                      </div>
                    </div>

                    {/* Card body */}
                    <div className="sc-body">

                      {/* Staffing progress */}
                      <div className="sc-staffing">
                        <div className="sc-staffing-header">
                          <span className="sc-section-label">Staffing</span>
                          <span className="sc-staffing-count">
                            <strong>{totalFilled}</strong>/{totalCap} filled
                          </span>
                        </div>
                        <div className="sc-big-bar-track">
                          <div
                            className="sc-big-bar-fill"
                            style={{ width: `${fillPct}%`, background: `linear-gradient(90deg, ${pal.from}, ${pal.to})` }}
                          />
                        </div>

                        {/* All slots — every role shown with its own mini bar */}
                        <div className="sc-slot-rows">
                          {site.slots?.length === 0 && (
                            <span className="sc-no-slots">No roles defined yet</span>
                          )}
                          {site.slots?.map((slot) => {
                            const f = (slot.total_slots||0) - (slot.available_slots||0);
                            const p = slot.total_slots ? Math.round((f/slot.total_slots)*100) : 0;
                            return (
                              <div key={slot.id} className="sc-slot-row">
                                <div className="sc-slot-row-top">
                                  <span className="sc-slot-name">{slot.position.replace(/_/g," ")}</span>
                                  <span className="sc-slot-ratio" style={{ color: pal.from }}>
                                    {f}<span style={{ color:"#5a8a6a", fontWeight:600 }}>/{slot.total_slots}</span>
                                  </span>
                                </div>
                                <div className="sc-slot-mini-track">
                                  <div
                                    className="sc-slot-mini-fill"
                                    style={{
                                      width: `${p}%`,
                                      background: p >= 100
                                        ? "linear-gradient(90deg,#e74c3c,#c0392b)"
                                        : `linear-gradient(90deg,${pal.from},${pal.to})`
                                    }}
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Full worker list — ALL workers shown, no cut-off */}
                      <div className="sc-workers">
                        <div className="sc-workers-header">
                          <span className="sc-section-label">Workers</span>
                          <div className="sc-worker-stats-row">
                            <span className="sc-workers-total">{siteBookings.length} total</span>
                            {siteApproved > 0 && <span className="wstat approved">✓ {siteApproved}</span>}
                            {sitePending  > 0 && <span className="wstat pending">⏳ {sitePending}</span>}
                          </div>
                        </div>

                        {siteBookings.length === 0 ? (
                          <div className="sc-no-workers-box">
                            <span>👤</span> No applications yet
                          </div>
                        ) : (
                          <div className="sc-worker-full-list">
                            {siteBookings.map((b) => (
                              <div key={b.id} className="sc-worker-item">
                                <div
                                  className={`sc-worker-avatar-sm sc-avatar-${b.status}`}
                                  title={b.worker_name}
                                >
                                  {getInitials(b.worker_name)}
                                </div>
                                <div className="sc-worker-info">
                                  <span className="sc-worker-name">{b.worker_name}</span>
                                  <span className="sc-worker-role">{b.slot_position?.replace(/_/g," ")}</span>
                                </div>
                                <span className={`sc-worker-badge sc-badge-${b.status}`}>
                                  {b.status === "approved" && "✓"}
                                  {b.status === "pending"  && "⏳"}
                                  {b.status === "rejected" && "✕"}
                                  {" "}{b.status}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Action buttons */}
                      <div className="sc-actions">
                        <button
                          className="sc-btn sc-btn-primary"
                          style={{ background: `linear-gradient(135deg, ${pal.from}, ${pal.to})` }}
                          onClick={() => openModal(site)}
                        >
                          👥 Manage Workers
                        </button>
                        <button className="sc-btn sc-btn-outline" onClick={() => navigate(`/edit-site/${site.id}`)}>
                          ✏️ Edit
                        </button>
                        <button className="sc-btn sc-btn-delete" onClick={() => handleDelete(site.id)}>
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════ WORKERS MODAL ══════════ */}
      {selectedSite && (
        <div className="modal-overlay" onClick={(e) => { if (e.target===e.currentTarget) setSelectedSite(null); }}>
          <div className="modal-box">

            <div className="modal-head">
              <div>
                <div className="modal-site-name">👥 {selectedSite.name}</div>
                <div className="modal-site-meta">📍 {selectedSite.location||"—"} · 📅 {formatDate(selectedSite.date)}</div>
              </div>
              <button className="modal-close" onClick={() => setSelectedSite(null)}>✕</button>
            </div>

            {selectedSite.slots?.length > 0 && (
              <div className="modal-filter-bar">
                <button className={`filter-tab ${!filterSlot?"active":""}`} onClick={() => setFilterSlot(null)}>All Roles</button>
                {selectedSite.slots.map(slot => (
                  <button
                    key={slot.id}
                    className={`filter-tab ${filterSlot===slot.position?"active":""}`}
                    onClick={() => setFilterSlot(filterSlot===slot.position ? null : slot.position)}
                  >
                    {slot.position.replace(/_/g," ")}
                  </button>
                ))}
              </div>
            )}

            <div className="modal-body">
              <div className="modal-status-row">
                <span className="modal-status-pill pending">⏳ {modalPending} Pending</span>
                <span className="modal-status-pill approved">✓ {modalApproved} Approved</span>
                {modalRejected > 0 && <span className="modal-status-pill rejected">✕ {modalRejected} Rejected</span>}
              </div>

              {modalBookings.length === 0 ? (
                <div className="no-workers-modal">
                  <span className="icon">🔍</span>
                  <p>No workers found{filterSlot ? ` for "${filterSlot.replace(/_/g," ")}"` : ""}</p>
                  <span>Applications will appear here once workers apply</span>
                </div>
              ) : (
                modalBookings.map(b => (
                  <div key={b.id} className="worker-card">
                    <div className="worker-card-top">
                      <div className="worker-card-left" onClick={() => navigate(`/worker-profile/${b.worker_id}`)}>
                        <div className="worker-avatar">{getInitials(b.worker_name)}</div>
                        <div>
                          <div className="worker-card-name">{b.worker_name}</div>
                          <div className="worker-card-role">{b.slot_position?.replace(/_/g," ")}</div>
                        </div>
                      </div>
                      <span className={`wc-status ${b.status}`}>
                        {b.status==="approved"&&"✓ Approved"}
                        {b.status==="pending" &&"⏳ Pending"}
                        {b.status==="rejected"&&"✕ Rejected"}
                      </span>
                    </div>
                    <div className="worker-card-actions">
                      {b.status==="pending"&&<><button className="wca-btn approve" onClick={()=>updateStatus(b.id,"approved")}>✓ Approve</button><button className="wca-btn reject" onClick={()=>updateStatus(b.id,"rejected")}>✕ Reject</button></>}
                      {b.status==="approved"&&<button className="wca-btn reject" onClick={()=>updateStatus(b.id,"rejected")}>Revoke Approval</button>}
                      {b.status==="rejected"&&<button className="wca-btn approve" onClick={()=>updateStatus(b.id,"approved")}>Re-approve</button>}
                      <button className="wca-btn profile" onClick={()=>navigate(`/worker-profile/${b.worker_id}`)}>View Profile →</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;