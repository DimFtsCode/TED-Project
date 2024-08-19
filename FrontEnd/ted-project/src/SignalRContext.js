import React, { createContext, useEffect, useRef, useState, useContext } from 'react';
import * as signalR from '@microsoft/signalr';
import { UserContext } from './UserContext';

export const SignalRContext = createContext();

export const SignalRProvider = ({ children }) => {
  const connectionRef = useRef(null);
  const { user: currentUser } = useContext(UserContext);
  const [connected, setConnected] = useState(false);
  const [message, setMessage] = useState(null);  // Store messages globally
  const [friendRequests, setFriendRequests] = useState(0);  // Store friend requests globally

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7176/chathub")
      .configureLogging(signalR.LogLevel.Information)
      .build();

    connection.start()
      .then(() => {
        console.log("Connected to SignalR:", connection);
        setConnected(true);
      })
      .catch((err) => console.error("SignalR Connection Error: ", err));
    
    // Handle incoming messages
    connection.on("ReceiveMessage", (user, message, senderId, discussionId) => {
      setMessage({ user, message, senderId, discussionId });  // Update state when a new message is received
    });

    // Handle incoming friend requests
    connection.on("ReceiveFriendRequest", (recipientUserId) => {
      if (recipientUserId === currentUser?.userId ){
        setFriendRequests((prev) => prev + 1); 
      }
    });
    connectionRef.current = connection;

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop();
      }
    };
  }, [currentUser]);                                                              

  // Function to reset friend requests count
  const resetFriendRequests = () => {
    setFriendRequests(0);
  }
  return (
    <SignalRContext.Provider value={{ connection: connectionRef.current, connected, message, friendRequests, resetFriendRequests }}>
      {children}
    </SignalRContext.Provider>
  );
};