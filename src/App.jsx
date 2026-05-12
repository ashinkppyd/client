import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import UserRegister from "./pages/UserRegister";
import CompanyRegister from "./pages/CompanyRegister";
import Home from "./pages/Home";
import OtpPage from "./pages/Otp"; 
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify"; 
import "react-toastify/dist/ReactToastify.css";
import Profile from "./pages/Profile";
import MFA from "./pages/MFA";

import CreateSite from "./company/CreateSite";
import Dashboard from "./company/Dashboard";
import BookingRequests from "./company/BookingRequests";

import EditSite from "./company/EditSite";
import WorkerProfile from "./company/WorkerProfile";

import WorkerSites from "./worker/WorkerSites";
import SiteReport from "./worker/SiteReport";
import PaymentReport from "./worker/PaymentReport";
import SiteAttendance from "./company/SiteAttendance";
import ChatPage from "./Chat/ChatPage";
import NotificationBell from "./components/NotificationBell";
import AiService from "./pages/AiService";
import ProtectedRoute from "./routes/ProtectedRoute";
import PublicRoute from "./routes/PublicRoute";
import AdminProtectedRoute from "./routes/AdminProtectedRoute";
import AdminDashboard from "./admin/pages/Dashboard";
import AdminWorkers from "./admin/pages/Workers";
import AdminCompanies from "./admin/pages/Companies";



function App() {

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("✅ SW registered:", registration.scope);
    })
    .catch((err) => {
      console.log("❌ SW registration failed:", err);
    });
}

  return (
    
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/user-register" element={<UserRegister />} />
          <Route path="/company-register" element={<CompanyRegister />} />
          <Route path="/otp" element={<OtpPage />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/change-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />
          <Route path="/reset-password/:uid/:token/" element={<ResetPassword />} />
          <Route path="/mfa" element={<MFA />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/notifications" element={<NotificationBell />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/ai-service" element={<AiService />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["company"]} />}>
          <Route path="/create-site" element={<CreateSite />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bookings" element={<BookingRequests />} />
          <Route path="/edit-site/:id" element={<EditSite />} />
          <Route path="/worker-profile/:id" element={<WorkerProfile />} />
          <Route path="/site-attendance" element={<SiteAttendance />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={["worker"]} />}>
          <Route path="/jobs" element={<WorkerSites />} />
          <Route path="/sites" element={<WorkerSites />} />
          <Route path="/site-report" element={<SiteReport />} />
          <Route path="/payment-report" element={<PaymentReport />} />
        </Route>

        <Route element={<AdminProtectedRoute />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/workers" element={<AdminWorkers />} />
          <Route path="/admin/companies" element={<AdminCompanies />} />
        </Route>
      </Routes>

      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  );
}

export default App;
