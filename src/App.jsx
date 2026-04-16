import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import UserRegister from "./pages/UserRegister";
import CompanyRegister from "./pages/CompanyRegister";
import Home from "./pages/Home";
import OtpPage from "./pages/Otp"; 
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import { ToastContainer } from "react-toastify"; // ✅ added
import "react-toastify/dist/ReactToastify.css"; // ✅ added
import Profile from "./pages/Profile";
import MFA from "./pages/MFA";



function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/user-register" element={<UserRegister />} />
        <Route path="/company-register" element={<CompanyRegister />} />
        <Route path="/otp" element={<OtpPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:uid/:token/" element={<ResetPassword />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/mfa" element={<MFA />} />
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;