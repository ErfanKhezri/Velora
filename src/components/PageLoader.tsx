export function PageLoader() {
  return (
    <div className="grid min-h-[60dvh] place-items-center" role="status" aria-label="در حال بارگذاری">
      <span className="size-10 animate-spin rounded-full border-2 border-orchid-200 border-t-orchid-500 dark:border-white/10 dark:border-t-iris-300" />
    </div>
  );
}
