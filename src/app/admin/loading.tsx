export default function AdminLoading() {
  return (
    <div className="animate-pulse" role="status" aria-live="polite">
      <span className="sr-only">Carregando área administrativa</span>
      <div aria-hidden="true" className="h-12 w-52 rounded bg-muted" />
      <div
        aria-hidden="true"
        className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[0, 1, 2, 3].map((item) => (
          <div key={item} className="h-28 rounded-card bg-muted" />
        ))}
      </div>
      <div aria-hidden="true" className="mt-8 h-72 rounded-card bg-muted" />
    </div>
  );
}
