import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <nav className="navbar">
      <Link to="/" style={{ fontWeight: "bold", fontSize: "1.2rem" }}>CampusConnect</Link>
      <div>
        <Link to="/opportunities">Opportunities</Link>
        {user ? (
          <>
            <Link to={isAdmin ? "/admin" : "/dashboard"}>Dashboard</Link>
            <a onClick={handleLogout} style={{ cursor: "pointer" }}>Logout</a>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
