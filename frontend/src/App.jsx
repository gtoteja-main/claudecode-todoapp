import { useState, useEffect } from "react";
import Header from "./components/Header";
import AddTodo from "./components/AddTodo";
import FilterBar from "./components/FilterBar";
import TodoList from "./components/TodoList";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/todos")
      .then((r) => r.json())
      .then((data) => { setTodos(data); setLoading(false); })
      .catch(() => { setError("Failed to connect to server."); setLoading(false); });
  }, []);

  const addTodo = async (title) => {
    const res = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });
    const todo = await res.json();
    setTodos((prev) => [...prev, todo]);
  };

  const updateTodo = async (id, changes) => {
    const res = await fetch(`/api/todos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(changes),
    });
    const updated = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
  };

  const deleteTodo = async (id) => {
    await fetch(`/api/todos/${id}`, { method: "DELETE" });
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const filtered = todos.filter((t) =>
    filter === "active" ? !t.completed : filter === "completed" ? t.completed : true
  );

  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <Header activeCount={counts.active} />
        <div style={styles.body}>
          <AddTodo onAdd={addTodo} />
          <FilterBar filter={filter} setFilter={setFilter} counts={counts} />
          {loading && <p style={styles.status}>Loading tasks…</p>}
          {error && <p style={styles.error}>{error}</p>}
          {!loading && !error && (
            <TodoList todos={filtered} onUpdate={updateTodo} onDelete={deleteTodo} />
          )}
        </div>
        {!loading && !error && todos.length > 0 && (
          <div style={styles.footer}>
            <span>{counts.active} task{counts.active !== 1 ? "s" : ""} left</span>
            {counts.completed > 0 && (
              <button
                style={styles.clearBtn}
                onClick={() => todos.filter((t) => t.completed).forEach((t) => deleteTodo(t.id))}
              >
                Clear completed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #dbeeff 0%, #e8f4fd 50%, #d6eaff 100%)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "48px 16px 80px",
  },
  card: {
    width: "100%",
    maxWidth: "560px",
    background: "white",
    borderRadius: "24px",
    boxShadow: "0 4px 6px rgba(59,130,246,0.06), 0 20px 60px rgba(59,130,246,0.12)",
    overflow: "hidden",
  },
  body: {
    padding: "0 24px 8px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  footer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 24px",
    borderTop: "1px solid #e8f2ff",
    fontSize: "13px",
    color: "#7aa3c8",
  },
  clearBtn: {
    background: "none",
    border: "none",
    color: "#7aa3c8",
    fontSize: "13px",
    cursor: "pointer",
    padding: "0",
    textDecoration: "underline",
    textUnderlineOffset: "2px",
  },
  status: {
    textAlign: "center",
    color: "#7aa3c8",
    padding: "24px 0",
    fontSize: "14px",
  },
  error: {
    background: "#fef2f2",
    color: "#dc2626",
    borderRadius: "10px",
    padding: "12px 16px",
    fontSize: "14px",
  },
};
