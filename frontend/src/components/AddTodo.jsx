import { useState } from "react";

export default function AddTodo({ onAdd }) {
  const [value, setValue] = useState("");
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    onAdd(value.trim());
    setValue("");
  };

  const active = value.trim().length > 0;

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={{ ...styles.inputWrap, ...(focused ? styles.inputWrapFocused : {}) }}>
        <svg style={styles.searchIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94b8d8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <input
          style={styles.input}
          type="text"
          placeholder="Add a new task…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
        />
      </div>
      <button type="submit" style={{ ...styles.btn, ...(active ? styles.btnActive : {}) }} disabled={!active}>
        Add
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    gap: "10px",
    paddingTop: "20px",
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
  searchIcon: {
    flexShrink: 0,
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
  },
  btnActive: {
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
  },
};
