import { useCallback, useEffect, useState } from "react";
import API from "../../api/axios";
import Sidebar from "../components/Sidebar";
import "../Admin.css";

export default function Companies() {
  const [companies, setCompanies] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState("");

  const fetchCompanies = useCallback(() => {
    API.get("/admin/companies/")
      .then((res) => {
        setCompanies(res.data);
        setError("");
      })
      .catch(() => {
        setError("Could not load companies.");
      });
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  const updateStatus = async (id, active) => {
    setBusyId(id);
    setError("");

    try {
      await API.patch(`/admin/${active ? "unblock" : "block"}/${id}/`, {});
      fetchCompanies();
    } catch {
      setError("Could not update this company.");
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
            <h1>Companies</h1>
            <p>Manage company accounts and access.</p>
          </div>
        </div>

        <div className="admin-panel">
          {error ? <div className="admin-error">{error}</div> : null}

          <table className="admin-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Email</th>
                <th>Phone</th>
                <th>District</th>
                <th>State</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {companies.map((company) => (
                <tr key={company.id}>
                  <td>{company.company_name || company.username || "-"}</td>
                  <td>{company.email || "-"}</td>
                  <td>{company.phone || "-"}</td>
                  <td>{company.district || "-"}</td>
                  <td>{company.state || "-"}</td>
                  <td>
                    <span
                      className={`admin-status ${
                        company.is_active ? "active" : "blocked"
                      }`}
                    >
                      {company.is_active ? "Active" : "Blocked"}
                    </span>
                  </td>
                  <td>
                    <button
                      className={`admin-action-btn ${
                        company.is_active ? "block" : "unblock"
                      }`}
                      disabled={busyId === company.id}
                      onClick={() => updateStatus(company.id, !company.is_active)}
                    >
                      {company.is_active ? "Block" : "Unblock"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {!companies.length && !error ? (
            <div className="admin-empty">No companies found.</div>
          ) : null}
        </div>
      </main>
    </div>
  );
}
