import { useState } from "react";
import api from "../api/axios";
import "./CreateSite.css";
import { toast } from "react-toastify";

function CreateSite() {
  const [form, setForm] = useState({
    name: "",
    location: "",
    date: "",
    reporting_time: "",
    slots: [
      { position: "juicer", total_slots: 0 },
      { position: "juicer_helper", total_slots: 0 },
      { position: "catering_boy", total_slots: 0 },
      { position: "main_boy", total_slots: 0 },
      { position: "supervisor", total_slots: 0 },
      { position: "captain", total_slots: 0 },
      { position: "chef_helper", total_slots: 0 },
      { position: "decoration", total_slots: 0 },
    ],
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSlotChange = (index, value) => {
    const updated = [...form.slots];
    updated[index].total_slots = Math.max(0, parseInt(value || 0));
    setForm({ ...form, slots: updated });
  };

  const validateForm = () => {
    if (!form.name || !form.location || !form.date || !form.reporting_time) {
      toast.error("Please fill all basic details ❌");
      return false;
    }
    if (!form.slots.some((s) => s.total_slots > 0)) {
      toast.error("Add at least one slot ❌");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    setLoading(true);

    try {
      
      await api.post("create-site/", form); 

      toast.success("Event Site Created Successfully ✅");
      setForm({
        name: "", location: "", date: "", reporting_time: "",
        slots: [
          { position: "juicer", total_slots: 0 },
          { position: "juicer_helper", total_slots: 0 },
          { position: "catering_boy", total_slots: 0 },
          { position: "main_boy", total_slots: 0 },
          { position: "supervisor", total_slots: 0 },
          { position: "captain", total_slots: 0 },
          { position: "chef_helper", total_slots: 0 },
          { position: "decoration", total_slots: 0 },
        ],
      });
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create site ❌");
    } finally {
      setLoading(false);
    }
  };


  const renderSlotCategory = (title, icon, filterFn) => (
    <div className="slots-category">
      <h4 className="category-title">{icon} {title}</h4>
      <div className="slots-grid">
        {form.slots.map((slot, index) => {
          if (filterFn(slot.position)) {
            return (
              <div key={index} className="slot-input-group">
                <label>{slot.position.replace("_", " ")}</label>
                <input
                  type="number"
                  min="0"
                  value={slot.total_slots}
                  onChange={(e) => handleSlotChange(index, e.target.value)}
                />
              </div>
            );
          }
          return null;
        })}
      </div>
    </div>
  );

  return (
    <div className="create-site-page">
      <div className="form-card">
        <div className="form-header">
          <h2>Create New Event Site</h2>
          <p>Configure event details and required staff positions</p>
        </div>

        <div className="form-body">
          {/* BASIC DETAILS */}
          <div className="form-section">
            <h3>Basic Logistics</h3>
            <div className="input-grid">
              <input name="name" placeholder="Event Name" value={form.name} onChange={handleChange} />
              <input name="location" placeholder="Venue Location" value={form.location} onChange={handleChange} />
              <input type="date" name="date" value={form.date} onChange={handleChange} />
              <input type="time" name="reporting_time" value={form.reporting_time} onChange={handleChange} />
            </div>
          </div>

          {/* SLOTS CATEGORIES */}
          <div className="form-section">
            <h3>Staffing Requirements</h3>
            
            {renderSlotCategory("Juice Section", "🧃", (p) => p.includes("juicer"))}
            
            {renderSlotCategory("Catering Team", "🍽️", (p) => 
              ["catering_boy", "main_boy", "supervisor", "captain"].includes(p)
            )}
            
            {renderSlotCategory("Kitchen Team", "👨‍🍳", (p) => p.includes("chef"))}
            
            {renderSlotCategory("Event Design", "🎉", (p) => p === "decoration")}
          </div>
        </div>

        <div className="form-footer">
          <button className="submit-btn" onClick={handleSubmit} disabled={loading}>
            {loading ? "Establishing Site..." : "Publish Event Site"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateSite;