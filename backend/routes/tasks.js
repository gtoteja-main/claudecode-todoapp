import { Router } from "express";
import * as store from "../store.js";
import { validateCreate, validateUpdate } from "../validation.js";

const router = Router();

// Wrap async route handlers so thrown errors reach the global error handler
const wrap = (fn) => (req, res, next) => fn(req, res, next).catch(next);

// GET /api/tasks?status=active|completed
router.get("/", wrap(async (req, res) => {
  const { status } = req.query;
  if (status && !["active", "completed"].includes(status)) {
    return res.status(400).json({ error: "status must be 'active' or 'completed'" });
  }
  const tasks = await store.getAll({ status });
  res.json(tasks);
}));

// GET /api/tasks/:id
router.get("/:id", wrap(async (req, res, next) => {
  const task = await store.getById(Number(req.params.id));
  if (!task) return next(notFound(req.params.id));
  res.json(task);
}));

// POST /api/tasks
router.post("/", wrap(async (req, res, next) => {
  const err = validateCreate(req.body);
  if (err) return next(badRequest(err));
  const task = await store.create(req.body.title.trim());
  res.status(201).json(task);
}));

// PUT /api/tasks/:id
router.put("/:id", wrap(async (req, res, next) => {
  const id = Number(req.params.id);
  const existing = await store.getById(id);
  if (!existing) return next(notFound(req.params.id));
  const err = validateUpdate(req.body);
  if (err) return next(badRequest(err));
  const updated = await store.update(id, req.body);
  res.json(updated);
}));

// DELETE /api/tasks/:id
router.delete("/:id", wrap(async (req, res, next) => {
  const id = Number(req.params.id);
  const existing = await store.getById(id);
  if (!existing) return next(notFound(req.params.id));
  await store.remove(id);
  res.status(204).end();
}));

// ── Error factories ───────────────────────────────────────────────────────────
function notFound(id) {
  return Object.assign(new Error(`Task ${id} not found`), { status: 404 });
}

function badRequest(message) {
  return Object.assign(new Error(message), { status: 400 });
}

export default router;
