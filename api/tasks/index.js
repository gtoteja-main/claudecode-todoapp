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
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

export default async function handler(req, res) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const supabase = getSupabase();

  try {
    if (req.method === "GET") {
      const { status } = req.query;
      if (status && !["active", "completed"].includes(status)) {
        return res.status(400).json({ error: "status must be 'active' or 'completed'" });
      }
      let query = supabase.from("tasks").select("*").order("created_at", { ascending: true });
      if (status === "active")    query = query.eq("completed", false);
      if (status === "completed") query = query.eq("completed", true);
      const { data, error } = await query;
      if (error) throw error;
      return res.status(200).json(data.map(toTask));
    }

    if (req.method === "POST") {
      const { title } = req.body ?? {};
      if (!title || typeof title !== "string" || !title.trim())
        return res.status(400).json({ error: "title is required and must not be blank" });
      if (title.trim().length > MAX_TITLE)
        return res.status(400).json({ error: `title must be ${MAX_TITLE} characters or fewer` });
      const { data, error } = await supabase
        .from("tasks").insert({ text: title.trim() }).select().single();
      if (error) throw error;
      return res.status(201).json(toTask(data));
    }

    res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
