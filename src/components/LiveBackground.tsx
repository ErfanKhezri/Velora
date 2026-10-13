/** Slowly drifting color blobs behind the glass surfaces. */
export function LiveBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <div className="animate-drift absolute -top-[15%] -right-[10%] size-[55vmax] rounded-full bg-orchid-300/55 blur-[90px] dark:bg-orchid-600/30" />
      <div className="animate-drift absolute top-[30%] -left-[15%] size-[50vmax] rounded-full bg-iris-300/55 blur-[90px] [animation-delay:-8s] dark:bg-iris-600/30" />
      <div className="animate-drift absolute -bottom-[20%] right-[20%] size-[40vmax] rounded-full bg-aqua-300/45 blur-[90px] [animation-delay:-15s] dark:bg-aqua-400/15" />
    </div>
  );
}
