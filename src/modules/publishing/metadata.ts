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

export function estimateReadingMinutes(markdown: string) {
  const textualContent = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[#>*_~|\-]+/g, " ");
  const words = textualContent.trim().match(/\S+/g)?.length ?? 0;
  return Math.max(1, Math.ceil(words / 200));
}
