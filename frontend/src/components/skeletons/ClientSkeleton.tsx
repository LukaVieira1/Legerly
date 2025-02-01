export function ClientSkeleton() {
  return (
    <div className="animate-pulse bg-secondary-100 h-24 rounded-lg border border-secondary-200 p-4">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-secondary-200 rounded-full" />
        <div className="flex-1">
          <div className="h-4 bg-secondary-200 rounded w-3/4 mb-2" />
          <div className="h-4 bg-secondary-200 rounded w-1/2 mb-1" />
          <div className="h-4 bg-secondary-200 rounded w-1/3" />
        </div>
      </div>
    </div>
  );
}
