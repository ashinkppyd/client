import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./ResetPassword.css";
import { toast } from "react-toastify"; 

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirm) {
      toast.error("Passwords do not match"); 
      return;
    }

    try {
      await API.post(
        "/reset-password/",
        {
          uid,
          token,
          password,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Password reset successful 🎉"); 

      window.location.href = "/login";

    } catch (err) {
      console.log(err.response?.data);
      toast.error(err.response?.data?.error || "Error resetting password"); 
    }
  };

  return (
    <div className="reset-password-page">
      <div className="reset-container">
        <h2>Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />

          <button type="submit">Update Password</button>
        </form>
      </div>
    </div>
  );
}