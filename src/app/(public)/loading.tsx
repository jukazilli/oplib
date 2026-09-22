export default function PublicLoading() {
  return (
    <div
      className="mx-auto w-full max-w-5xl animate-pulse px-5 py-12 sm:px-8 sm:py-16 lg:px-12"
      role="status"
      aria-live="polite"
    >
      <span className="sr-only">Carregando conteúdo</span>
      <div aria-hidden="true" className="h-5 w-40 rounded bg-muted" />
      <div
        aria-hidden="true"
        className="mt-5 h-16 max-w-3xl rounded bg-muted"
      />
      <div aria-hidden="true" className="mt-8 h-80 rounded-card bg-muted" />
    </div>
  );
}
