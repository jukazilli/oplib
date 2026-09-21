export function slugifyPostTitle(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 240)
    .replace(/-+$/g, "");
}

export function normalizeRequestedSlug(value: string) {
  return slugifyPostTitle(value);
}
