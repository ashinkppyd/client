import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";
import "./MFA.css";

export default function MFA() {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      return toast.error("Enter valid 6-digit code");
    }

    try {
      setLoading(true);

      const res = await API.post(
        "/verify-login-mfa/",
        { otp: otp.trim() },
        { withCredentials: true }
      );

      console.log(res.data);

      toast.success("Login success 🔐");
      navigate("/", { replace: true });

    } catch (err) {
      console.log("MFA ERROR:", err.response?.data);
      toast.error(err.response?.data?.error || "Invalid OTP ❌");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mfa-container">
      <div className="mfa-card">
        <h2>MFA Verification 🔐</h2>

        <input
          className="mfa-input"
          placeholder="Enter 6-digit code"
          value={otp}
          maxLength={6}
          onChange={(e) =>
            setOtp(e.target.value.replace(/\D/g, ""))
          }
        />

        <button
          className="mfa-btn"
          onClick={handleVerify}
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </div>
    </div>
  );
}
