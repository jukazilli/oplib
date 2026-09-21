export default function PublicationsLoading() {
  return (
    <div
      className="mx-auto w-full max-w-7xl animate-pulse px-5 py-12 sm:px-8 lg:px-12"
      aria-label="Carregando publicações"
    >
      <div className="h-12 w-56 rounded bg-muted" />
      <div className="mt-8 h-48 rounded-card bg-muted" />
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="h-72 rounded-card bg-muted" />
        ))}
      </div>
    </div>
  );
}
