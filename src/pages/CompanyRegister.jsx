import { useState } from "react";
import API from "../api/axios";
import "./CompanyRegister.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 

export default function CompanyRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    company_name: "",
    email: "",
    phone: "",
    state: "",
    district: "",
    place: "",
    password: "",
    confirm_password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/send-otp/",
        {
          ...form,
          role: "company",
        },
        {
          withCredentials: true,
        }
      );

      toast.success("OTP sent to company email 📧"); 

      navigate("/otp");

    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.error || "Error sending OTP"); 
    }
  };

  return (
    <div className="company-container">
      <h2>Company Register</h2>

      <form onSubmit={handleSubmit}>
        <input name="company_name" placeholder="Company Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />
        <input name="phone" placeholder="Phone" onChange={handleChange} />
        <input name="state" placeholder="State" onChange={handleChange} />
        <input name="district" placeholder="District" onChange={handleChange} />
        <input name="place" placeholder="Place" onChange={handleChange} />
        <input name="password" type="password" placeholder="Password" onChange={handleChange} />
        <input name="confirm_password" type="password" placeholder="Confirm Password" onChange={handleChange} />

        <button type="submit">Send OTP</button>
      </form>

      <span className="back-link" onClick={() => navigate("/login")}>
        Back to Login
      </span>
    </div>
  );
}