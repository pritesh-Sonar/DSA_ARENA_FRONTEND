const TYPE_STYLES = {
  error: "bg-red-950/90 border-red-800 text-red-200",
  success: "bg-green-950/90 border-green-800 text-green-200",
  info: "bg-arena-surface/90 border-arena-border text-gray-200",
};

const Toast = ({ message, type = "error", onDismiss }) => {
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg backdrop-blur-sm w-full max-w-sm animate-in slide-in-from-top-2 fade-in duration-200 ${TYPE_STYLES[type]}`}
    >
      <p className="text-sm flex-1 leading-snug">{message}</p>
      <button
        onClick={onDismiss}
        className="text-current opacity-60 hover:opacity-100 transition-opacity text-sm leading-none"
      >
        ✕
      </button>
    </div>
  );
};

export default Toast;