import React, { createContext, useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export const SignalRContext = createContext();

export const SignalRProvider = ({ children }) => {
  const connectionRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState(null);  // Store messages globally

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7176/chathub")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.start()
      .then(() => {
        console.log("Connected to SignalR");
        setConnected(true);
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));

    connection.on("ReceiveMessage", (user, message, senderId, discussionId) => {
      setMessage({ user, message, senderId, discussionId });  // Update state when a new message is received
    });

    connectionRef.current = connection;

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, []);

  return (
    <SignalRContext.Provider value={{ connection: connectionRef.current, connected, message }}>
      {children}
    </SignalRContext.Provider>
  );
};