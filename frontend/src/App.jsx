import { useState, useEffect } from "react";
import TodoList from "./components/TodoList";
import AddTodo from "./components/AddTodo";
import FilterBar from "./components/FilterBar";

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
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.headerIcon}>✓</div>
          <h1 style={styles.title}>My Tasks</h1>
          <p style={styles.subtitle}>Stay organized, get things done</p>
        </header>

        <AddTodo onAdd={addTodo} />

        <FilterBar filter={filter} setFilter={setFilter} counts={counts} />

        {loading && <div style={styles.message}>Loading tasks...</div>}
        {error && <div style={styles.error}>{error}</div>}
        {!loading && !error && (
          <TodoList todos={filtered} onUpdate={updateTodo} onDelete={deleteTodo} />
        )}

        {!loading && !error && todos.length > 0 && (
          <footer style={styles.footer}>
            {counts.active} task{counts.active !== 1 ? "s" : ""} remaining
          </footer>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "40px 16px",
  },
  container: {
    width: "100%",
    maxWidth: "600px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  header: {
    textAlign: "center",
    color: "white",
    marginBottom: "8px",
  },
  headerIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    background: "rgba(255,255,255,0.2)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "28px",
    margin: "0 auto 12px",
    backdropFilter: "blur(10px)",
  },
  title: {
    fontSize: "32px",
    fontWeight: "700",
    letterSpacing: "-0.5px",
  },
  subtitle: {
    fontSize: "15px",
    opacity: 0.8,
    marginTop: "4px",
    fontWeight: "400",
  },
  message: {
    textAlign: "center",
    color: "rgba(255,255,255,0.8)",
    padding: "32px",
  },
  error: {
    background: "#fee2e2",
    color: "#dc2626",
    borderRadius: "12px",
    padding: "16px",
    textAlign: "center",
  },
  footer: {
    textAlign: "center",
    color: "rgba(255,255,255,0.7)",
    fontSize: "14px",
    paddingBottom: "16px",
  },
};
