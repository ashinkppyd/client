import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./EditSite.css";
import { toast } from "react-toastify";


const DEFAULT_SLOTS = [
  { position: "juicer", total_slots: 0 },
  { position: "juicer_helper", total_slots: 0 },

  { position: "catering_boy", total_slots: 0 },
  { position: "main_boy", total_slots: 0 },
  { position: "supervisor", total_slots: 0 },
  { position: "captain", total_slots: 0 },

  { position: "chef_helper", total_slots: 0 },
  { position: "decoration", total_slots: 0 },
];

function EditSite() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    location: "",
    date: "",
    reporting_time: "",
    slots: [],
  });

  useEffect(() => {
    fetchSite();
  }, [id]);

  
  const fetchSite = async () => {
    try {
      const res = await api.get("my-sites/", {
        withCredentials: true,
      });

      const site = res.data.find((s) => s.id === parseInt(id));

      if (!site) {
        toast.error("Site not found ❌");
        return;
      }

      
      const mergedSlots = DEFAULT_SLOTS.map((defaultSlot) => {
        const existing = site.slots.find(
          (s) => s.position === defaultSlot.position
        );
        return existing || defaultSlot;
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

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSlotChange = (index, value) => {
    const updated = [...form.slots];
    updated[index].total_slots = Math.max(0, parseInt(value || 0));
    setForm({ ...form, slots: updated });
  };

  
  const handleUpdate = async () => {
    try {
      await api.put(`update-site/${id}/`, form, {
        withCredentials: true,
      });

      toast.success("Updated Successfully ✅");
      navigate("/dashboard");

    } catch (err) {
      console.log(err.response?.data);
      toast.error("Update failed ❌");
    }
  };

  const renderGroup = (title, icon, filterFn) => {
    const filtered = form.slots.filter(filterFn);
    if (filtered.length === 0) return null;

    return (
      <div className="category-group">
        <h4 className="section-title-icon">{icon} {title}</h4>

        <div className="slots-grid">
          {filtered.map((slot) => {
            const index = form.slots.indexOf(slot);

            return (
              <div key={index} className="slot-input-group">
                <label>{slot.position.replace("_", " ")}</label>

                <input
                  type="number"
                  value={slot.total_slots}
                  onChange={(e) =>
                    handleSlotChange(index, e.target.value)
                  }
                />
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="edit-site-page">
      <div className="edit-card">

        <div className="edit-header">
          <h2>Edit Event Site</h2>
          <p>Update logistics & staffing</p>
        </div>

        {/* BASIC */}
        <div className="edit-section">
          <h3 className="form-sub-label">Logistics</h3>

          <div className="edit-form-grid">
            <div className="input-group">
              <label>Event Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Location</label>
              <input
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Date</label>
              <input
                type="date"
                name="date"
                value={form.date || ""}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Reporting Time</label>
              <input
                type="time"
                name="reporting_time"
                value={form.reporting_time || ""}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        {/* SLOTS */}
        <div className="edit-section">
          <h3 className="form-sub-label">Staffing</h3>

          {renderGroup("Juice Section", "🧃", s => s.position.includes("juicer"))}

          {renderGroup(
            "Catering Team",
            "🍽️",
            s => ["catering_boy", "main_boy", "supervisor", "captain"].includes(s.position)
          )}

          {renderGroup("Chef Team", "👨‍🍳", s => s.position.includes("chef"))}

          {renderGroup("Decoration", "🎉", s => s.position === "decoration")}
        </div>

        {/* FOOTER */}
        <div className="edit-footer">
          <button className="update-btn" onClick={handleUpdate}>
            Save Changes
          </button>

          <span
            className="cancel-link"
            onClick={() => navigate("/dashboard")}
          >
            Cancel
          </span>
        </div>

      </div>
    </div>
  );
}

export default EditSite;