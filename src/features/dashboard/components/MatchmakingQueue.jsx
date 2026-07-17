import React, { useState, useEffect, useRef } from "react";
import { useWebSocket } from "../../../contexts/WebSocketContext";
import { useNavigate } from "react-router-dom";

const MatchmakingQueue = () => {
  const { stompClient, isConnected } = useWebSocket();
  const [isSearching, setIsSearching] = useState(false);
  const [searchTime, setSearchTime] = useState(0);
  const [matchDetails, setMatchData] = useState(null);
  const navigate = useNavigate();

  const timerRef = useRef(null);
  const subscriptionRef = useRef(null);

  // Track elapsed queue time
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

  // Cleanup subscriptions cleanly if component unmounts unexpectedly
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

    // 1. Subscribe to the unique private user queue mapped in MatchmakingService
    subscriptionRef.current = stompClient.subscribe(
      "/user/queue/match",
      (message) => {
        const data = JSON.parse(message.body);
        setMatchData(data);
        setIsSearching(false);
        console.log("Match Found! Redirecting to arena...", data);

        // 3. Redirect to the game arena, passing room metadata via route state
        navigate(`/arena/${data.roomId}`, { state: data });
      },
    );

    // 2. Publish a payload-free signal to target your backend controller endpoint
    stompClient.publish({ destination: "/app/matchmake.join" });
  };

  const cancelSearch = () => {
    if (!stompClient || !isConnected) return;

    setIsSearching(false);

    // Notify backend to remove player from ConcurrentLinkedQueue structure
    stompClient.publish({ destination: "/app/matchmake.leave" });

    // Kill active subscription channel gracefully
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
    <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl shadow-lg max-w-md w-full mx-auto text-center text-white">
      <h2 className="text-xl font-bold mb-4 tracking-wide text-gray-100">
        DSA Arena Matchmaking
      </h2>

      {!isSearching && !matchDetails && (
        <div>
          <p className="text-gray-400 mb-6 text-sm">
            Ready to battle? Enter the active queue structure to match against
            live players.
          </p>
          <button
            onClick={startSearch}
            disabled={!isConnected}
            className={`w-full py-3 px-6 rounded-lg font-semibold tracking-wide transition duration-200 ${
              isConnected
                ? "bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-900/30 text-white"
                : "bg-gray-800 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isConnected ? "Find Match" : "Connecting to Core Broker..."}
          </button>
        </div>
      )}

      {isSearching && (
        <div className="space-y-6">
          <div className="flex justify-center items-center space-x-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></span>
          </div>
          <p className="text-gray-300 font-medium animate-pulse text-lg">
            Searching for an opponent...
          </p>
          <p className="text-gray-500 font-mono text-sm">
            Time elapsed: {formatTime(searchTime)}
          </p>
          <button
            onClick={cancelSearch}
            className="w-full py-2.5 px-6 border border-gray-700 rounded-lg text-gray-300 font-medium hover:bg-gray-800 transition duration-200"
          >
            Cancel Search
          </button>
        </div>
      )}

      {matchDetails && (
        <div className="border border-green-800 bg-green-950/20 p-4 rounded-lg space-y-3">
          <p className="text-green-400 font-bold text-lg animate-bounce">
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
              <span className="font-mono font-bold text-blue-400">
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
