// Vercel serverless handler for GET /api/tasks and POST /api/tasks
let tasks = [
  { id: 1, title: "Buy groceries", completed: false, createdAt: new Date().toISOString() },
  { id: 2, title: "Read a book",   completed: true,  createdAt: new Date().toISOString() },
];
let nextId = 3;

const MAX_TITLE = 500;

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    const { status } = req.query;
    if (status && !["active", "completed"].includes(status)) {
      return res.status(400).json({ error: "status must be 'active' or 'completed'" });
    }
    const result = status
      ? tasks.filter((t) => (status === "active" ? !t.completed : t.completed))
      : tasks;
    return res.status(200).json(result);
  }

  if (req.method === "POST") {
    const { title } = req.body ?? {};
    if (!title || typeof title !== "string" || !title.trim())
      return res.status(400).json({ error: "title is required and must not be blank" });
    if (title.trim().length > MAX_TITLE)
      return res.status(400).json({ error: `title must be ${MAX_TITLE} characters or fewer` });
    const task = { id: nextId++, title: title.trim(), completed: false, createdAt: new Date().toISOString() };
    tasks.push(task);
    return res.status(201).json(task);
  }

  res.status(405).json({ error: "Method not allowed" });
}
