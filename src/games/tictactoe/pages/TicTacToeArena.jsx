import React, { useState, useEffect, useMemo } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useWebSocket } from "../../../contexts/WebSocketContext";
import Navbar from "../../../components/layout/Navbar";

// All possible winning combinations on a 3x3 board
const WINNING_LINES = [
  [0, 1, 2], // row 1
  [3, 4, 5], // row 2
  [6, 7, 8], // row 3
  [0, 3, 6], // col 1
  [1, 4, 7], // col 2
  [2, 5, 8], // col 3
  [0, 4, 8], // diag \
  [2, 4, 6], // diag /
];

// Detect the winning line from the final board state
const getWinningLine = (board) => {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { indices: line, symbol: board[a] };
    }
  }
  return null;
};

// Cell centers in a 300x300 viewBox (3x3 grid, cells centered at 50, 150, 250)
const CELL_POSITIONS = [
  { x: 50, y: 50 },
  { x: 150, y: 50 },
  { x: 250, y: 50 },
  { x: 50, y: 150 },
  { x: 150, y: 150 },
  { x: 250, y: 150 },
  { x: 50, y: 250 },
  { x: 150, y: 250 },
  { x: 250, y: 250 },
];

const TicTacToeArena = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { stompClient, isConnected } = useWebSocket();

  const matchData = location.state || {};
  const opponent = matchData.opponent || "Opponent";
  const mySymbol = matchData.playerSymbol || "X";
  const myUsername = matchData.username; // Ensure your nav state passes this!
  const opponentSymbol = mySymbol === "X" ? "O" : "X";

  const [board, setBoard] = useState(Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState(mySymbol === "X");
  const [gameStatus, setGameStatus] = useState("PLAYING");
  const [winningSymbol, setWinningSymbol] = useState(null);
  const [lastMoveIndex, setLastMoveIndex] = useState(null);
  const [rematchRequests, setRematchRequests] = useState([]); // Rematch state (backend record)
  const [rematchDeclined, setRematchDeclined] = useState(false); // Opponent said no
  const [iRequestedRematch, setIRequestedRematch] = useState(false); // Local: did *I* click Request/Accept?

  useEffect(() => {
    if (!stompClient || !isConnected) return;

    const gameSubscription = stompClient.subscribe(
      `/topic/game/${roomId}`,
      (message) => {
        const gameState = JSON.parse(message.body);

        setBoard((prev) => {
          // Find which cell changed to animate it
          const changedIdx = gameState.board.findIndex((v, i) => v !== prev[i]);
          if (changedIdx !== -1) setLastMoveIndex(changedIdx);
          return gameState.board;
        });
        setIsMyTurn(gameState.currentTurn === mySymbol);

        if (gameState.status) {
          setGameStatus(gameState.status);
        }
        if (gameState.winner) {
          setWinningSymbol(gameState.winner);
        }
        if (gameState.winReason === "DISCONNECT") {
          setGameStatus("WON_BY_DISCONNECT");
        }

        // Sync rematch state from backend
        if (gameState.rematchRequests) {
          setRematchRequests(gameState.rematchRequests);
        }
        if (gameState.rematchDeclined) {
          setRematchDeclined(true);
        }
        // Fresh board (new game / rematch actually started) -> clear rematch UI state
        if (gameState.board.every((cell) => cell === null)) {
          setRematchRequests([]);
          setRematchDeclined(false);
          setIRequestedRematch(false);
        }
      },
    );

    return () => {
      gameSubscription.unsubscribe();
    };
  }, [stompClient, isConnected, roomId, mySymbol]);

  // Derived state for rematch UI.
  // We use the LOCAL `iRequestedRematch` flag (set the instant I click) rather than
  // comparing usernames against the backend's rematchRequests array, since that
  // comparison can silently fail if the username strings don't match exactly.
  // True when someone else requested and I haven't clicked Request/Accept myself:
  const opponentRequestedRematch =
    rematchRequests.length > 0 && !iRequestedRematch && !rematchDeclined;

  // Compute winning line for overlay drawing
  const winningLine = useMemo(() => {
    if (gameStatus === "WON") return getWinningLine(board);
    return null;
  }, [board, gameStatus]);

  const iWon =
    (gameStatus === "WON" && winningSymbol === mySymbol) ||
    gameStatus === "WON_BY_DISCONNECT";
  const iLost = gameStatus === "WON" && winningSymbol !== mySymbol;
  const isDraw = gameStatus === "DRAW";
  const gameOver = gameStatus !== "PLAYING";

  const handleCellClick = (index) => {
    if (!isMyTurn || board[index] !== null || gameStatus !== "PLAYING") return;

    const movePayload = {
      roomId: roomId,
      index: index,
      symbol: mySymbol,
    };

    stompClient.publish({
      destination: "/app/game.move",
      body: JSON.stringify(movePayload),
    });
  };

  const requestRematch = () => {
    setIRequestedRematch(true);
    stompClient.publish({
      destination: "/app/game.rematch",
      body: JSON.stringify({ roomId }),
    });
  };

  const declineRematch = () => {
    stompClient.publish({
      destination: "/app/game.rematch.decline",
      body: JSON.stringify({ roomId }),
    });
    navigate("/dashboard");
  };

  const handleForfeit = () => {
    if (stompClient && isConnected) {
      stompClient.deactivate();
    }
    navigate("/dashboard");
  };

  // Renders the symbol as a stylized SVG for nicer visuals
  const renderSymbol = (symbol, isWinning) => {
    if (!symbol) return null;
    const color = symbol === "X" ? "#22d3ee" : "#f43f5e";
    const glow = isWinning ? `drop-shadow(0 0 12px ${color})` : "none";

    if (symbol === "X") {
      return (
        <svg
          viewBox="0 0 60 60"
          className="w-3/5 h-3/5"
          style={{ filter: glow }}
        >
          <line
            x1="12"
            y1="12"
            x2="48"
            y2="48"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            className="draw-stroke"
          />
          <line
            x1="48"
            y1="12"
            x2="12"
            y2="48"
            stroke={color}
            strokeWidth="6"
            strokeLinecap="round"
            className="draw-stroke draw-stroke-delay"
          />
        </svg>
      );
    }
    return (
      <svg viewBox="0 0 60 60" className="w-3/5 h-3/5" style={{ filter: glow }}>
        <circle
          cx="30"
          cy="30"
          r="18"
          stroke={color}
          strokeWidth="6"
          fill="none"
          strokeLinecap="round"
          className="draw-circle"
        />
      </svg>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

      <Navbar />

      {/* Opponent rematch request popup */}
      {opponentRequestedRematch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10 w-full max-w-xs text-center">
            <p className="text-xs text-slate-500 font-mono tracking-widest mb-2">
              REMATCH REQUEST
            </p>
            <h3 className="text-xl font-bold text-cyan-300 mb-1">
              {opponent} wants a rematch!
            </h3>
            <p className="text-slate-400 text-sm mb-5">
              Accept to jump back in, or head to the dashboard instead.
            </p>
            <div className="flex flex-col gap-2.5">
              <button
                onClick={requestRematch}
                className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg cursor-pointer hover:scale-105"
              >
                Accept Rematch
              </button>
              <button
                onClick={declineRematch}
                className="bg-red-950/60 border border-red-800/60 text-red-300 hover:bg-red-900/80 hover:border-red-700 text-sm font-medium py-2 px-6 rounded-lg transition-all cursor-pointer"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Requester popup: waiting for opponent's response */}
      {iRequestedRematch && !rematchDeclined && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900/90 border border-cyan-500/40 rounded-2xl p-6 shadow-2xl shadow-cyan-500/10 w-full max-w-xs text-center">
            <p className="text-xs text-slate-500 font-mono tracking-widest mb-2">
              REMATCH REQUEST SENT
            </p>
            <h3 className="text-xl font-bold text-cyan-300 mb-4">
              Waiting for {opponent}'s response...
            </h3>
            <div className="flex items-center justify-center gap-2 mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span
                className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"
                style={{ animationDelay: "0.2s" }}
              />
              <span
                className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"
                style={{ animationDelay: "0.4s" }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Requester popup: opponent declined */}
      {iRequestedRematch && rematchDeclined && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900/90 border border-rose-500/40 rounded-2xl p-6 shadow-2xl shadow-rose-500/10 w-full max-w-xs text-center">
            <p className="text-xs text-slate-500 font-mono tracking-widest mb-2">
              REMATCH REQUEST
            </p>
            <h3 className="text-xl font-bold text-rose-400 mb-1">
              Opponent rejected your request.
            </h3>
            <p className="text-slate-400 text-sm mb-5">
              No hard feelings — head back to the dashboard.
            </p>
            <button
              onClick={() => navigate("/dashboard")}
              className="bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 cursor-pointer hover:scale-105 w-full"
            >
              Leave
            </button>
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {/* Forfeit button */}
        <div className="w-full max-w-md mb-4 flex justify-start">
          <button
            onClick={handleForfeit}
            className="text-xs bg-red-950/60 border border-red-800/60 text-red-300 px-3.5 py-1.5 rounded-lg hover:bg-red-900/80 hover:border-red-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm backdrop-blur-sm"
          >
            <span>←</span> Forfeit & Leave
          </button>
        </div>

        {/* Player cards */}
        <div className="w-full max-w-md mb-6 flex items-center gap-3">
          {/* You */}
          <div
            className={`flex-1 bg-slate-900/70 backdrop-blur-sm border rounded-xl p-4 shadow-lg transition-all ${
              isMyTurn && !gameOver
                ? "border-cyan-500/60 shadow-cyan-500/20"
                : "border-slate-800"
            }`}
          >
            <p className="text-[10px] text-slate-500 font-mono tracking-widest mb-1">
              YOU
            </p>
            <div className="flex items-center justify-between">
              <p className="font-bold text-cyan-400 truncate">You</p>
              <span
                className={`text-2xl font-black ${
                  mySymbol === "X" ? "text-cyan-400" : "text-rose-500"
                }`}
              >
                {mySymbol}
              </span>
            </div>
          </div>

          <div className="text-slate-600 font-mono text-xs font-bold">VS</div>

          {/* Opponent */}
          <div
            className={`flex-1 bg-slate-900/70 backdrop-blur-sm border rounded-xl p-4 shadow-lg transition-all ${
              !isMyTurn && !gameOver
                ? "border-rose-500/60 shadow-rose-500/20"
                : "border-slate-800"
            }`}
          >
            <p className="text-[10px] text-slate-500 font-mono tracking-widest mb-1 text-right">
              OPPONENT
            </p>
            <div className="flex items-center justify-between">
              <span
                className={`text-2xl font-black ${
                  opponentSymbol === "X" ? "text-cyan-400" : "text-rose-500"
                }`}
              >
                {opponentSymbol}
              </span>
              <p className="font-bold text-rose-400 truncate">{opponent}</p>
            </div>
          </div>
        </div>

        {/* Turn / status indicator */}
        <div className="mb-6 text-center h-8">
          {!gameOver && (
            <div className="flex items-center justify-center gap-2">
              <span
                className={`w-2 h-2 rounded-full ${
                  isMyTurn
                    ? "bg-cyan-400 animate-pulse"
                    : "bg-rose-400 animate-pulse"
                }`}
              />
              <p
                className={`text-sm font-medium tracking-wide ${
                  isMyTurn ? "text-cyan-300" : "text-slate-400"
                }`}
              >
                {isMyTurn ? "YOUR TURN" : `${opponent.toUpperCase()}'S TURN...`}
              </p>
            </div>
          )}
        </div>

        {/* Game board with winning line overlay */}
        <div className="relative">
          <div
            className={`grid grid-cols-3 gap-3 bg-slate-900/70 backdrop-blur-sm p-4 rounded-2xl border border-slate-800 shadow-2xl w-80 h-80 transition-all ${
              gameOver ? "opacity-80" : ""
            }`}
          >
            {board.map((cell, index) => {
              const isWinningCell = winningLine?.indices.includes(index);
              const isLastMove = lastMoveIndex === index && !gameOver;
              return (
                <button
                  key={index}
                  onClick={() => handleCellClick(index)}
                  disabled={
                    !isMyTurn || cell !== null || gameStatus !== "PLAYING"
                  }
                  className={`relative bg-slate-950/60 border rounded-xl flex items-center justify-center transition-all duration-200 ${
                    isWinningCell
                      ? "border-amber-400/70 bg-amber-500/5"
                      : "border-slate-800"
                  } ${
                    isMyTurn && cell === null && !gameOver
                      ? "hover:bg-slate-800/60 hover:border-slate-700 cursor-pointer"
                      : "cursor-default"
                  } ${isLastMove ? "cell-pop" : ""}`}
                >
                  {renderSymbol(cell, isWinningCell)}
                </button>
              );
            })}
          </div>

          {/* Winning line overlay */}
          {winningLine && (
            <svg
              viewBox="0 0 300 300"
              className="absolute inset-0 w-full h-full pointer-events-none p-4"
              style={{ overflow: "visible" }}
            >
              <defs>
                <linearGradient
                  id="winLineGradient"
                  x1="0%"
                  y1="0%"
                  x2="100%"
                  y2="0%"
                >
                  <stop offset="0%" stopColor="#fbbf24" />
                  <stop offset="50%" stopColor="#f59e0b" />
                  <stop offset="100%" stopColor="#fbbf24" />
                </linearGradient>
              </defs>
              <line
                x1={CELL_POSITIONS[winningLine.indices[0]].x}
                y1={CELL_POSITIONS[winningLine.indices[0]].y}
                x2={CELL_POSITIONS[winningLine.indices[2]].x}
                y2={CELL_POSITIONS[winningLine.indices[2]].y}
                stroke="url(#winLineGradient)"
                strokeWidth="8"
                strokeLinecap="round"
                className="win-line"
                style={{ filter: "drop-shadow(0 0 8px #fbbf24)" }}
              />
            </svg>
          )}
        </div>

        {/* End-of-game message and animations */}
        {gameOver && (
          <div className="mt-8 text-center animate-fadeIn">
            {iWon && (
              <div className="relative">
                {/* Confetti burst */}
                <div className="confetti-container">
                  {[...Array(20)].map((_, i) => (
                    <span
                      key={i}
                      className="confetti"
                      style={{
                        left: `${Math.random() * 100}%`,
                        backgroundColor: [
                          "#22d3ee",
                          "#fbbf24",
                          "#f43f5e",
                          "#a78bfa",
                          "#4ade80",
                        ][i % 5],
                        animationDelay: `${Math.random() * 0.5}s`,
                        animationDuration: `${1.5 + Math.random() * 1.5}s`,
                      }}
                    />
                  ))}
                </div>
                <h2 className="text-5xl font-black bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-300 bg-clip-text text-transparent animate-victory-bounce">
                  🏆 VICTORY!
                </h2>
                <p className="text-amber-200/80 mt-2 text-sm tracking-wide">
                  {gameStatus === "WON_BY_DISCONNECT"
                    ? "Your opponent fled the battlefield!"
                    : "A masterful performance. Well played, champion!"}
                </p>
              </div>
            )}

            {iLost && (
              <div>
                <h2 className="text-5xl font-black text-rose-500 animate-shake">
                  💀 DEFEATED
                </h2>
                <p className="text-slate-400 mt-2 text-sm tracking-wide italic">
                  Every loss is a lesson. Rise, and try again.
                </p>
              </div>
            )}

            {isDraw && (
              <div>
                <h2 className="text-5xl font-black text-slate-300 animate-fadeIn">
                  🤝 STALEMATE
                </h2>
                <p className="text-slate-500 mt-2 text-sm tracking-wide">
                  A worthy battle. Neither side yielded.
                </p>
              </div>
            )}

            <div className="flex flex-col gap-3 mt-6 items-center">
              {!iRequestedRematch && !opponentRequestedRematch && (
                <button
                  onClick={requestRematch}
                  className="bg-green-600 hover:bg-green-500 text-white font-semibold py-2.5 px-8 rounded-lg transition-all duration-200 shadow-lg cursor-pointer hover:scale-105"
                >
                  Request Rematch
                </button>
              )}

              <button
                onClick={() => navigate("/dashboard")}
                className="bg-gradient-to-r from-cyan-500 to-cyan-400 hover:from-cyan-400 hover:to-cyan-300 text-slate-950 font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-cyan-500/30 cursor-pointer hover:scale-105"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Component-scoped animations */}
      <style>{`
        @keyframes drawStroke {
          from { stroke-dasharray: 60; stroke-dashoffset: 60; }
          to { stroke-dasharray: 60; stroke-dashoffset: 0; }
        }
        @keyframes drawCircle {
          from { stroke-dasharray: 120; stroke-dashoffset: 120; }
          to { stroke-dasharray: 120; stroke-dashoffset: 0; }
        }
        .draw-stroke {
          animation: drawStroke 0.25s ease-out forwards;
        }
        .draw-stroke-delay {
          animation: drawStroke 0.25s ease-out 0.2s forwards;
          stroke-dashoffset: 60;
        }
        .draw-circle {
          animation: drawCircle 0.4s ease-out forwards;
        }

        @keyframes winLine {
          from { stroke-dasharray: 400; stroke-dashoffset: 400; }
          to { stroke-dasharray: 400; stroke-dashoffset: 0; }
        }
        .win-line {
          animation: winLine 0.6s ease-out forwards;
        }

        @keyframes cellPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        .cell-pop {
          animation: cellPop 0.3s ease-out;
        }

        @keyframes victoryBounce {
          0%, 100% { transform: translateY(0) scale(1); }
          25% { transform: translateY(-8px) scale(1.05); }
          50% { transform: translateY(0) scale(1); }
          75% { transform: translateY(-4px) scale(1.02); }
        }
        .animate-victory-bounce {
          animation: victoryBounce 1.2s ease-in-out infinite;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-6px); }
          20%, 40%, 60%, 80% { transform: translateX(6px); }
        }
        .animate-shake {
          animation: shake 0.6s ease-in-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }

        .confetti-container {
          position: absolute;
          top: -20px;
          left: 0;
          right: 0;
          height: 0;
          pointer-events: none;
        }
        .confetti {
          position: absolute;
          width: 8px;
          height: 14px;
          top: 0;
          opacity: 0;
          animation: confettiFall linear forwards;
        }
        @keyframes confettiFall {
          0% {
            opacity: 1;
            transform: translateY(0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translateY(200px) rotate(720deg);
          }
        }
      `}</style>
    </div>
  );
};

export default TicTacToeArena;