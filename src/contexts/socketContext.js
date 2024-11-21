import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import config from "src/config";

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const socket = io("http://localhost:4000", {
// const socket = io(config.BASE_URL, {
  reconnection: true, // Enable reconnection
  reconnectionAttempts: Infinity, // Unlimited reconnection attempts
  reconnectionDelay: 1000, // Initial delay before reconnection attempt
  reconnectionDelayMax: 5000, // Maximum delay between reconnection attempts
  randomizationFactor: 0.5 // Randomization factor for reconnection delay
});

export const SocketProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // socket.on("connect", () => {
    //   console.log("Connected to server via socket");
    // });

    socket.on("notification", (data) => {
      setNotifications((prev) => [...prev, data]);
    });

    // socket.on("disconnect", () => {
    //   console.log("Disconnected from server, attempting to reconnect...");
    // });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, notifications }}>
      {children}
    </SocketContext.Provider>
  );
};
