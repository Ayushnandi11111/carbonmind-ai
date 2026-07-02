export default function Skeleton({ className = "h-20" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse bg-white/5 border border-white/10 rounded-2xl ${className}`}
    />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="p-4 sm:p-8 space-y-6">
      <Skeleton className="h-16 w-1/2" />
      <Skeleton className="h-24" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
        <Skeleton className="h-40" />
      </div>
      <Skeleton className="h-64" />
    </div>
  );
}
