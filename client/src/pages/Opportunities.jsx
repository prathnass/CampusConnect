import React, { useEffect, useState } from "react";
import { api } from "../api/api.js";
import OpportunityCard from "../components/OpportunityCard.jsx";

export default function Opportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [search, setSearch] = useState("");
  const [mode, setMode] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    api.getOpportunities()
      .then((res) => setOpportunities(res.data))
      .catch(() => setError("Unable to load opportunities. Please try again."))
      .finally(() => setLoading(false));
  }, []);

  // Filtering client-side here, as the project brief suggests (Step 11).
  const filtered = opportunities.filter((o) => {
    const matchesSearch = o.title.toLowerCase().includes(search.toLowerCase());
    const matchesMode = mode ? o.mode === mode : true;
    return matchesSearch && matchesMode;
  });

  return (
    <div className="container">
      <h1>Opportunities</h1>
      <div className="card">
        <input
          placeholder="Search internships..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={mode} onChange={(e) => setMode(e.target.value)}>
          <option value="">All modes</option>
          <option value="Remote">Remote</option>
          <option value="Hybrid">Hybrid</option>
          <option value="On-site">On-site</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error-text">{error}</p>}
      {!loading && !error && filtered.length === 0 && <p>No opportunities match your search.</p>}

      <div className="grid">
        {filtered.map((o) => <OpportunityCard key={o._id} opportunity={o} />)}
      </div>
    </div>
  );
}
