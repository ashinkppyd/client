import { useCallback, useEffect, useState } from "react";
import API from "../../api/axios";
import Sidebar from "../components/Sidebar";
import "../Admin.css";

export default function Workers() {
  const [workers, setWorkers] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const fetchWorkers = useCallback(() => {
    API.get("/admin/workers/")
      .then((res) => {
        setWorkers(res.data);
        setError("");
      })
      .catch(() => {
        setError("Could not load workers.");
      });
  }, []);

  useEffect(() => {
    fetchWorkers();
  }, [fetchWorkers]);

  const updateStatus = async (id, active) => {
    setBusyId(id);
    setError("");

    try {
      await API.patch(`/admin/${active ? "unblock" : "block"}/${id}/`, {});
      fetchWorkers();
    } catch {
      setError("Could not update this worker.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="admin-shell">
      <Sidebar />

      <main className="admin-main">
        <div className="admin-page-head">
          <div>
            <h1>Workers</h1>
            <p>Manage worker accounts and access.</p>
          </div>
        </div>

        <div className="admin-panel">
          {error ? <div className="admin-error">{error}</div> : null}

          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>District</th>
                <th>State</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {workers.map((worker) => (
                <tr key={worker.id}>
                  <td>{worker.username || "-"}</td>
                  <td>{worker.email || "-"}</td>
                  <td>{worker.phone || "-"}</td>
                  <td>{worker.district || "-"}</td>
                  <td>{worker.state || "-"}</td>
                  <td>
                    <span
                      className={`admin-status ${
                        worker.is_active ? "active" : "blocked"
                      }`}
                    >
                      {worker.is_active ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`admin-action-btn ${
                        worker.is_active ? "block" : "unblock"
                      }`}
                      disabled={busyId === worker.id}
                      onClick={() => updateStatus(worker.id, !worker.is_active)}
                    >
                      {worker.is_active ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!workers.length && !error ? (
            <div className="admin-empty">No workers found.</div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
