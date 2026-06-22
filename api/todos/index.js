let todos = [
  { id: 1, title: "Buy groceries", completed: false, createdAt: new Date().toISOString() },
  { id: 2, title: "Read a book", completed: true, createdAt: new Date().toISOString() },
];
let nextId = 3;

export default function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  if (req.method === "GET") {
    return res.status(200).json(todos);
  }

  if (req.method === "POST") {
    const { title } = req.body;
    if (!title?.trim()) return res.status(400).json({ error: "Title is required" });
    const todo = { id: nextId++, title: title.trim(), completed: false, createdAt: new Date().toISOString() };
    todos.push(todo);
    return res.status(201).json(todo);
  }

  res.status(405).json({ error: "Method not allowed" });
}
