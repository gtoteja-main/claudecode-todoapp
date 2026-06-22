let todos = [
  { id: 1, title: "Buy groceries", completed: false, createdAt: new Date().toISOString() },
  { id: 2, title: "Read a book", completed: true, createdAt: new Date().toISOString() },
];

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  const id = parseInt(req.query.id);

  if (req.method === "PUT") {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    const { title, completed } = req.body;
    if (title !== undefined) todo.title = title.trim();
    if (completed !== undefined) todo.completed = completed;
    return res.status(200).json(todo);
  }

  if (req.method === "DELETE") {
    const index = todos.findIndex((t) => t.id === id);
    if (index === -1) return res.status(404).json({ error: "Todo not found" });
    todos.splice(index, 1);
    return res.status(204).end();
  }

  res.status(405).json({ error: "Method not allowed" });
}
