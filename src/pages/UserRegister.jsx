import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import "./UserRegister.css";
import { toast } from "react-toastify"; 

export default function UserRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
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
          role: "worker",
        },
        {
          withCredentials: true,
        }
      );

      toast.success("OTP sent to your email 📧"); 

      navigate("/otp");

    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.error || "Error sending OTP"); 
    }
  };

  return (
    <div className="user-container">
      <h2>User Register</h2>

      <form onSubmit={handleSubmit}>
        <input name="username" placeholder="Username" onChange={handleChange} />
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