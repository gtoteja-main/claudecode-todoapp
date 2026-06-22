import { useState, useEffect, useCallback } from "react";
import { api } from "./api";
import Header from "./components/Header";
import AddTodo from "./components/AddTodo";
import FilterBar from "./components/FilterBar";
import TodoList from "./components/TodoList";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  // Per-screen loading/error
  const [loadingInit, setLoadingInit] = useState(true);
  const [initError, setInitError] = useState(null);

  // Per-operation feedback
  const [adding, setAdding] = useState(false);
  const [addError, setAddError] = useState(null);
  const [opErrors, setOpErrors] = useState({}); // { [todoId]: errorMessage }

  const clearOpError = (id) =>
    setOpErrors((prev) => { const next = { ...prev }; delete next[id]; return next; });

  // ── Initial fetch ─────────────────────────────────────────────────────────
  useEffect(() => {
    api.getTasks()
      .then((data) => setTodos(data))
      .catch((err) => setInitError(err.message))
      .finally(() => setLoadingInit(false));
  }, []);

  // ── Create ────────────────────────────────────────────────────────────────
  const addTodo = useCallback(async (title) => {
    setAdding(true);
    setAddError(null);
    try {
      const todo = await api.createTask(title);
      setTodos((prev) => [...prev, todo]);
    } catch (err) {
      setAddError(err.message);
    } finally {
      setAdding(false);
    }
  }, []);

  // ── Toggle complete / Edit title ──────────────────────────────────────────
  const updateTodo = useCallback(async (id, changes) => {
    // Optimistic update
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)));
    clearOpError(id);
    try {
      const updated = await api.updateTask(id, changes);
      setTodos((prev) => prev.map((t) => (t.id === id ? updated : t)));
    } catch (err) {
      // Roll back
      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...revertChanges(t, changes) } : t)));
      setOpErrors((prev) => ({ ...prev, [id]: err.message }));
    }
  }, []);

  // ── Delete ────────────────────────────────────────────────────────────────
  const deleteTodo = useCallback(async (id) => {
    const snapshot = todos.find((t) => t.id === id);
    setTodos((prev) => prev.filter((t) => t.id !== id)); // optimistic
    clearOpError(id);
    try {
      await api.deleteTask(id);
    } catch (err) {
      if (snapshot) setTodos((prev) => [...prev, snapshot]); // roll back
      setOpErrors((prev) => ({ ...prev, [id]: err.message }));
    }
  }, [todos]);

  // ── Clear completed ───────────────────────────────────────────────────────
  const clearCompleted = useCallback(() => {
    todos.filter((t) => t.completed).forEach((t) => deleteTodo(t.id));
  }, [todos, deleteTodo]);

  // ── Derived state ──────────────────────────────────────────────────────────
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
          <AddTodo onAdd={addTodo} loading={adding} error={addError} />
          <FilterBar filter={filter} setFilter={setFilter} counts={counts} />

          {loadingInit && <LoadingSpinner />}
          {initError && <Banner type="error">{initError}</Banner>}

          {!loadingInit && !initError && (
            <TodoList
              todos={filtered}
              onUpdate={updateTodo}
              onDelete={deleteTodo}
              opErrors={opErrors}
              onDismissError={clearOpError}
            />
          )}
        </div>

        {!loadingInit && !initError && todos.length > 0 && (
          <div style={styles.footer}>
            <span>{counts.active} task{counts.active !== 1 ? "s" : ""} left</span>
            {counts.completed > 0 && (
              <button style={styles.clearBtn} onClick={clearCompleted}>
                Clear completed
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Helpers
function revertChanges(original, attempted) {
  // Return original values for the keys that were attempted to change
  return Object.fromEntries(Object.keys(attempted).map((k) => [k, original[k]]));
}

function LoadingSpinner() {
  return (
    <div style={spinnerStyles.wrap}>
      <div style={spinnerStyles.ring} />
      <span style={spinnerStyles.text}>Loading tasks…</span>
    </div>
  );
}

function Banner({ type, children }) {
  const isError = type === "error";
  return (
    <div style={{ ...bannerStyles.base, ...(isError ? bannerStyles.error : bannerStyles.info) }}>
      <span>{isError ? "⚠️" : "ℹ️"}</span>
      <span>{children}</span>
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
    textDecoration: "underline",
    textUnderlineOffset: "2px",
    fontFamily: "inherit",
    padding: 0,
  },
};

const spinnerStyles = {
  wrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
    padding: "32px 0",
  },
  ring: {
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    border: "3px solid #dbeeff",
    borderTopColor: "#3b82f6",
    animation: "spin 0.7s linear infinite",
  },
  text: {
    fontSize: "13px",
    color: "#7aa3c8",
  },
};

const bannerStyles = {
  base: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "12px 14px",
    borderRadius: "10px",
    fontSize: "13px",
  },
  error: {
    background: "#fef2f2",
    color: "#dc2626",
    border: "1px solid #fecaca",
  },
  info: {
    background: "#f0f7ff",
    color: "#1d6fd8",
    border: "1px solid #bcd5f0",
  },
};
