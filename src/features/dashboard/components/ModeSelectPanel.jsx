import { GAMES } from "../../../constants/games";

const MODES = [
  {
    id: "bot",
    label: "vs Bot",
    hint: "Play the AI",
    available: false,
  },
  {
    id: "friend",
    label: "vs Friend",
    hint: "Invite by link",
    available: false,
  },
  {
    id: "random",
    label: "Random Match",
    hint: "Join the queue",
    available: true,
  },
];

const ModeSelectPanel = ({ gameId, selectedMode, onSelectMode, onClose }) => {
  const game = GAMES.find((g) => g.id === gameId);
  if (!game) return null;

  return (
    <div className="mt-6 bg-arena-surface border border-arena-border rounded-2xl p-6 animate-in fade-in slide-in-from-top-2 duration-200">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="font-mono text-[10px] tracking-widest text-accent-cyan mb-1">
            {game.code} // SELECT MODE
          </p>
          <h2 className="font-display font-bold text-white text-lg">
            {game.name}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-300 text-sm font-mono transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {MODES.map((mode) => (
          <button
            key={mode.id}
            onClick={() => mode.available && onSelectMode(mode.id)}
            disabled={!mode.available}
            className={`rounded-xl border p-4 text-left transition-all ${
              !mode.available
                ? "bg-arena-bg border-arena-border opacity-40 cursor-not-allowed"
                : selectedMode === mode.id
                  ? "bg-accent-cyan/10 border-accent-cyan"
                  : "bg-arena-bg border-arena-border hover:border-accent-cyan/50 cursor-pointer"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-display font-semibold text-white text-sm">
                {mode.label}
              </span>
              {!mode.available && (
                <span className="text-[9px] font-mono text-accent-amber">
                  SOON
                </span>
              )}
            </div>
            <p className="text-xs text-gray-500">{mode.hint}</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModeSelectPanel;
