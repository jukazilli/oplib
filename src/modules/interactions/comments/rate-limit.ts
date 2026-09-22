const WINDOW_MS = 5 * 60 * 1000;
const MAX_ATTEMPTS = 3;
const MAX_TRACKED_VISITORS = 10_000;
const attempts = new Map<string, number[]>();

function removeExpiredVisitors(now: number) {
  for (const [key, timestamps] of attempts) {
    if (timestamps.every((timestamp) => now - timestamp >= WINDOW_MS)) {
      attempts.delete(key);
    }
  }
}

export function allowCommentAttempt(key: string, now = Date.now()) {
  const recent = (attempts.get(key) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );
  if (recent.length >= MAX_ATTEMPTS) return false;

  if (!attempts.has(key) && attempts.size >= MAX_TRACKED_VISITORS) {
    removeExpiredVisitors(now);
    if (attempts.size >= MAX_TRACKED_VISITORS) return false;
  }

  recent.push(now);
  attempts.set(key, recent);
  return true;
}

export function resetCommentRateLimit() {
  attempts.clear();
}
