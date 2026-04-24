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

      console.log('ans', res.data.user_bookings); 

      setSites(res.data.sites || []);
      setBookingMap(res.data.user_bookings || {});
    } catch (err) {
      console.log("ERROR:", err.response?.data);
      toast.error("Failed to load sites ❌");
    }
    setLoading(false);
  };

 
  const hasActiveBooking = () => {
    return (
      Object.values(bookingMap).includes("pending") ||
      Object.values(bookingMap).includes("approved")
    );
  };

  
  const apply = async (slotId) => {
    if (hasActiveBooking()) {
      toast.error("You can only apply for one role at a time ❌");
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

  
  const getButtonText = (slot) => {
    const status = bookingMap[slot.id];

    if (status === "pending") return "Pending";
    if (status === "approved") return "Approved";
    if (status === "rejected") return "Rejected";

    return slot.available_slots > 0 ? "Apply Now" : "Full";
  };

 
  const isDisabled = (slot) => {
    const status = bookingMap[slot.id];

    return (
      slot.available_slots <= 0 ||
      applyingId === slot.id ||
      status === "pending" ||
      status === "approved" ||
      hasActiveBooking()
    );
  };
console.log('sites', sites);
  return (
    <div className="worker-sites-page">
      <div className="worker-header">
        <h2>Available Opportunities</h2>
        <p>Find and apply for event roles</p>
      </div>

      {loading && <p>Loading sites...</p>}

      {!loading && sites.length === 0 && (
        <p>No available sites right now.</p>
      )}

      <div className="sites-container">
        {sites.map((site) => (
          <div key={site.id} className="job-site-group">
            {/* HEADER */}
            <div className="site-info-header">
              <div className="title-box">
                <h3>{site.name}</h3>
                <span>📍 {site.location || "Unknown"}</span>
              
              </div> 



              <div className="date-tag">
                {site.date
                  ? new Date(site.date).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                    })
                  : "N/A"}
              </div>
            </div>

           
            <div className="job-slots-grid">
              {site.slots?.map((slot) => (
                <div key={slot.id} className="job-slot-card">
                  <div className="slot-main">
                    <span className="position-name">
                      {slot.position.replace("_", " ")}
                    </span>

                    <div className="availability-pill">
                      {slot.available_slots} Slots Left
                    </div>
                  </div>

                 
                  <button
                    className={`apply-btn ${bookingMap[slot.id] || ""}`}
                    onClick={() => apply(slot.id)}
                    disabled={isDisabled(slot)}
                  >
                    {applyingId === slot.id
                      ? "Applying..."
                      : getButtonText(slot)}
                  </button>

                  
                  {bookingMap[slot.id] === "approved" && (
                    <button
                      className="chat-btn"
                      onClick={() => {
                        console.log("Receiver ID:", site.company_id); 

                       navigate("/chat", {
  state: {
    receiver_id: site.company,
    receiver_role: "worker"
  }
});
                      }}
                    >
                      💬 Chat with Company

                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default WorkerSites;