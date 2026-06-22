// Vercel serverless handler for PUT /api/tasks/:id and DELETE /api/tasks/:id
let tasks = [
  { id: 1, title: "Buy groceries", completed: false, createdAt: new Date().toISOString() },
  { id: 2, title: "Read a book",   completed: true,  createdAt: new Date().toISOString() },
];

const MAX_TITLE = 500;

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  const id = parseInt(req.query.id, 10);
  const task = tasks.find((t) => t.id === id);
  if (!task) return res.status(404).json({ error: `Task ${id} not found` });

  if (req.method === "PUT") {
    const { title, completed } = req.body ?? {};
    if (title === undefined && completed === undefined)
      return res.status(400).json({ error: "request body must include at least one of: title, completed" });
    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim())
        return res.status(400).json({ error: "title must be a non-blank string" });
      if (title.trim().length > MAX_TITLE)
        return res.status(400).json({ error: `title must be ${MAX_TITLE} characters or fewer` });
      task.title = title.trim();
    }
    if (completed !== undefined) {
      if (typeof completed !== "boolean")
        return res.status(400).json({ error: "completed must be a boolean" });
      task.completed = completed;
    }
    task.updatedAt = new Date().toISOString();
    return res.status(200).json(task);
  }

  if (req.method === "DELETE") {
    const index = tasks.indexOf(task);
    tasks.splice(index, 1);
    return res.status(204).end();
  }

  res.status(405).json({ error: "Method not allowed" });
}
