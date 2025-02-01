export function SelectSkeleton() {
  return (
    <div className="p-4 space-y-3">
      {[1, 2, 3].map((n) => (
        <div key={n} className="animate-pulse flex items-center">
          <div className="h-4 bg-secondary-200 rounded w-full" />
        </div>
      ))}
    </div>
  );
}
