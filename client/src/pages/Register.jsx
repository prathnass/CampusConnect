import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { api } from "../api/api.js";
import { useAuth } from "../context/AuthContext.jsx";

const initialForm = {
  name: "", email: "", password: "", college: "", course: "", graduationYear: "", skills: "",
};

export default function Register() {
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Simple client-side validation (Challenge 3). The server re-checks
  // everything too — never trust validation that only happens in the browser.
  function validate() {
    if (!form.name.trim()) return "Please enter your name.";
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(form.email)) return "Please enter a valid email address.";
    if (form.password.length < 6) return "Password must be at least 6 characters.";
    return "";
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    setError("");
    setLoading(true);
    try {
      const payload = {
        ...form,
        graduationYear: form.graduationYear ? Number(form.graduationYear) : undefined,
        skills: form.skills ? form.skills.split(",").map((s) => s.trim()) : [],
      };
      const res = await api.register(payload);
      login(res.user, res.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message); // e.g. "An account with this email already exists"
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <div className="card">
        <h1>Create an account</h1>
        {error && <p className="error-text">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Full Name" value={form.name} onChange={handleChange} />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} />
          <input name="college" placeholder="College" value={form.college} onChange={handleChange} />
          <input name="course" placeholder="Course" value={form.course} onChange={handleChange} />
          <input name="graduationYear" type="number" placeholder="Graduation Year" value={form.graduationYear} onChange={handleChange} />
          <input name="skills" placeholder="Skills (comma separated)" value={form.skills} onChange={handleChange} />
          <button type="submit" disabled={loading}>{loading ? "Creating account..." : "Register"}</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}
