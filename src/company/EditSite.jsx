import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./EditSite.css";
import { toast } from "react-toastify";

const SLOT_CATEGORIES = [
  {
    key: "juice",
    icon: "🧃",
    title: "Juice Section",
    filter: (p) => p.includes("juicer"),
  },
  {
    key: "catering",
    icon: "🍽️",
    title: "Catering Team",
    filter: (p) => ["catering_boy", "main_boy", "supervisor", "captain"].includes(p),
  },
  {
    key: "kitchen",
    icon: "👨‍🍳",
    title: "Kitchen Team",
    filter: (p) => p.includes("chef"),
  },
  {
    key: "design",
    icon: "🎉",
    title: "Event Design",
    filter: (p) => p === "decoration",
  },
];

const DEFAULT_SLOTS = [
  { position: "juicer",        total_slots: 0 },
  { position: "juicer_helper", total_slots: 0 },
  { position: "catering_boy",  total_slots: 0 },
  { position: "main_boy",      total_slots: 0 },
  { position: "supervisor",    total_slots: 0 },
  { position: "captain",       total_slots: 0 },
  { position: "chef_helper",   total_slots: 0 },
  { position: "decoration",    total_slots: 0 },
];

function EditSite() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    location: "",
    date: "",
    reporting_time: "",
    slots: DEFAULT_SLOTS.map(s => ({ ...s })),
  });

  useEffect(() => { fetchSite(); }, [id]);

  const fetchSite = async () => {
    try {
      const res = await api.get("my-sites/", { withCredentials: true });
      const site = res.data.find((s) => s.id === parseInt(id));
      if (!site) { toast.error("Site not found ❌"); return; }

      const mergedSlots = DEFAULT_SLOTS.map((defaultSlot) => {
        const existing = site.slots.find((s) => s.position === defaultSlot.position);
        return existing || { ...defaultSlot };
      });

      setForm({
        name: site.name,
        location: site.location,
        date: site.date,
        reporting_time: site.reporting_time,
        slots: mergedSlots,
      });
    } catch (err) {
      console.log(err.response?.data);
      toast.error("Failed to fetch site ❌");
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSlotChange = (index, value) => {
    const updated = [...form.slots];
    updated[index].total_slots = Math.max(0, parseInt(value || 0));
    setForm({ ...form, slots: updated });
  };

  const totalStaff = form.slots.reduce((a, s) => a + s.total_slots, 0);

  const handleUpdate = async () => {
    setLoading(true);
    try {
      await api.put(`update-site/${id}/`, form, { withCredentials: true });
      toast.success("Updated Successfully ✅");
      navigate("/dashboard");
    } catch (err) {
      console.log(err.response?.data);
      toast.error("Update failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cs-page">
      <div className="cs-blob-tr" />
      <div className="cs-blob-bl" />
      <div className="cs-dot-grid" />

      <div className="cs-layout">

        {/* ── LEFT SIDEBAR ── */}
        <div className="cs-sidebar">
          <div className="cs-sidebar-inner">

            <div className="cs-brand">
              <div className="cs-brand-icon">🍽️</div>
              <span className="cs-brand-text">SER<span>VIO</span></span>
            </div>

            {/* Live preview card */}
            <div className="cs-preview-card">
              <div className="cs-preview-banner">
                <div className="cs-preview-banner-bg" />
                <div className="cs-preview-dot-grid" />
                <span className="cs-preview-chip">✏️ Editing</span>
                <div className="cs-preview-icon">🎪</div>
                <div className="cs-preview-name">
                  {form.name || "Event Name"}
                </div>
                <div className="cs-preview-meta">
                  <span>📍 {form.location || "Venue"}</span>
                  <span>⏰ {form.reporting_time || "Time"}</span>
                </div>
              </div>
              <div className="cs-preview-body">
                <div className="cs-preview-date-row">
                  <span className="cs-preview-date-label">Date</span>
                  <span className="cs-preview-date-val">
                    {form.date
                      ? new Date(form.date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })
                      : "Not set"}
                  </span>
                </div>
                <div className="cs-preview-staff-row">
                  <span className="cs-preview-staff-label">Total Staff Required</span>
                  <span className="cs-preview-staff-num">{totalStaff}</span>
                </div>
                <div className="cs-preview-slots">
                  {form.slots.filter(s => s.total_slots > 0).map((s, i) => (
                    <div key={i} className="cs-preview-slot-chip">
                      <span>{s.position.replace(/_/g, " ")}</span>
                      <span className="cs-preview-slot-n">{s.total_slots}</span>
                    </div>
                  ))}
                  {totalStaff === 0 && (
                    <span className="cs-preview-empty">No slots set yet</span>
                  )}
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="cs-tips">
              <div className="cs-tip-title">💡 Edit Tips</div>
              {[
                "Changes are saved immediately on submit",
                "Reducing slots won't affect approved bookings",
                "Update reporting time if the schedule changed",
              ].map((tip, i) => (
                <div key={i} className="cs-tip-item">
                  <span className="cs-tip-check">✓</span> {tip}
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* ── RIGHT FORM AREA ── */}
        <div className="cs-form-area">

          {/* Page header */}
          <div className="cs-form-header">
            <button className="cs-back-btn" onClick={() => navigate("/dashboard")}>
              ← Dashboard
            </button>
            <div className="cs-header-badge">✏️ Edit Event Site</div>
            <h1 className="cs-form-title">
              Edit Event <span className="cs-gradient-text">Site</span>
            </h1>
            <p className="cs-form-sub">
              Update your event details and staffing requirements below.
            </p>
          </div>

          {/* ── Basic Details ── */}
          <div className="cs-section">
            <div className="cs-section-label">
              <span className="cs-section-pill">📋 Basic Logistics</span>
            </div>

            <div className="cs-glass-panel">
              <div className="cs-input-grid">
                <div className="cs-field">
                  <label className="cs-label">Event Name</label>
                  <input
                    className="cs-input"
                    name="name"
                    placeholder="e.g. Annual Gala Dinner"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="cs-field">
                  <label className="cs-label">Venue Location</label>
                  <input
                    className="cs-input"
                    name="location"
                    placeholder="e.g. Grand Hyatt, Mumbai"
                    value={form.location}
                    onChange={handleChange}
                  />
                </div>
                <div className="cs-field">
                  <label className="cs-label">Event Date</label>
                  <input
                    className="cs-input"
                    type="date"
                    name="date"
                    value={form.date || ""}
                    onChange={handleChange}
                  />
                </div>
                <div className="cs-field">
                  <label className="cs-label">Reporting Time</label>
                  <input
                    className="cs-input"
                    type="time"
                    name="reporting_time"
                    value={form.reporting_time || ""}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── Staffing ── */}
          <div className="cs-section">
            <div className="cs-section-label">
              <span className="cs-section-pill">👥 Staffing Requirements</span>
              {totalStaff > 0 && (
                <span className="cs-total-pill">{totalStaff} staff total</span>
              )}
            </div>

            {SLOT_CATEGORIES.map((cat) => {
              const catSlots = form.slots
                .map((s, idx) => ({ ...s, idx }))
                .filter(s => cat.filter(s.position));
              const catTotal = catSlots.reduce((a, s) => a + s.total_slots, 0);

              return (
                <div key={cat.key} className="cs-glass-panel cs-slot-panel">
                  <div className="cs-slot-panel-header">
                    <div className="cs-slot-panel-title">
                      <div className="cs-slot-icon">{cat.icon}</div>
                      {cat.title}
                    </div>
                    {catTotal > 0 && (
                      <span className="cs-cat-total">{catTotal} slots</span>
                    )}
                  </div>

                  <div className="cs-slots-grid">
                    {catSlots.map(({ idx, position, total_slots }) => (
                      <div key={idx} className="cs-slot-card">
                        <div className="cs-slot-card-top">
                          <span className="cs-slot-label">
                            {position.replace(/_/g, " ")}
                          </span>
                          {total_slots > 0 && (
                            <span className="cs-slot-active-dot" />
                          )}
                        </div>
                        <div className="cs-slot-counter">
                          <button
                            className="cs-counter-btn minus"
                            onClick={() => handleSlotChange(idx, total_slots - 1)}
                            disabled={total_slots === 0}
                          >
                            −
                          </button>
                          <input
                            className="cs-counter-input"
                            type="number"
                            min="0"
                            value={total_slots}
                            onChange={(e) => handleSlotChange(idx, e.target.value)}
                          />
                          <button
                            className="cs-counter-btn plus"
                            onClick={() => handleSlotChange(idx, total_slots + 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Footer ── */}
          <div className="cs-form-footer">
            <div className="cs-footer-summary">
              {totalStaff > 0 ? (
                <>
                  <span className="cs-footer-check">✓</span>
                  {totalStaff} staff across {form.slots.filter(s => s.total_slots > 0).length} roles
                </>
              ) : (
                <span className="cs-footer-hint">Set at least one slot to save</span>
              )}
            </div>
            <div className="es-footer-btns">
              <button
                className="cs-submit-btn"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? (
                  <><span className="cs-btn-spinner" /> Saving Changes…</>
                ) : (
                  "Save Changes →"
                )}
              </button>
              <button
                className="es-cancel-btn"
                onClick={() => navigate("/dashboard")}
              >
                Cancel
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default EditSite;