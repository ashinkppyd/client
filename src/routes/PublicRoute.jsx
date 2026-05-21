import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import API from "../api/axios";

export default function PublicRoute() {
  const [status, setStatus] = useState("checking");

  useEffect(() => {
    API.get("/me/", { withCredentials: true })
      .then(() => {
        setStatus("authenticated");
      })
      .catch(() => {
        setStatus("guest");
      });
  }, []);

  if (status === "checking") {
    return <div>Loading...</div>;
  }

  if (status === "authenticated") {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
