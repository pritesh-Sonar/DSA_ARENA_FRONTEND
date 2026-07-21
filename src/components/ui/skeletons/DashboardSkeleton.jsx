const DashboardSkeleton = () => {
  return (
    <div className="min-h-screen bg-arena-bg">
      {/* Navbar placeholder */}
      <div className="h-16 bg-gray-900 border-b border-arena-border" />

      <div className="max-w-5xl mx-auto px-6 py-10 animate-pulse">
        {/* Welcome header */}
        <div className="mb-10 border-b border-arena-border pb-6">
          <div className="h-3 w-32 bg-arena-surface rounded mb-3" />
          <div className="h-8 w-64 bg-arena-surface rounded-md mb-2" />
          <div className="h-4 w-48 bg-arena-surface rounded" />
        </div>

        {/* Game grid */}
        <div className="h-3 w-24 bg-arena-surface rounded mb-5" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-32 bg-arena-surface border border-arena-border rounded-2xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardSkeleton;