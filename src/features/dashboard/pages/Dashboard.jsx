import { useState } from "react";
import Navbar from "../../../components/layout/Navbar";
import { useAuth } from "../../auth/hooks/useAuth";
import GameGrid from "../components/GameGrid";
import ModeSelectPanel from "../components/ModeSelectPanel";
import MatchmakingQueue from "../components/MatchmakingQueue";

const Dashboard = () => {
  const { user } = useAuth();
  const [selectedGameId, setSelectedGameId] = useState(null);
  const [selectedMode, setSelectedMode] = useState(null);

  const handleSelectGame = (gameId) => {
    setSelectedGameId(gameId);
    setSelectedMode(null);
  };

  const handleCloseModePanel = () => {
    setSelectedGameId(null);
    setSelectedMode(null);
  };

  return (
    <div className="min-h-screen bg-arena-bg text-gray-100">
      <Navbar />

      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Welcome header */}
        <div className="mb-10 border-b border-arena-border pb-6">
          <p className="font-mono text-[10px] tracking-widest text-accent-cyan mb-2">
            ARENA_STATUS // ONLINE
          </p>
          <h1 className="font-display text-3xl font-bold text-white mb-2 tracking-tight">
            Welcome back, <span className="text-accent-cyan">{user?.username || "Player"}</span>
          </h1>
          <p className="text-gray-500 text-sm">
            Pick a game to enter the arena.
          </p>
        </div>

        {/* Game selection graph */}
        <div className="mb-2">
          <p className="font-mono text-[10px] tracking-widest text-gray-500 mb-5">
            SELECT_GAME
          </p>
          <GameGrid
            selectedGameId={selectedGameId}
            onSelectGame={handleSelectGame}
          />
        </div>

        {/* Mode selection — appears once a game is picked */}
        {selectedGameId && (
          <ModeSelectPanel
            gameId={selectedGameId}
            selectedMode={selectedMode}
            onSelectMode={setSelectedMode}
            onClose={handleCloseModePanel}
          />
        )}

        {/* Live matchmaking queue — appears once Random Match is chosen */}
        {selectedMode === "random" && (
          <div className="mt-6 flex justify-center">
            <MatchmakingQueue gameType={selectedGameId} />
          </div>
        )}

        {/* Match history placeholder — kept from your original layout */}
        {!selectedGameId && (
          <div className="mt-10 bg-arena-surface/40 border border-arena-border p-8 rounded-xl text-center py-16">
            <p className="text-gray-400 font-medium mb-1">
              Your games and matches will show up here soon.
            </p>
            <p className="text-gray-600 text-xs max-w-xs mx-auto">
              Once matchmaking pairs you up, your historical records and
              rating adjustments will populate this screen.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;