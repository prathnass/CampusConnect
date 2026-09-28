import React, { useEffect, useState } from "react";
import { api } from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function Dashboard() {
  const { user, token } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api.getMyApplications(token)
      .then((res) => setApplications(res.data))
      .catch(() => setError("Unable to load your applications. Please try again."))
      .finally(() => setLoading(false));
  }, [token]);

  // Compute the summary counts (Applied / Under Review / Selected / Rejected)
  // from the applications we already fetched — no extra API call needed.
  const counts = applications.reduce(
    (acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    },
    { Applied: 0, "Under Review": 0, Selected: 0, Rejected: 0 }
  );

  return (
    <div className="container">
      <h1>Welcome, {user?.name}</h1>

      <div className="grid">
        {Object.entries(counts).map(([status, count]) => (
          <div className="card" key={status} style={{ textAlign: "center" }}>
            <h2>{count}</h2>
            <p>{status}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2>Your Applications</h2>
        {loading && <p>Loading...</p>}
        {error && <p className="error-text">{error}</p>}
        {!loading && !error && applications.length === 0 && <p>You haven't applied to anything yet.</p>}
        {applications.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead>
                <tr><th>Opportunity</th><th>Applied On</th><th>Status</th></tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>{app.opportunityId?.title || "Opportunity removed"}</td>
                    <td>{new Date(app.createdAt).toLocaleDateString()}</td>
                    <td><span className={`badge ${app.status.replace(" ", "-")}`}>{app.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
