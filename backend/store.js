import { supabase } from "../lib/supabase.js";

// Map DB row (uses `text` column) → API shape (uses `title` for frontend compat)
function toTask({ id, text, completed, created_at }) {
  return { id, title: text, completed, createdAt: created_at };
}

export async function getAll({ status } = {}) {
  let query = supabase.from("tasks").select("*").order("created_at", { ascending: true });
  if (status === "active")    query = query.eq("completed", false);
  if (status === "completed") query = query.eq("completed", true);
  const { data, error } = await query;
  if (error) throw error;
  return data.map(toTask);
}

export async function getById(id) {
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data ? toTask(data) : null;
}

export async function create(title) {
  const { data, error } = await supabase
    .from("tasks")
    .insert({ text: title })
    .select()
    .single();
  if (error) throw error;
  return toTask(data);
}

export async function update(id, { title, completed }) {
  const changes = {};
  if (title     !== undefined) changes.text      = title.trim();
  if (completed !== undefined) changes.completed = completed;

  const { data, error } = await supabase
    .from("tasks")
    .update(changes)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return toTask(data);
}

export async function remove(id) {
  const { error } = await supabase.from("tasks").delete().eq("id", id);
  if (error) throw error;
}
