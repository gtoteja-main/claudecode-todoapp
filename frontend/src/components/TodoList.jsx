import TodoItem from "./TodoItem";

export default function TodoList({ todos, onUpdate, onDelete }) {
  if (todos.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 11l3 3L22 4" />
            <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
          </svg>
        </div>
        <p style={styles.emptyTitle}>No tasks here</p>
        <p style={styles.emptySub}>Add a task above to get started</p>
      </div>
    );
  }

  return (
    <ul style={styles.list}>
      {todos.map((todo, i) => (
        <li key={todo.id} style={{ ...styles.item, ...(i < todos.length - 1 ? styles.itemBorder : {}) }}>
          <TodoItem todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
        </li>
      ))}
    </ul>
  );
}

const styles = {
  list: {
    listStyle: "none",
    border: "1.5px solid #e8f2ff",
    borderRadius: "14px",
    overflow: "hidden",
  },
  item: {},
  itemBorder: {
    borderBottom: "1px solid #eef5ff",
  },
  empty: {
    padding: "40px 24px",
    textAlign: "center",
    border: "1.5px dashed #c8e0f7",
    borderRadius: "14px",
    background: "#f8fbff",
  },
  emptyIcon: {
    width: "56px",
    height: "56px",
    borderRadius: "16px",
    background: "#dbeeff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0 auto 14px",
  },
  emptyTitle: {
    fontSize: "15px",
    fontWeight: "600",
    color: "#4a7aa8",
    marginBottom: "4px",
  },
  emptySub: {
    fontSize: "13px",
    color: "#93b8d8",
  },
};
