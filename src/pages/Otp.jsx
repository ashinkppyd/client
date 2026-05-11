import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; 

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [otpExpired, setOtpExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ⏱ TIMER
  useEffect(() => {
    if (timer <= 0) {
      setOtpExpired(true);
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await API.post(
        "/verify-otp/",
        {
          otp: otp,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Registration Successful 🎉"); 
      navigate("/login");

    } catch (err) {
      console.log(err.response?.data);

      if (err.response?.data?.error === "OTP expired") {
        setOtpExpired(true);
      }

      toast.error(err.response?.data?.error || "Invalid OTP ❌"); 

    } finally {
      setLoading(false);
    }
  };

 
  const handleResend = async () => {
    setLoading(true);

    try {
      await API.post(
        "/resend-otp/",
        {},
        {
          withCredentials: true,
        }
      );

      toast.success("OTP Sent Again 🔁"); 

      setTimer(30);
      setOtpExpired(false);
      setOtp("");

    } catch (err) {
      toast.error(err.response?.data?.error || "Error resending OTP"); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="user-container">
      <h2>Enter OTP</h2>

      {!otpExpired && <p>Expires in: {timer}s</p>}

      <form onSubmit={handleVerify}>
        <input
          placeholder="Enter OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          disabled={otpExpired}
        />

        {otpExpired ? (
          <button
            type="button"
            onClick={handleResend}
            disabled={loading}
            style={{ background: "orange" }}
          >
            {loading ? "Sending..." : "Resend OTP"}
          </button>
        ) : (
          <button
            type="submit"
            disabled={loading}
            style={{ background: "green" }}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        )}
      </form>
    </div>
  );
}
