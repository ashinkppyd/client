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

  useEffect(() => {
    fetchSites();
  }, []);

  const fetchSites = async () => {
    try {
      const res = await api.get("my-sites/");
      setSites(Array.isArray(res.data) ? res.data : []);
    } catch {
      toast.error("Failed to load sites ");
    }
  };

 
  const loadWorkers = async (site) => {
    try {
      const res = await api.get(`site-report/${site.id}/`);

      console.log("API RESPONSE:", res.data);

    
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.workers || res.data.data || [];

      setWorkers(data);
      setSelectedSite(site);

    } catch (err) {
      console.log(err);
      toast.error("Failed to load workers ❌");
    }
  };

  const openWorker = (worker) => {
    setSelectedWorker(worker);
    setAttendance(worker.attendance || "pending");
    setRating(worker.rating || "");
  };

  const handleSubmit = async () => {
    if (!attendance) {
      toast.error("Select attendance ❌");
      return;
    }

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

  return (
    <div className="site-container">
      <h2 className="title">📍 Site Attendance</h2>

     
      {!selectedSite && (
        <div>
          <h3>Select Site</h3>

          <div className="site-grid">
            {sites.map((site) => (
              <div
                key={site.id}
                className="site-card"
                onClick={() => loadWorkers(site)}
              >
                {site.name}
              </div>
            ))}
          </div>
        </div>
      )}

     
      {selectedSite && (
        <div>
          <button
            className="back-btn"
            onClick={() => setSelectedSite(null)}
          >
            ⬅ Back
          </button>

          <h3>Workers at {selectedSite.name}</h3>

          {!Array.isArray(workers) || workers.length === 0 ? (
            <p>No workers found</p>
          ) : (
            <div className="worker-grid">
              {workers.map((w) => (
                <div
                  key={w.booking_id}
                  className={`worker-card ${w.attendance || "pending"}`}
                  onClick={() => openWorker(w)}
                >
                  <h4>👤 {w.worker_name}</h4>

                  <p><strong>Role:</strong> {w.role?.replace("_", " ")}</p>
                  <p>📞 {w.phone}</p>
                  <p>📍 {w.location}</p>
                  <p>💰 ₹{w.salary || 0}</p>

                  <p className={`status ${w.attendance}`}>
                    {w.attendance === "present" && "✅ Present"}
                    {w.attendance === "absent" && "❌ Absent"}
                    {!w.attendance || w.attendance === "pending" && "⏳ Pending"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      
      {selectedWorker && (
        <div className="modal-overlay">
          <div className="modal-card">

            <h2>👤 {selectedWorker.worker_name}</h2>

            <p><strong>Role:</strong> {selectedWorker.role}</p>
            <p><strong>Phone:</strong> {selectedWorker.phone}</p>
            <p><strong>Location:</strong> {selectedWorker.location}</p>
            <p><strong>Salary:</strong> ₹{selectedWorker.salary}</p>

            <label>Attendance</label>
            <select
              value={attendance}
              onChange={(e) => setAttendance(e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="present">Present</option>
              <option value="absent">Absent</option>
            </select>

            {attendance === "present" && (
              <>
                <label>Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Select</option>
                  <option value="5">⭐⭐⭐⭐⭐</option>
                  <option value="4">⭐⭐⭐⭐</option>
                  <option value="3">⭐⭐⭐</option>
                  <option value="2">⭐⭐</option>
                  <option value="1">⭐</option>
                </select>
              </>
            )}

            <div className="modal-buttons">
              <button className="save-btn" onClick={handleSubmit}>
                Save
              </button>

              <button
                className="close-btn"
                onClick={() => setSelectedWorker(null)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

export default SiteAttendance;