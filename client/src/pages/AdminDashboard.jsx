import React, { useEffect, useState } from "react";
import { api } from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const emptyForm = {
  title: "", organization: "", description: "", category: "",
  mode: "Remote", location: "", skills: "", eligibility: "", deadline: "",
};

export default function AdminDashboard() {
  const { token } = useAuth();
  const [opportunities, setOpportunities] = useState([]);
  const [applications, setApplications] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");
  const [tab, setTab] = useState("opportunities"); // "opportunities" | "applications"

  function loadData() {
    api.getOpportunities().then((res) => setOpportunities(res.data)).catch(() => {});
    api.getAllApplications(token).then((res) => setApplications(res.data)).catch(() => {});
  }

  useEffect(loadData, [token]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    const payload = { ...form, skills: form.skills ? form.skills.split(",").map((s) => s.trim()) : [] };
    try {
      if (editingId) {
        await api.updateOpportunity(editingId, payload, token);
      } else {
        await api.createOpportunity(payload, token);
      }
      setForm(emptyForm);
      setEditingId(null);
      loadData();
    } catch (err) {
      setError(err.message);
    }
  }

  function startEdit(o) {
    setEditingId(o._id);
    setForm({
      title: o.title, organization: o.organization, description: o.description || "",
      category: o.category || "", mode: o.mode || "Remote", location: o.location || "",
      skills: (o.skills || []).join(", "), eligibility: o.eligibility || "",
      deadline: o.deadline ? o.deadline.slice(0, 10) : "",
    });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this opportunity?")) return;
    await api.deleteOpportunity(id, token);
    loadData();
  }

  async function handleStatusChange(id, status) {
    await api.updateApplicationStatus(id, status, token);
    loadData();
  }

  return (
    <div className="container">
      <h1>Admin Dashboard</h1>
      <div>
        <button className={tab === "opportunities" ? "" : "secondary"} onClick={() => setTab("opportunities")}>Opportunities</button>{" "}
        <button className={tab === "applications" ? "" : "secondary"} onClick={() => setTab("applications")}>Applications</button>
      </div>

      {tab === "opportunities" && (
        <>
          <div className="card">
            <h2>{editingId ? "Edit Opportunity" : "Create Opportunity"}</h2>
            {error && <p className="error-text">{error}</p>}
            <form onSubmit={handleSubmit}>
              <input name="title" placeholder="Title" value={form.title} onChange={handleChange} required />
              <input name="organization" placeholder="Organization" value={form.organization} onChange={handleChange} required />
              <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} rows={3} />
              <input name="category" placeholder="Category (e.g. Web Development)" value={form.category} onChange={handleChange} />
              <select name="mode" value={form.mode} onChange={handleChange}>
                <option>Remote</option><option>Hybrid</option><option>On-site</option>
              </select>
              <input name="location" placeholder="Location" value={form.location} onChange={handleChange} />
              <input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} />
              <input name="eligibility" placeholder="Eligibility" value={form.eligibility} onChange={handleChange} />
              <input name="deadline" type="date" value={form.deadline} onChange={handleChange} />
              <button type="submit">{editingId ? "Save Changes" : "Create"}</button>{" "}
              {editingId && <button type="button" className="secondary" onClick={() => { setEditingId(null); setForm(emptyForm); }}>Cancel</button>}
            </form>
          </div>

          <div className="grid">
            {opportunities.map((o) => (
              <div className="card" key={o._id}>
                <h3>{o.title}</h3>
                <p>{o.organization}</p>
                <button onClick={() => startEdit(o)}>Edit</button>{" "}
                <button className="secondary" onClick={() => handleDelete(o._id)}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === "applications" && (
        <div className="card">
          <h2>All Applications</h2>
          <div style={{ overflowX: "auto" }}>
            <table>
              <thead><tr><th>Student</th><th>Opportunity</th><th>Status</th><th>Update</th></tr></thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app._id}>
                    <td>{app.userId?.name}<br /><small>{app.userId?.email}</small></td>
                    <td>{app.opportunityId?.title}</td>
                    <td><span className={`badge ${app.status.replace(" ", "-")}`}>{app.status}</span></td>
                    <td>
                      <select value={app.status} onChange={(e) => handleStatusChange(app._id, e.target.value)}>
                        <option>Applied</option><option>Under Review</option><option>Selected</option><option>Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
