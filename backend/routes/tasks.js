import { Router } from "express";
import * as store from "../store.js";
import { validateCreate, validateUpdate } from "../validation.js";

const router = Router();

// GET /api/tasks
// Returns all tasks, optionally filtered by ?status=active|completed
router.get("/", (req, res) => {
  const { status } = req.query;
  let tasks = store.getAll();

  if (status === "active") tasks = tasks.filter((t) => !t.completed);
  else if (status === "completed") tasks = tasks.filter((t) => t.completed);
  else if (status !== undefined) {
    return res.status(400).json({ error: "status must be 'active' or 'completed'" });
  }

  res.json(tasks);
});

// GET /api/tasks/:id
router.get("/:id", (req, res, next) => {
  const task = store.getById(parseId(req.params.id));
  if (!task) return next(notFound(req.params.id));
  res.json(task);
});

// POST /api/tasks
router.post("/", (req, res, next) => {
  const error = validateCreate(req.body);
  if (error) return next(badRequest(error));

  const task = store.create(req.body.title.trim());
  res.status(201).json(task);
});

// PUT /api/tasks/:id
router.put("/:id", (req, res, next) => {
  const id = parseId(req.params.id);
  if (!store.getById(id)) return next(notFound(req.params.id));

  const error = validateUpdate(req.body);
  if (error) return next(badRequest(error));

  const updated = store.update(id, req.body);
  res.json(updated);
});

// DELETE /api/tasks/:id
router.delete("/:id", (req, res, next) => {
  const id = parseId(req.params.id);
  if (!store.getById(id)) return next(notFound(req.params.id));

  store.remove(id);
  res.status(204).end();
});

// ── Helpers ───────────────────────────────────────────────────────────────────
function parseId(raw) {
  return parseInt(raw, 10);
}

function notFound(id) {
  const err = new Error(`Task ${id} not found`);
  err.status = 404;
  return err;
}

function badRequest(message) {
  const err = new Error(message);
  err.status = 400;
  return err;
}

export default router;
