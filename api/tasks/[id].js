import { createClient } from "@supabase/supabase-js";

const MAX_TITLE = 500;

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;
  if (!url || !key) throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY");
  return createClient(url, key);
}

function toTask({ id, text, completed, created_at }) {
  return { id, title: text, completed, createdAt: created_at };
}

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const supabase = getSupabase();
  const id = parseInt(req.query.id, 10);

  try {
    // Verify task exists
    const { data: existing, error: fetchErr } = await supabase
      .from("tasks").select("id").eq("id", id).maybeSingle();
    if (fetchErr) throw fetchErr;
    if (!existing) return res.status(404).json({ error: `Task ${id} not found` });

    if (req.method === "PUT") {
      const { title, completed } = req.body ?? {};
      if (title === undefined && completed === undefined)
        return res.status(400).json({ error: "request body must include at least one of: title, completed" });
      if (title !== undefined) {
        if (typeof title !== "string" || !title.trim())
          return res.status(400).json({ error: "title must be a non-blank string" });
        if (title.trim().length > MAX_TITLE)
          return res.status(400).json({ error: `title must be ${MAX_TITLE} characters or fewer` });
      }
      if (completed !== undefined && typeof completed !== "boolean")
        return res.status(400).json({ error: "completed must be a boolean" });

      const changes = {};
      if (title     !== undefined) changes.text      = title.trim();
      if (completed !== undefined) changes.completed = completed;

      const { data, error } = await supabase
        .from("tasks").update(changes).eq("id", id).select().single();
      if (error) throw error;
      return res.status(200).json(toTask(data));
    }

    if (req.method === "DELETE") {
      const { error } = await supabase.from("tasks").delete().eq("id", id);
      if (error) throw error;
      return res.status(204).end();
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
