import { GAMES } from "../../../constants/games";
import GameCard from "./GameCard";

const GameGrid = ({ selectedGameId, onSelectGame }) => {
  return (
    <div className="relative">
      {/* Graph trace line — desktop only */}
      <div className="hidden md:block absolute top-1 left-0 right-0 h-px border-t border-dashed border-arena-border" />

      <div className="relative grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5">
        {GAMES.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            isSelected={selectedGameId === game.id}
            onSelect={onSelectGame}
          />
        ))}
      </div>
    </div>
  );
};

export default GameGrid;
