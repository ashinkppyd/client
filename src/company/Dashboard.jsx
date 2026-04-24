import { useEffect, useState } from "react";
import api from "../api/axios";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [sites, setSites] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSite, setSelectedSite] = useState(null);
  const [filterSlot, setFilterSlot] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchSites();
    fetchBookings();
  }, []);

  const fetchSites = async () => {
    setLoading(true);
    try {
      const res = await api.get("my-sites/");
      setSites(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
    setLoading(false);
  };

  const fetchBookings = async () => {
    try {
      const res = await api.get("company-bookings/");
      setBookings(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  //  APPROVE / REJECT
  const updateStatus = async (id, status) => {
    try {
      await api.post(`booking/update/${id}/`, { status });
      fetchBookings();
      fetchSites(); // update slot count also
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  //  DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this site?")) return;

    try {
      await api.delete(`delete-site/${id}/`);
      fetchSites();
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  // OPEN PROFILE
  const openProfile = (workerId) => {
    navigate(`/worker-profile/${workerId}`);
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1>Management Dashboard</h1>
        <p>Overview of your event sites</p>
      </div>

      {loading && <p>Loading...</p>}

      {!loading && sites.length === 0 && <p>No sites found</p>}

      <div className="sites-grid">
        {sites.map((site) => (
          <div key={site.id} className="site-card">

            {/* HEADER */}
            <div className="site-card-header">
              <div>
                <h3>{site.name}</h3>
                <span>📍 {site.location}</span>
              </div>

              <div className="site-date-badge">
                📅{" "}
                {site.date
                  ? new Date(site.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })
                  : "N/A"}
              </div>
            </div>

            {/* SLOTS */}
            <div className="slots-section">
              <div className="section-title">Staffing Overview</div>

              {site.slots?.map((slot) => {
                const filled =
                  slot.total_slots - slot.available_slots;

                const percentage = slot.total_slots
                  ? (filled / slot.total_slots) * 100
                  : 0;

                return (
                  <div key={slot.id} className="slot-row">
                    <div className="slot-info">
                      <span>{slot.position}</span>
                      <span>{filled}/{slot.total_slots}</span>
                    </div>

                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* FOOTER */}
            <div className="site-card-footer">

              <button
                className="view-btn"
                onClick={() => navigate(`/edit-site/${site.id}`)}
              >
                ✏️ Edit
              </button>

              <button
                className="report-btn"
                onClick={() => {
                  setSelectedSite(site);
                  setFilterSlot(null);
                }}
              >
                📊 Report
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDelete(site.id)}
              >
                🗑️ Delete
              </button>

            </div>
          </div>
        ))}
      </div>

      {/*  MODAL */}
      {selectedSite && (
        <div className="modal">
          <div className="modal-content">

            <h3>📊 {selectedSite.name}</h3>

            {/* SLOT FILTER */}
            <h4>Slots (Click to filter)</h4>
            {selectedSite.slots?.map((slot) => (
              <p
                key={slot.id}
                style={{ cursor: "pointer" }}
                onClick={() => setFilterSlot(slot.position)}
              >
                {slot.position}
              </p>
            ))}

            {filterSlot && (
              <p
                style={{ color: "orange", cursor: "pointer" }}
                onClick={() => setFilterSlot(null)}
              >
                Clear Filter
              </p>
            )}

            {/* WORKERS */}
            <h4 style={{ marginTop: "10px" }}>Workers</h4>

            {bookings
              .filter((b) => b.site_id === selectedSite.id)
              .filter((b) =>
                filterSlot ? b.slot_position === filterSlot : true
              )
              .length === 0 && <p>No workers</p>}

            {bookings
              .filter((b) => b.site_id === selectedSite.id)
              .filter((b) =>
                filterSlot ? b.slot_position === filterSlot : true
              )
              .map((b) => (
                <div key={b.id} style={{ marginBottom: "10px" }}>

                  {/* CLICKABLE NAME */}
                  <p
                    style={{ cursor: "pointer", fontWeight: "bold" }}
                    onClick={() => openProfile(b.worker_id)}
                  >
                    👤 {b.worker_name}
                  </p>

                  <p>
                    {b.slot_position} ({b.status})
                  </p>

                  {/* ACTION BUTTONS */}
                  {b.status === "pending" && (
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        onClick={() => updateStatus(b.id, "approved")}
                        style={{ background: "green", color: "white" }}
                      >
                        Approve
                      </button>

                      <button
                        onClick={() => updateStatus(b.id, "rejected")}
                        style={{ background: "red", color: "white" }}
                      >
                        Reject
                      </button>
                    </div>
                  )}

                </div>
              ))}

            <button onClick={() => setSelectedSite(null)}>
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;