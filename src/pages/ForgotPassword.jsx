import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./ForgotPassword.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await API.post(
        "/forgot-password/",
        { email },
        {
          withCredentials: true, 
        }
      );

      alert("Reset link sent to your email 📧");

    } catch (err) {
      console.log(err.response?.data);
      alert(err.response?.data?.error || "Error sending reset link");
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-container">
        <h2>Get Help With Login ?</h2>
        <p>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button type="submit">Send Reset Link</button>
        </form>

        <span className="back-link" onClick={() => navigate("/login")}>
          Back to Login
        </span>
      </div>
    </div>
  );
}