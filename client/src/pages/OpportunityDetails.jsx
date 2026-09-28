import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function OpportunityDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token } = useAuth();

  const [opportunity, setOpportunity] = useState(null);
  const [coverNote, setCoverNote] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOpportunity(id)
      .then((res) => setOpportunity(res.data))
      .catch(() => setError("Unable to load this opportunity."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleApply(e) {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!user) {
      // Sending an unauthenticated user to login is friendlier than a
      // silent failure.
      navigate("/login");
      return;
    }

    try {
      await api.apply({ opportunityId: id, coverNote }, token);
      setMessage("Application submitted! You can track it on your dashboard.");
    } catch (err) {
      setError(err.message);
    }
  }

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error && !opportunity) return <div className="container"><p className="error-text">{error}</p></div>;

  return (
    <div className="container">
      <div className="card">
        <h1>{opportunity.title}</h1>
        <p><strong>{opportunity.organization}</strong></p>
        <p>{opportunity.mode} {opportunity.location ? `· ${opportunity.location}` : ""}</p>
        {opportunity.deadline && <p>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</p>}
        <p>{opportunity.description}</p>
        {opportunity.eligibility && <p><strong>Eligibility:</strong> {opportunity.eligibility}</p>}
        {opportunity.skills?.length > 0 && <p><strong>Skills:</strong> {opportunity.skills.join(", ")}</p>}
      </div>

      <div className="card">
        <h2>Apply</h2>
        {message && <p style={{ color: "#166534" }}>{message}</p>}
        {error && opportunity && <p className="error-text">{error}</p>}
        <form onSubmit={handleApply}>
          <textarea
            placeholder="Optional cover note..."
            value={coverNote}
            onChange={(e) => setCoverNote(e.target.value)}
            rows={4}
          />
          <button type="submit">{user ? "Submit Application" : "Log in to Apply"}</button>
        </form>
      </div>
    </div>
  );
}
