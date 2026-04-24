import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./WorkerProfile.css";

function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);

  useEffect(() => {
    fetchWorker();
  }, [id]);

  const fetchWorker = async () => {
    try {
      const res = await api.get(`accounts/worker/${id}/`);
      setWorker(res.data);
    } catch (err) {
      console.log(err.response?.data);
    }
  };

  if (!worker) return (
    <div className="worker-profile-loading">
      <div className="spinner"></div>
      <p>Fetching Professional Profile...</p>
    </div>
  );

  return (
    <div className="worker-profile-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="worker-profile-card">
       
        <div className="worker-aside">
          <div className="worker-avatar">
             {worker.profile_image ? (
                <img src={`http://127.0.0.1:8000${worker.profile_image}`} alt="worker" />
             ) : (
                <div className="avatar-placeholder">{worker.username.charAt(0)}</div>
             )}
          </div>
          <div className="worker-id-badge">Verified Member</div>
          <p className="member-since">Joined {new Date().getFullYear()}</p>
        </div>

       
        <div className="worker-main">
          <div className="worker-header">
            <h1>{worker.username}</h1>
            <span className="role-tag">Professional Worker</span>
          </div>

          <div className="info-grid">
            <div className="info-item">
              <label>Email Address</label>
              <p>{worker.email}</p>
            </div>
            <div className="info-item">
              <label>Contact Number</label>
              <p>{worker.phone || "Not Provided"}</p>
            </div>
            <div className="info-item">
              <label>Primary Location</label>
              <p>{worker.place || "Kerala, India"}</p>
            </div>
          </div>

          <div className="profile-footer">
            <button className="contact-btn">Contact Worker</button>
            <button className="assign-btn">Assign to Site</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default WorkerProfile;