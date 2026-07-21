import { useState } from "react";
import { useLocation, useNavigate, Navigate } from "react-router-dom";
import Navbar from "../../../components/layout/Navbar";
import { getBotMove } from "../services/botService";

const WIN_PATTERNS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const checkWin = (board, symbol) =>
  WIN_PATTERNS.some((p) => p.every((i) => board[i] === symbol));

const TicTacToeBotArena = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { difficulty } = location.state || {};

  const [board, setBoard] = useState(Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState(true);
  const [gameStatus, setGameStatus] = useState("PLAYING");
  const [winner, setWinner] = useState(null);
  const [isBotThinking, setIsBotThinking] = useState(false);

  const mySymbol = "X";
  const botSymbol = "O";

  if (!difficulty) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleCellClick = async (index) => {
    if (
      !isMyTurn ||
      board[index] !== null ||
      gameStatus !== "PLAYING" ||
      isBotThinking
    ) {
      return;
    }

    const newBoard = [...board];
    newBoard[index] = mySymbol;
    setBoard(newBoard);

    if (checkWin(newBoard, mySymbol)) {
      setGameStatus("WON");
      setWinner(mySymbol);
      return;
    }
    if (newBoard.every((cell) => cell !== null)) {
      setGameStatus("DRAW");
      return;
    }

    setIsMyTurn(false);
    setIsBotThinking(true);

    try {
      const result = await getBotMove(newBoard, botSymbol, difficulty);
      setBoard(result.board);

      if (result.status === "WON") {
        setGameStatus("WON");
        setWinner(result.winner);
      } else if (result.status === "DRAW") {
        setGameStatus("DRAW");
      } else {
        setIsMyTurn(true);
      }
    } catch (err) {
      console.error("Bot move failed:", err);
      setIsMyTurn(true); // let the player retry rather than getting stuck
    } finally {
      setIsBotThinking(false);
    }
  };

  const renderEndGameMessage = () => {
    if (gameStatus === "DRAW") return "🤝 It's a Draw!";
    if (gameStatus === "WON")
      return winner === mySymbol ? "🎉 You Won!" : "🤖 Bot Wins!";
    return null;
  };

  return (
    <div className="min-h-screen bg-arena-bg text-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md mb-4 flex justify-start">
          <button
            onClick={() => navigate("/dashboard")}
            className="text-xs bg-red-950/60 border border-red-800 text-red-300 px-3.5 py-1.5 rounded-lg hover:bg-red-900 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>←</span> Leave
          </button>
        </div>

        <div className="bg-arena-surface border border-arena-border rounded-xl p-4 mb-8 w-full max-w-md flex justify-between items-center shadow-lg">
          <div className="text-left">
            <p className="text-xs text-gray-500 font-mono">YOU ({mySymbol})</p>
            <p className="font-bold text-accent-cyan">Player</p>
          </div>
          <div className="text-gray-600 font-mono text-sm">VS</div>
          <div className="text-right">
            <p className="text-xs text-gray-500 font-mono">
              BOT · {difficulty}
            </p>
            <p className="font-bold text-red-400">CPU</p>
          </div>
        </div>

        <div className="mb-6 text-center">
          {gameStatus === "PLAYING" ? (
            <p
              className={`text-lg font-medium ${isMyTurn ? "text-accent-green animate-pulse" : "text-gray-500"}`}
            >
              {isBotThinking
                ? "Bot is thinking..."
                : isMyTurn
                  ? "Your Turn"
                  : "Bot's Turn..."}
            </p>
          ) : (
            <p className="text-2xl font-extrabold text-accent-amber">
              {renderEndGameMessage()}
            </p>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3 bg-arena-surface p-4 rounded-2xl border border-arena-border shadow-2xl w-80 h-80">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!isMyTurn || cell !== null || gameStatus !== "PLAYING"}
              className={`h-22 w-22 bg-arena-bg border border-arena-border rounded-xl text-4xl font-extrabold flex items-center justify-center transition duration-150 ${
                cell === "X" ? "text-accent-cyan" : "text-red-500"
              } ${isMyTurn && cell === null ? "hover:bg-arena-surfaceHover cursor-pointer" : "cursor-default"}`}
            >
              {cell}
            </button>
          ))}
        </div>

        {gameStatus !== "PLAYING" && (
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-8 bg-accent-cyan hover:bg-cyan-400 text-arena-bg font-semibold py-2.5 px-6 rounded-lg transition duration-200 shadow-lg cursor-pointer"
          >
            Return to Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default TicTacToeBotArena;
