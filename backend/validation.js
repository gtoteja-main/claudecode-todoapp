const MAX_TITLE_LENGTH = 500;

export function validateCreate({ title } = {}) {
  if (!title || typeof title !== "string")
    return "title is required and must be a string";
  if (!title.trim())
    return "title must not be blank";
  if (title.trim().length > MAX_TITLE_LENGTH)
    return `title must be ${MAX_TITLE_LENGTH} characters or fewer`;
  return null;
}

export function validateUpdate({ title, completed } = {}) {
  if (title === undefined && completed === undefined)
    return "request body must include at least one of: title, completed";
  if (title !== undefined) {
    if (typeof title !== "string")  return "title must be a string";
    if (!title.trim())              return "title must not be blank";
    if (title.trim().length > MAX_TITLE_LENGTH)
      return `title must be ${MAX_TITLE_LENGTH} characters or fewer`;
  }
  if (completed !== undefined && typeof completed !== "boolean")
    return "completed must be a boolean";
  return null;
}
