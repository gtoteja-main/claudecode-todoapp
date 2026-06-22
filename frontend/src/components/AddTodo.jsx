import { useState } from "react";

export default function AddTodo({ onAdd, loading, error }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim() || loading) return;
    await onAdd(value.trim());
    setValue(""); // only clear on success (onAdd throws on error)
  };

  const active = value.trim().length > 0 && !loading;

  return (
    <div style={styles.wrap}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={{ ...styles.inputWrap, ...(focused ? styles.inputWrapFocused : {}) }}>
          {loading ? <Spinner /> : <PlusIcon />}
          <input
            style={styles.input}
            type="text"
            placeholder="Add a new task…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            disabled={loading}
            aria-label="New task title"
          />
        </div>
        <button
          type="submit"
          style={{ ...styles.btn, ...(active ? styles.btnActive : {}) }}
          disabled={!active}
          aria-label="Add task"
        >
          {loading ? "Adding…" : "Add"}
        </button>
      </form>

      {error && (
        <p style={styles.error} role="alert">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
}

function PlusIcon() {
  return (
    <svg style={{ flexShrink: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94b8d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function Spinner() {
  return (
    <div style={{
      width: "16px", height: "16px", borderRadius: "50%",
      border: "2px solid #dbeeff", borderTopColor: "#3b82f6",
      animation: "spin 0.7s linear infinite", flexShrink: 0,
    }} />
  );
}

const styles = {
  wrap: {
    paddingTop: "20px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  form: {
    display: "flex",
    gap: "10px",
  },
  inputWrap: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    background: "#f0f7ff",
    border: "1.5px solid #c8e0f7",
    borderRadius: "12px",
    padding: "0 14px",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  inputWrapFocused: {
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 3px rgba(59,130,246,0.12)",
    background: "white",
  },
  input: {
    flex: 1,
    border: "none",
    background: "transparent",
    outline: "none",
    fontSize: "14px",
    color: "#1a2b3c",
    padding: "13px 0",
  },
  btn: {
    padding: "13px 22px",
    borderRadius: "12px",
    border: "none",
    background: "#dbeeff",
    color: "#93b8d8",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "not-allowed",
    transition: "all 0.2s",
    whiteSpace: "nowrap",
    fontFamily: "inherit",
  },
  btnActive: {
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
  },
  error: {
    fontSize: "13px",
    color: "#dc2626",
    background: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "8px",
    padding: "8px 12px",
    margin: 0,
  },
};
