import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import GoogleAuth from "./GoogleAuth";
import "./Login.css";
import { toast } from "react-toastify";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/login/", form, {
        withCredentials: true,
      });

      console.log(res.data);

      
      if (res.data.mfa_required) {
        toast.info("Enter MFA code 🔐");
        navigate("/mfa");   
        return;
      }

      
      toast.success("Login successful 🎉");
      window.location.href = "/";

    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data);
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <input
          name="username"
          placeholder="Username or Email"
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
        />

        <button type="submit">Login</button>

        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <GoogleAuth />
        </div>

        <div className="login-footer">
          <span onClick={() => navigate("/user-register")}>
            Register here
          </span>

          <span onClick={() => navigate("/forgot-password")}>
            Forgot Password?
          </span>
        </div>
      </form>
    </div>
  );
}