import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "../../../contexts/WebSocketContext";
import { useNavigate } from "react-router-dom";

const MatchmakingQueue = ({ gameType = "tictactoe" }) => {
  const { stompClient, isConnected } = useWebSocket();
  const [isSearching, setIsSearching] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [matchDetails, setMatchData] = useState(null);
  const navigate = useNavigate();

  const timerRef = useRef(null);
  const subscriptionRef = useRef(null);

  useEffect(() => {
    if (isSearching) {
      timerRef.current = setInterval(() => {
        setSearchTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
      setSearchTime(0);
    }

    return () => clearInterval(timerRef.current);
  }, [isSearching]);

  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, []);

  const startSearch = () => {
    if (!stompClient || !isConnected) return;

    setIsSearching(true);

    subscriptionRef.current = stompClient.subscribe(
      "/user/queue/match",
      (message) => {
        const data = JSON.parse(message.body);
        setMatchData(data);
        setIsSearching(false);

        // Route matches the game that was queued for — currently only
        // tictactoe has an arena built, so this stays hardcoded to that
        // path until more games are wired up.
        navigate(`/game/tictactoe/${data.roomId}`, { state: data });
      },
    );

    stompClient.publish({ destination: "/app/matchmake.join" });
  };

  const cancelSearch = () => {
    if (!stompClient || !isConnected) return;

    setIsSearching(false);
    stompClient.publish({ destination: "/app/matchmake.leave" });

    if (subscriptionRef.current) {
      subscriptionRef.current.unsubscribe();
      subscriptionRef.current = null;
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="bg-arena-surface border border-arena-border p-6 rounded-2xl shadow-lg max-w-md w-full mx-auto text-center text-white">
      <p className="font-mono text-[10px] tracking-widest text-accent-cyan mb-1">
        {gameType.toUpperCase()} // QUEUE
      </p>
      <h2 className="font-display text-xl font-bold mb-4 tracking-wide text-gray-100">
        Random Matchmaking
      </h2>

      {!isSearching && !matchDetails && (
        <div>
          <p className="text-gray-500 mb-6 text-sm">
            Enter the queue to be matched against a live opponent.
          </p>
          <button
            onClick={startSearch}
            disabled={!isConnected}
            className={`w-full py-3 px-6 rounded-lg font-semibold tracking-wide transition duration-200 ${
              isConnected
                ? "bg-accent-cyan hover:bg-cyan-400 text-arena-bg shadow-md shadow-cyan-900/30"
                : "bg-arena-bg text-gray-600 cursor-not-allowed border border-arena-border"
            }`}
          >
            {isConnected ? "Find Match" : "Connecting..."}
          </button>
        </div>
      )}

      {isSearching && (
        <div className="space-y-6">
          <div className="flex justify-center items-center space-x-2">
            <span className="w-3 h-3 bg-accent-cyan rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-3 h-3 bg-accent-cyan rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-3 h-3 bg-accent-cyan rounded-full animate-bounce"></span>
          </div>
          <p className="text-gray-300 font-medium animate-pulse text-lg">
            Searching for an opponent...
          </p>
          <p className="text-gray-500 font-mono text-sm">
            Time elapsed: {formatTime(searchTime)}
          </p>
          <button
            onClick={cancelSearch}
            className="w-full py-2.5 px-6 border border-arena-border rounded-lg text-gray-300 font-medium hover:bg-arena-surfaceHover transition duration-200"
          >
            Cancel Search
          </button>
        </div>
      )}

      {matchDetails && (
        <div className="border border-accent-green/30 bg-accent-green/10 p-4 rounded-lg space-y-3">
          <p className="text-accent-green font-bold text-lg animate-bounce">
            Match Found!
          </p>
          <div className="text-sm text-gray-300 space-y-1">
            <p>
              Opponent:{" "}
              <span className="font-semibold text-white">
                {matchDetails.opponent}
              </span>
            </p>
            <p>
              Your Symbol:{" "}
              <span className="font-mono font-bold text-accent-cyan">
                {matchDetails.playerSymbol}
              </span>
            </p>
            <p className="text-xs text-gray-500 font-mono mt-2">
              Room: {matchDetails.roomId.substring(0, 8)}...
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchmakingQueue;
