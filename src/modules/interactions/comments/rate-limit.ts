const WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 3;
const attempts = new Map<string, number[]>();

export function allowCommentAttempt(key: string, now = Date.now()) {
  const recent = (attempts.get(key) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );
  if (recent.length >= MAX_ATTEMPTS) return false;
  recent.push(now);
  attempts.set(key, recent);
  return true;
}

export function resetCommentRateLimit() {
  attempts.clear();
}
