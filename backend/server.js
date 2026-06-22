import express from "express";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

let todos = [
  { id: 1, title: "Buy groceries", completed: false, createdAt: new Date().toISOString() },
  { id: 2, title: "Read a book", completed: true, createdAt: new Date().toISOString() },
];
let nextId = 3;

app.get("/api/todos", (req, res) => {
  res.json(todos);
});

app.post("/api/todos", (req, res) => {
  const { title } = req.body;
  if (!title?.trim()) return res.status(400).json({ error: "Title is required" });
  const todo = { id: nextId++, title: title.trim(), completed: false, createdAt: new Date().toISOString() };
  todos.push(todo);
  res.status(201).json(todo);
});

app.put("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const todo = todos.find((t) => t.id === id);
  if (!todo) return res.status(404).json({ error: "Todo not found" });
  const { title, completed } = req.body;
  if (title !== undefined) todo.title = title.trim();
  if (completed !== undefined) todo.completed = completed;
  res.json(todo);
});

app.delete("/api/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) return res.status(404).json({ error: "Todo not found" });
  todos.splice(index, 1);
  res.status(204).send();
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));
