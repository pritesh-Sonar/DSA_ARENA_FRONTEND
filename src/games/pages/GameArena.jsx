import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useWebSocket } from "../../contexts/WebSocketContext";
import Navbar from "../../components/layout/Navbar";

const GameArena = () => {
  const { roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { stompClient, isConnected } = useWebSocket();

  const matchData = location.state || {};
  const opponent = matchData.opponent || "Opponent";
  const mySymbol = matchData.playerSymbol || "X"; // 'X' or 'O'

  const [board, setBoard] = useState(Array(9).fill(null));
  const [isMyTurn, setIsMyTurn] = useState(mySymbol === "X");
  const [gameStatus, setGameStatus] = useState("PLAYING"); // "PLAYING", "WON", "DRAW"
  const [winningSymbol, setWinningSymbol] = useState(null); // Track which symbol won

  useEffect(() => {
    if (!stompClient || !isConnected) return;

    const gameSubscription = stompClient.subscribe(
      `/topic/game/${roomId}`,
      (message) => {
        const gameState = JSON.parse(message.body);

        setBoard(gameState.board);
        setIsMyTurn(gameState.currentTurn === mySymbol);

        if (gameState.status) {
          setGameStatus(gameState.status);
        }
        if (gameState.winner) {
          setWinningSymbol(gameState.winner);
        }
        if (gameState.winReason === "DISCONNECT") {
          setGameStatus("WON_BY_DISCONNECT"); // Create a new status for UI
        }
      },
    );

    return () => {
      gameSubscription.unsubscribe();
    };
  }, [stompClient, isConnected, roomId, mySymbol]);

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

  // Helper to evaluate what text to show when game is over
  const renderEndGameMessage = () => {
    if (gameStatus === "DRAW") {
      return "🤝 It's a Draw!";
    }

    // Check for Disconnect Win
    if (gameStatus === "WON_BY_DISCONNECT") {
      return "🎉 Opponent left! You Won by Default!";
    }

    // Check for Normal Win
    if (gameStatus === "WON") {
      return winningSymbol === mySymbol ? "🎉 You Won!" : "❌ You Lost!";
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {/* Top Control Bar (Prevents overlapping the Navbar) */}
        <div className="w-full max-w-md mb-4 flex justify-start">
          <button
            onClick={() => {
              if (stompClient && isConnected) {
                stompClient.deactivate(); // Force disconnect to trigger backend disconnect listener
              }
              navigate("/dashboard");
            }}
            className="text-xs bg-red-950/60 border border-red-800 text-red-300 px-3.5 py-1.5 rounded-lg hover:bg-red-900 transition flex items-center gap-1.5 cursor-pointer shadow-sm"
          >
            <span>←</span> Forfeit & Leave
          </button>
        </div>

        {/* Match Header Info Card */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 mb-8 w-full max-w-md flex justify-between items-center shadow-lg">
          <div className="text-left">
            <p className="text-xs text-gray-400">You ({mySymbol})</p>
            <p className="font-bold text-blue-400">Authenticated User</p>
          </div>
          <div className="text-gray-500 font-mono text-sm">VS</div>
          <div className="text-right">
            <p className="text-xs text-gray-400">Opponent</p>
            <p className="font-bold text-red-400">{opponent}</p>
          </div>
        </div>

        {/* Turn / Status Notification Bar */}
        <div className="mb-6 text-center">
          {gameStatus === "PLAYING" ? (
            <p
              className={`text-lg font-medium ${isMyTurn ? "text-green-400 animate-pulse" : "text-gray-400"}`}
            >
              {isMyTurn ? "Your Turn" : `${opponent}'s Turn...`}
            </p>
          ) : (
            <p className="text-2xl font-extrabold text-yellow-400">
              {renderEndGameMessage()}
            </p>
          )}
        </div>

        {/* Tic-Tac-Toe 3x3 Grid Board */}
        <div className="grid grid-cols-3 gap-3 bg-gray-900 p-4 rounded-2xl border border-gray-800 shadow-2xl w-80 h-80">
          {board.map((cell, index) => (
            <button
              key={index}
              onClick={() => handleCellClick(index)}
              disabled={!isMyTurn || cell !== null || gameStatus !== "PLAYING"}
              className={`h-22 w-22 bg-gray-950 border border-gray-800 rounded-xl text-4xl font-extrabold flex items-center justify-center transition duration-150 ${
                cell === "X" ? "text-blue-500" : "text-red-500"
              } ${isMyTurn && cell === null ? "hover:bg-gray-800 cursor-pointer" : "cursor-default"}`}
            >
              {cell}
            </button>
          ))}
        </div>

        {/* Return Option if game finishes */}
        {gameStatus !== "PLAYING" && (
          <button
            onClick={() => navigate("/dashboard")}
            className="mt-8 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2.5 px-6 rounded-lg transition duration-200 shadow-lg cursor-pointer"
          >
            Return to Dashboard
          </button>
        )}
      </div>
    </div>
  );
};

export default GameArena;
