import React, { createContext, useContext, useEffect, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const WebSocketContext = createContext(null);

export const useWebSocket = () => useContext(WebSocketContext);

export const WebSocketProvider = ({ children }) => {
  const [stompClient, setStompClient] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Extract the token from local storage
    const token = localStorage.getItem("token");

    const client = new Client({
      webSocketFactory: () =>
        new SockJS(`${import.meta.env.VITE_API_BASE_URL}/ws`),
      connectHeaders: {
        // Pass the bearer token safely inside the native STOMP connect payload frame
        Authorization: token ? `Bearer ${token}` : "",
      },
      debug: (str) => console.log("[STOMP Debug]: " + str),
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = (frame) => {
      console.log("Connected securely to Spring Boot WebSockets!");
      setIsConnected(true);
    };

    client.onDisconnect = () => {
      console.log("Disconnected securely from WebSockets.");
      setIsConnected(false);
    };

    client.activate();
    setStompClient(client);

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <WebSocketContext.Provider value={{ stompClient, isConnected }}>
      {children}
    </WebSocketContext.Provider>
  );
};
