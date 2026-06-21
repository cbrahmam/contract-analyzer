export function SkeletonLine({ width = '100%', height = '16px' }) {
  return (
    <div
      className="rounded bg-navy-700/50 animate-pulse"
      style={{ width, height }}
    />
  );
}

export function SkeletonCard({ lines = 3 }) {
  return (
    <div className="rounded-xl border border-navy-700 bg-navy-900/50 p-6 space-y-3">
      <SkeletonLine width="40%" height="20px" />
      {Array.from({ length: lines }).map((_, i) => (
        <SkeletonLine key={i} width={i === lines - 1 ? '60%' : '100%'} />
      ))}
    </div>
  );
}

export function ResultsSkeleton() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8 space-y-6 animate-fadeIn">
      <div className="flex items-center gap-4">
        <SkeletonLine width="200px" height="32px" />
        <SkeletonLine width="80px" height="28px" />
      </div>
      <SkeletonCard lines={4} />
      <div className="grid grid-cols-2 gap-4">
        <SkeletonCard lines={2} />
        <SkeletonCard lines={2} />
      </div>
      <SkeletonCard lines={5} />
      <SkeletonCard lines={3} />
    </div>
  );
}

export function HistorySkeleton() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12 space-y-3">
      <SkeletonLine width="200px" height="32px" />
      <SkeletonLine width="120px" height="16px" />
      <div className="mt-6 space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} lines={2} />
        ))}
      </div>
    </div>
  );
}
