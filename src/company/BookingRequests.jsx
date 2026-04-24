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
      const res = await api.get("company-bookings/");
      console.log("Bookings:", res.data); 
      setBookings(res.data);
    } catch (err) {
      toast.error("Failed to load bookings ❌");
    }
    setLoading(false);
  };

  const updateStatus = async (id, status) => {
    try {
      await api.post(`update/${id}/`, { status });
      toast.success(`Booking ${status} ✅`);
      fetchBookings();
    } catch (err) {
      toast.error("Status update failed ❌");
    }
  };

  const markAttendance = async (id, value) => {
    try {
      await api.post(`attendance/${id}/`, {
        attendance: value,
      });

      toast.success(`Marked ${value} ✅`);
      fetchBookings();
      setSelectedBooking(null)
        } catch {
      toast.error("Attendance failed ❌");
    }
  };

  const submitRating = async (id) => {
    if (!rating) {
      toast.error("Select rating ❌");
      return;
    }

    try {
      await api.post(`rate/${id}/`, {
        rating: rating,
      });

      toast.success("Rated successfully ⭐");
      setRating("");
      fetchBookings();
      setSelectedBooking(null);
    } catch {
      toast.error("Rating failed ❌");
    }
  };
  console.log("Current bookings state:", bookings);
  console.log("Selected booking:", selectedBooking);
 

  return (
    <div className="bookings-page">
      <div className="bookings-header">
        <h2>Booking Requests</h2>
        <p>Manage your event staffing requests</p>
      </div>

      <div className="bookings-container">
        {loading && <p>Loading bookings...</p>}

        {!loading && bookings.length === 0 && (
          <div className="no-bookings">
            No booking requests found.
          </div>
        )}

        <div className="bookings-grid">
          {bookings.map((b) => (
            <div key={b.id} className="booking-card">

              <div className="card-top">
                <span className={`status-badge ${b.status}`}>
                  {b.status}
                </span>
                <span className="slot-id">ID: #{b.id}</span>
              </div>

              <div className="card-body">
                <span className="value">
                  {b.slot_position?.replace("_", " ")}
                </span>
              </div>

              <div className="card-actions">
                <button
                  className="btn-details"
                  onClick={() => setSelectedBooking(b)}
                >
                  View Details
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/*  MODAL */}
      {selectedBooking && (
        <div className="modal-overlay">
          <div className="modal-card">

            <h2>👤 Worker Details</h2>

            <p><strong>Name:</strong> {selectedBooking.worker_name}</p>
            <p><strong>Phone:</strong> {selectedBooking.phone}</p>
            <p><strong>Location:</strong> {selectedBooking.location}</p>

            <p>
              <strong>Role:</strong>{" "}
              {selectedBooking.slot_position?.replace("_", " ")}
            </p>

            <p><strong>Status:</strong> {selectedBooking.status}</p>

            <p className="salary">
              💰 ₹{selectedBooking.salary}
            </p>

            {/* 💬 CHAT BUTTON (NEW) */}
            {selectedBooking.status === "approved" && (
              <button
                className="btn-details"
                style={{
                  marginTop: "10px",
                  background: "#4CAF50",
                  color: "white"
                }}
                onClick={() => {
                  console.log("Worker ID:", selectedBooking.worker_user_id);

                  if (!selectedBooking.worker_user_id) {
                    alert("Worker ID missing ❌");
                    return;
                  }

                  navigate("/chat", {
                             
  state: {
    receiver_id: selectedBooking.worker_user_id
,
    receiver_role: "company"
  } 
});
                }}
              >
                💬 Chat with Worker
              </button>
            )}

            {/* ✅ APPROVE / REJECT */}
            {selectedBooking.status === "pending" && (
              <div className="modal-actions">
                <button
                  className="btn-approve"
                  onClick={() =>
                    updateStatus(selectedBooking.id, "approved")
                  }
                >
                  Approve
                </button>

                <button
                  className="btn-reject"
                  onClick={() =>
                    updateStatus(selectedBooking.id, "rejected")
                  }
                >
                  Reject
                </button>
              </div>
            )}

            {/* ATTENDANCE */}
            {selectedBooking.status === "approved" &&
             selectedBooking.attendance === "pending" && (
              <div className="modal-actions">

                <button
                  className="btn-approve"
                  onClick={() =>
                    markAttendance(selectedBooking.id, "present")
                  }
                >
                  Mark Present
                </button>

                <button
                  className="btn-reject"
                  onClick={() =>
                    markAttendance(selectedBooking.id, "absent")
                  }
                >
                  Mark Absent
                </button>

              </div>
            )}

            {/*  RATING */}
            {selectedBooking.attendance === "present" && (
              <div className="rating-box">

                <h4>⭐ Rate Worker</h4>

                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                >
                  <option value="">Select Rating</option>
                  <option value="5">⭐⭐⭐⭐⭐</option>
                  <option value="4">⭐⭐⭐⭐</option>
                  <option value="3">⭐⭐⭐</option>
                  <option value="2">⭐⭐</option>
                  <option value="1">⭐</option>
                </select>

                <button
                  onClick={() =>
                    submitRating(selectedBooking.id)
                  }
                >
                  Submit Rating
                </button>

              </div>
            )}

            <button
              className="close-btn"
              onClick={() => setSelectedBooking(null)}
            >
              Close
            </button>

          </div>
        </div>
      )}
    </div>
  );
}

export default BookingRequests;