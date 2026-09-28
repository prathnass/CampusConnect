// One central place for all backend calls, so the rest of the app never
// has to remember URLs, headers, or how to attach the auth token.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, { method = "GET", body, token } = {}) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  // The Fetch API does NOT throw on 4xx/5xx responses — response.ok
  // must be checked explicitly, or errors silently get swallowed.
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
}

export const api = {
  register: (payload) => request("/auth/register", { method: "POST", body: payload }),
  login: (payload) => request("/auth/login", { method: "POST", body: payload }),

  getOpportunities: (query = "") => request(`/opportunities${query}`),
  getOpportunity: (id) => request(`/opportunities/${id}`),
  createOpportunity: (payload, token) => request("/opportunities", { method: "POST", body: payload, token }),
  updateOpportunity: (id, payload, token) => request(`/opportunities/${id}`, { method: "PUT", body: payload, token }),
  deleteOpportunity: (id, token) => request(`/opportunities/${id}`, { method: "DELETE", token }),

  apply: (payload, token) => request("/applications", { method: "POST", body: payload, token }),
  getMyApplications: (token) => request("/applications/my", { token }),
  getAllApplications: (token) => request("/applications", { token }),
  updateApplicationStatus: (id, status, token) =>
    request(`/applications/${id}/status`, { method: "PUT", body: { status }, token }),
};
