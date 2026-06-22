const BASE = import.meta.env.VITE_API_BASE_URL ?? "";

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export const api = {
  getTodos: () => request("/api/todos"),

  createTodo: (title) =>
    request("/api/todos", { method: "POST", body: JSON.stringify({ title }) }),

  updateTodo: (id, changes) =>
    request(`/api/todos/${id}`, { method: "PUT", body: JSON.stringify(changes) }),

  deleteTodo: (id) =>
    request(`/api/todos/${id}`, { method: "DELETE" }),
};
