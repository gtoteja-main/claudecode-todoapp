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

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <input
        style={{ ...styles.input, ...(focused ? styles.inputFocused : {}) }}
        type="text"
        placeholder="Add a new task..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
      <button
        type="submit"
        style={{ ...styles.button, ...(value.trim() ? styles.buttonActive : {}) }}
        disabled={!value.trim()}
      >
        Add
      </button>
    </form>
  );
}

const styles = {
  form: {
    display: "flex",
    gap: "10px",
  },
  input: {
    flex: 1,
    padding: "14px 18px",
    borderRadius: "12px",
    border: "2px solid transparent",
    background: "white",
    fontSize: "15px",
    outline: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    transition: "border-color 0.2s, box-shadow 0.2s",
    color: "#1e293b",
  },
  inputFocused: {
    borderColor: "#667eea",
    boxShadow: "0 2px 12px rgba(102,126,234,0.3)",
  },
  button: {
    padding: "14px 24px",
    borderRadius: "12px",
    border: "none",
    background: "#e2e8f0",
    color: "#94a3b8",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "not-allowed",
    transition: "all 0.2s",
    fontFamily: "Inter, sans-serif",
  },
  buttonActive: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    color: "white",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(102,126,234,0.4)",
  },
};
