import TodoItem from "./TodoItem";

export default function TodoList({ todos, onUpdate, onDelete }) {
  if (todos.length === 0) {
    return (
      <div style={styles.empty}>
        <div style={styles.emptyIcon}>🎉</div>
        <p style={styles.emptyText}>Nothing here!</p>
        <p style={styles.emptySubtext}>Add a task above to get started.</p>
      </div>
    );
  }

  return (
    <div style={styles.list}>
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onUpdate={onUpdate} onDelete={onDelete} />
      ))}
    </div>
  );
}

const styles = {
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  empty: {
    background: "rgba(255,255,255,0.15)",
    borderRadius: "16px",
    padding: "48px 24px",
    textAlign: "center",
    backdropFilter: "blur(10px)",
  },
  emptyIcon: {
    fontSize: "40px",
    marginBottom: "12px",
  },
  emptyText: {
    color: "white",
    fontSize: "18px",
    fontWeight: "600",
    marginBottom: "4px",
  },
  emptySubtext: {
    color: "rgba(255,255,255,0.65)",
    fontSize: "14px",
  },
};
