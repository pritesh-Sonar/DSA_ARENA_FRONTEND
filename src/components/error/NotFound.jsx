import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-arena-bg px-4">
      <div className="w-full max-w-sm text-center">
        <p className="font-mono text-[10px] tracking-widest text-accent-cyan mb-3">
          ARENA_STATUS // 404
        </p>
        <h1 className="font-display text-3xl font-bold text-white mb-2">
          Page not found
        </h1>
        <p className="text-gray-500 text-sm mb-8">
          This route doesn't exist. Check the URL, or head back.
        </p>
        <Link
          to="/dashboard"
          className="inline-block bg-accent-cyan hover:bg-cyan-400 text-arena-bg font-semibold py-2.5 px-6 rounded-lg transition-colors"
        >
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
