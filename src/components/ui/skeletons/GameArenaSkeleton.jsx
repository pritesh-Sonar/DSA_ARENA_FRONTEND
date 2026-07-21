const GameArenaSkeleton = () => {
  return (
    <div className="min-h-screen bg-arena-bg flex flex-col">
      <div className="h-16 bg-gray-900 border-b border-arena-border" />

      <div className="flex-1 flex flex-col items-center justify-center p-6 animate-pulse">
        <div className="w-full max-w-md mb-4">
          <div className="h-7 w-32 bg-arena-surface rounded-lg" />
        </div>

        <div className="bg-arena-surface border border-arena-border rounded-xl p-4 mb-8 w-full max-w-md flex justify-between items-center">
          <div className="h-8 w-20 bg-arena-border rounded" />
          <div className="h-4 w-6 bg-arena-border rounded" />
          <div className="h-8 w-20 bg-arena-border rounded" />
        </div>

        <div className="h-6 w-40 bg-arena-surface rounded mb-6" />

        <div className="grid grid-cols-3 gap-3 bg-arena-surface p-4 rounded-2xl border border-arena-border w-80 h-80">
          {Array.from({ length: 9 }).map((_, i) => (
            <div
              key={i}
              className="bg-arena-bg border border-arena-border rounded-xl"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default GameArenaSkeleton;
