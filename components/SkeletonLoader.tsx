export function SkeletonCard() {
  return <div className="skeleton h-48 w-full shrink-0 rounded-2xl" />;
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 py-3">
      <div className="skeleton h-11 w-11 rounded-xl" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-2.5 w-1/4 rounded" />
      </div>
      <div className="skeleton h-3 w-14 rounded" />
    </div>
  );
}

export function SkeletonList({ rows = 5 }: { rows?: number }) {
  return (
    <div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} />
      ))}
    </div>
  );
}
