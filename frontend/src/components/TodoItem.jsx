import { useState } from "react";

export default function TodoItem({ todo, onUpdate, onDelete, error, onDismissError }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const [hovered, setHovered] = useState(false);

  const saveEdit = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== todo.title) onUpdate(todo.id, { title: trimmed });
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") { setEditValue(todo.title); setEditing(false); }
  };

  return (
    <div style={styles.wrapper}>
      <div
        style={{
          ...styles.row,
          ...(hovered ? styles.rowHovered : {}),
          ...(todo.completed ? styles.rowDone : {}),
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Checkbox */}
        <button
          onClick={() => onUpdate(todo.id, { completed: !todo.completed })}
          style={{ ...styles.checkbox, ...(todo.completed ? styles.checkboxDone : {}) }}
          title="Toggle complete"
          aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
        >
          {todo.completed && (
            <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1.5 6 4.5 9 10.5 3" />
            </svg>
          )}
        </button>

        {/* Text / Edit field */}
        <div style={styles.content}>
          {editing ? (
            <input
              autoFocus
              style={styles.editInput}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onBlur={saveEdit}
              onKeyDown={handleKeyDown}
              aria-label="Edit task title"
            />
          ) : (
            <span
              style={{ ...styles.label, ...(todo.completed ? styles.labelDone : {}) }}
              onDoubleClick={() => { setEditValue(todo.title); setEditing(true); }}
              title="Double-click to edit"
            >
              {todo.title}
            </span>
          )}
        </div>

        {/* Action buttons */}
        <div style={{ ...styles.actions, opacity: hovered || editing ? 1 : 0 }}>
          {!editing && (
            <button
              onClick={() => { setEditValue(todo.title); setEditing(true); }}
              style={styles.iconBtn}
              title="Edit task"
              aria-label="Edit"
            >
              <EditIcon />
            </button>
          )}
          <button
            onClick={() => onDelete(todo.id)}
            style={{ ...styles.iconBtn, ...styles.deleteBtn }}
            title="Delete task"
            aria-label="Delete"
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* Per-item operation error */}
      {error && (
        <div style={styles.errorBar} role="alert">
          <span>⚠️ {error}</span>
          <button style={styles.dismissBtn} onClick={onDismissError} aria-label="Dismiss error">✕</button>
        </div>
      )}
    </div>
  );
}

function EditIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2" />
    </svg>
  );
}

const styles = {
  wrapper: {
    display: "flex",
    flexDirection: "column",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    background: "white",
    transition: "background 0.15s",
  },
  rowHovered: { background: "#f8fbff" },
  rowDone: { background: "#fafcff" },
  checkbox: {
    width: "20px",
    height: "20px",
    borderRadius: "6px",
    border: "1.5px solid #bcd5f0",
    background: "white",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.15s",
    padding: 0,
    cursor: "pointer",
  },
  checkboxDone: {
    background: "#3b82f6",
    borderColor: "#3b82f6",
  },
  content: { flex: 1, minWidth: 0 },
  label: {
    fontSize: "14px",
    fontWeight: "450",
    color: "#1a2b3c",
    display: "block",
    cursor: "default",
    userSelect: "none",
  },
  labelDone: {
    textDecoration: "line-through",
    color: "#a0bdd8",
    fontWeight: "400",
  },
  editInput: {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: "14px",
    fontWeight: "450",
    color: "#1a2b3c",
    fontFamily: "inherit",
    background: "transparent",
    borderBottom: "1.5px solid #3b82f6",
    paddingBottom: "1px",
  },
  actions: {
    display: "flex",
    gap: "4px",
    flexShrink: 0,
    transition: "opacity 0.15s",
  },
  iconBtn: {
    width: "30px",
    height: "30px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    color: "#7aa3c8",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "background 0.15s, color 0.15s",
    padding: 0,
  },
  deleteBtn: { color: "#f87171" },
  errorBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "6px 16px",
    background: "#fef2f2",
    borderTop: "1px solid #fecaca",
    fontSize: "12px",
    color: "#dc2626",
  },
  dismissBtn: {
    background: "none",
    border: "none",
    color: "#dc2626",
    cursor: "pointer",
    fontSize: "12px",
    padding: "0 2px",
    lineHeight: 1,
    fontFamily: "inherit",
  },
};
