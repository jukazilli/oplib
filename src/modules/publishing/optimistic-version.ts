export function optimisticVersionWindow(version: Date) {
  const start = new Date(version.getTime());
  return {
    start,
    end: new Date(start.getTime() + 1),
  };
}
