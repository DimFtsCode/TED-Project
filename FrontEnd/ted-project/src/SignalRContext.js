import React, { createContext, useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';

export const SignalRContext = createContext();

export const SignalRProvider = ({ children }) => {
  const connectionRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState(null);  // Store messages globally
  const [pendingFriendRequests, setPendingFriendRequests] = useState(0);  // Store friend requests globally

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
    
    // Handle incoming messages
    connection.on("ReceiveMessage", (user, message, senderId, discussionId) => {
      setMessage({ user, message, senderId, discussionId });  // Update state when a new message is received
    });

    // Handle incoming friend requests
    connection.on("ReceiveFriendRequest", (recipientUserId) => {
      console.log(`Received friend request for user: ${recipientUserId}`);
      // Increase the count of pending friend requests when a new one is received
      setPendingFriendRequests(prevCount => prevCount + 1);
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