export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

async function request(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  if (!res.ok) {
    throw new Error(`Eroare server: ${res.status}`);
  }
  return res.status === 204 ? null : res.json();
}

export function fetchPlati() {
  return request("/plati");
}

export function createPlata(plata) {
  return request("/plati", { method: "POST", body: JSON.stringify(plata) });
}

export function updatePlata(id, changes) {
  return request(`/plati/${id}`, {
    method: "PATCH",
    body: JSON.stringify(changes),
  });
}

export function deletePlata(id) {
  return request(`/plati/${id}`, { method: "DELETE" });
}

export function fetchPlata(id) {
  return request(`/plati/${id}`);
}
