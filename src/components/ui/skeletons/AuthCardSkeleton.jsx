const AuthCardSkeleton = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-arena-bg px-4">
      <div className="w-full max-w-sm animate-pulse">
        <div className="text-center mb-8">
          <div className="h-7 w-40 bg-arena-surface rounded-md mx-auto mb-3" />
          <div className="h-4 w-56 bg-arena-surface rounded-md mx-auto" />
        </div>

        <div className="space-y-5">
          <div className="h-11 bg-arena-surface border border-arena-border rounded-lg" />
          <div className="h-11 bg-arena-surface border border-arena-border rounded-lg" />
          <div className="h-11 bg-arena-border rounded-lg" />
        </div>

        <div className="h-3 w-32 bg-arena-surface rounded-md mx-auto mt-6" />
      </div>
    </div>
  );
};

export default AuthCardSkeleton;
