import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/api.js";
import OpportunityCard from "../components/OpportunityCard.jsx";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getOpportunities()
      .then((res) => setFeatured(res.data.slice(0, 3)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="container">
      <div className="card" style={{ textAlign: "center", padding: "3rem 1.5rem" }}>
        <h1>Find Your Next Opportunity</h1>
        <p>Discover internships, hackathons and workshops — and track every application in one place.</p>
        <Link to="/opportunities"><button>Browse Opportunities</button></Link>
      </div>

      <h2>Featured Opportunities</h2>
      {loading && <p>Loading...</p>}
      {!loading && featured.length === 0 && <p>No opportunities yet — check back soon.</p>}
      <div className="grid">
        {featured.map((o) => <OpportunityCard key={o._id} opportunity={o} />)}
      </div>
    </div>
  );
}
