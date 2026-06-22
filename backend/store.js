let tasks = [
  { id: 1, title: "Buy groceries", completed: false, createdAt: new Date().toISOString() },
  { id: 2, title: "Read a book",   completed: true,  createdAt: new Date().toISOString() },
];
let nextId = 3;

export function getAll() {
  return tasks;
}

export function getById(id) {
  return tasks.find((t) => t.id === id) ?? null;
}

export function create(title) {
  const task = {
    id: nextId++,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };
  tasks.push(task);
  return task;
}

export function update(id, { title, completed }) {
  const task = tasks.find((t) => t.id === id);
  if (title !== undefined)     task.title     = title.trim();
  if (completed !== undefined) task.completed = completed;
  task.updatedAt = new Date().toISOString();
  return task;
}

export function remove(id) {
  tasks = tasks.filter((t) => t.id !== id);
}
