import { useState } from "react";

export default function TodoItem({ todo, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [editValue, setEditValue] = useState(todo.title);
  const [hovered, setHovered] = useState(false);

  const saveEdit = () => {
    if (editValue.trim() && editValue.trim() !== todo.title) {
      onUpdate(todo.id, { title: editValue.trim() });
    }
    setEditing(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") saveEdit();
    if (e.key === "Escape") { setEditValue(todo.title); setEditing(false); }
  };

  return (
    <div
      style={{ ...styles.item, ...(hovered ? styles.itemHovered : {}), ...(todo.completed ? styles.itemDone : {}) }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <button
        onClick={() => onUpdate(todo.id, { completed: !todo.completed })}
        style={{ ...styles.check, ...(todo.completed ? styles.checkDone : {}) }}
        title="Toggle complete"
      >
        {todo.completed && <span style={styles.checkMark}>✓</span>}
      </button>

      <div style={styles.content}>
        {editing ? (
          <input
            autoFocus
            style={styles.editInput}
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onBlur={saveEdit}
            onKeyDown={handleKeyDown}
          />
        ) : (
          <span style={{ ...styles.title, ...(todo.completed ? styles.titleDone : {}) }}>
            {todo.title}
          </span>
        )}
      </div>

      <div style={styles.actions}>
        {!editing && (
          <button
            onClick={() => { setEditValue(todo.title); setEditing(true); }}
            style={styles.actionBtn}
            title="Edit"
          >
            ✏️
          </button>
        )}
        <button
          onClick={() => onDelete(todo.id)}
          style={{ ...styles.actionBtn, ...styles.deleteBtn }}
          title="Delete"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}

const styles = {
  item: {
    background: "white",
    borderRadius: "12px",
    padding: "14px 16px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    transition: "all 0.2s",
    border: "2px solid transparent",
  },
  itemHovered: {
    boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
    transform: "translateY(-1px)",
  },
  itemDone: {
    background: "#f8fafc",
  },
  check: {
    width: "24px",
    height: "24px",
    borderRadius: "50%",
    border: "2px solid #cbd5e1",
    background: "white",
    cursor: "pointer",
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "all 0.2s",
    padding: 0,
  },
  checkDone: {
    background: "linear-gradient(135deg, #667eea, #764ba2)",
    borderColor: "#667eea",
  },
  checkMark: {
    color: "white",
    fontSize: "13px",
    fontWeight: "700",
    lineHeight: 1,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    fontSize: "15px",
    fontWeight: "500",
    color: "#1e293b",
    display: "block",
  },
  titleDone: {
    textDecoration: "line-through",
    color: "#94a3b8",
    fontWeight: "400",
  },
  editInput: {
    width: "100%",
    border: "none",
    outline: "none",
    fontSize: "15px",
    fontWeight: "500",
    color: "#1e293b",
    fontFamily: "Inter, sans-serif",
    background: "transparent",
    borderBottom: "2px solid #667eea",
    paddingBottom: "2px",
  },
  actions: {
    display: "flex",
    gap: "4px",
    flexShrink: 0,
  },
  actionBtn: {
    width: "32px",
    height: "32px",
    borderRadius: "8px",
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "background 0.15s",
  },
  deleteBtn: {
    color: "#ef4444",
  },
};
