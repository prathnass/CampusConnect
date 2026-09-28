// This "context" is how the whole app knows who's logged in without
// passing the user/token down through every component as props.
// Any component can call useAuth() to read or update the login state.
import React, { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // On first load, check if we already saved a session in localStorage
  // (so refreshing the page doesn't log the user out).
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("cc_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("cc_token"));

  function login(userData, authToken) {
    setUser(userData);
    setToken(authToken);
    // We use localStorage only to remember the SESSION token/user on this
    // device — the actual account data lives in MongoDB, never here.
    localStorage.setItem("cc_user", JSON.stringify(userData));
    localStorage.setItem("cc_token", authToken);
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("cc_user");
    localStorage.removeItem("cc_token");
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin: user?.role === "admin" }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
