import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import API from "../api/axios";

export default function ProtectedRoute({ allowedRoles }) {
  const [status, setStatus] = useState("checking");
  const [user, setUser] = useState(null);

  useEffect(() => {
    API.get("/me/", { withCredentials: true })
      .then((res) => {
        setUser(res.data);
        setStatus("allowed");
      })
      .catch(() => {
        setStatus("denied");
      });
  }, []);

  if (status === "checking") {
    return <div>Loading...</div>;
  }

  if (status === "denied") {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles?.length && !allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
