import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import API from "../api/axios";

export default function AdminProtectedRoute() {
  const [status, setStatus] = useState("checking");
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/me/")
      .then((res) => {
        setUser(res.data);
        setStatus("allowed");
      })
      .catch(() => {
        localStorage.removeItem("user");
        setStatus("denied");
      });
  }, []);

  if (status === "checking") {
    return <div>Loading...</div>;
  }

  if (status === "denied") {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
