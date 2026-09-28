import React from "react";
import { Link } from "react-router-dom";

export default function OpportunityCard({ opportunity }) {
  return (
    <div className="card">
      <h3>{opportunity.title}</h3>
      <p><strong>{opportunity.organization}</strong> · {opportunity.category}</p>
      <p>{opportunity.mode} {opportunity.location ? `· ${opportunity.location}` : ""}</p>
      {opportunity.deadline && (
        <p>Deadline: {new Date(opportunity.deadline).toLocaleDateString()}</p>
      )}
      <p>{(opportunity.description || "").slice(0, 100)}{opportunity.description?.length > 100 ? "…" : ""}</p>
      <Link to={`/opportunities/${opportunity._id}`}>
        <button>View & Apply</button>
      </Link>
    </div>
  );
}
