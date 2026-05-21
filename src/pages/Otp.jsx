import { useState, useEffect } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./Otp.css";

export default function OtpPage() {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(30);
  const [otpExpired, setOtpExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ⏱ TIMER — untouched
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

  // ✅ VERIFY — untouched
  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/verify-otp/", { otp }, { withCredentials: true });
      toast.success("Registration Successful 🎉");
      navigate("/login");
    } catch (err) {
      console.log(err.response?.data);
      if (err.response?.data?.error === "OTP expired") setOtpExpired(true);
      toast.error(err.response?.data?.error || "Invalid OTP ❌");
    } finally {
      setLoading(false);
    }
  };

  // 🔁 RESEND — untouched
  const handleResend = async () => {
    setLoading(true);
    try {
      await API.post("/resend-otp/", {}, { withCredentials: true });
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
    <div className="otp-page">
      <div className="otp-blob-bl" />

      <div className="otp-card">
        {/* Brand */}
        <div className="otp-brand">
          <div className="otp-brand-icon">🍽️</div>
          <span className="otp-brand-name">SER<span>VIO</span></span>
        </div>

        {/* Icon */}
        <div className="otp-icon-wrap">✉️</div>

        {/* Heading */}
        <h2 className="otp-heading">Verify Your Email</h2>
        <p className="otp-subtext">
          We've sent a 4-digit code to your registered email address.
          Enter it below to complete your registration.
        </p>

        {/* Timer */}
        <div className="otp-timer-badge">
          {!otpExpired ? (
            <div className="otp-timer-pill active">
              <span className="otp-timer-dot" />
              Code expires in {timer}s
            </div>
          ) : (
            <div className="otp-timer-pill expired">
              <span className="otp-timer-dot expired-dot" />
              Code has expired
            </div>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleVerify}>
          <div className="otp-input-wrap">
            <input
              className="otp-input"
              placeholder="• • • •"
              value={otp}
              maxLength={4}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              disabled={otpExpired}
            />
          </div>

          {otpExpired ? (
            <button
              type="button"
              className="otp-btn resend"
              onClick={handleResend}
              disabled={loading}
            >
              {loading ? "Sending…" : "🔁 Resend Code"}
            </button>
          ) : (
            <button
              type="submit"
              className="otp-btn verify"
              disabled={loading}
            >
              {loading ? "Verifying…" : "✓ Verify & Continue"}
            </button>
          )}
        </form>

        {/* Footer */}
        <p className="otp-footer-note">
          🛡️ Secured by <span>Servio</span> · Check spam if not received
        </p>
      </div>
    </div>
  );
}