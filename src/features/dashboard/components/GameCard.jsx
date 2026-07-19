const GameCard = ({ game, isSelected, onSelect }) => {
  const isLocked = game.status === "locked";

  return (
    <div className="flex flex-col items-center">
      {/* Connector dot — sits on the graph line above the card */}
      <div
        className={`hidden md:block w-2 h-2 rounded-full mb-3 transition-colors ${
          isLocked ? "bg-arena-border" : "bg-accent-cyan"
        }`}
      />

      <button
        onClick={() => !isLocked && onSelect(game.id)}
        disabled={isLocked}
        className={`relative w-full max-w-[168px] rounded-2xl border p-5 text-left transition-all duration-200 ${
          isLocked
            ? "bg-arena-surface/40 border-arena-border opacity-50 cursor-not-allowed"
            : isSelected
            ? "bg-arena-surfaceHover border-accent-cyan shadow-[0_0_0_1px_rgba(34,211,238,0.3),0_8px_24px_-8px_rgba(34,211,238,0.25)]"
            : "bg-arena-surface border-arena-border hover:border-accent-cyan/50 hover:bg-arena-surfaceHover cursor-pointer"
        }`}
      >
        {/* Status indicator */}
        <div className="absolute top-4 right-4">
          {isLocked ? (
            <span className="text-[9px] font-mono uppercase tracking-wider text-accent-amber border border-accent-amber/30 bg-accent-amber/10 px-1.5 py-0.5 rounded">
              Soon
            </span>
          ) : (
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent-green opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent-green" />
            </span>
          )}
        </div>

        <p className="font-mono text-[10px] tracking-widest text-gray-500 mb-3">
          {game.code}
        </p>
        <h3 className="font-display font-bold text-white text-base mb-1.5 leading-tight">
          {game.name}
        </h3>
        <p className="text-xs text-gray-500 leading-relaxed">
          {game.description}
        </p>
      </button>
    </div>
  );
};

export default GameCard;