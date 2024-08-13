import React, { createContext, useState } from 'react';

export const UnreadMessagesContext = createContext();

export const UnreadMessagesProvider = ({ children }) => {
    const [unreadCount, setUnreadCount] = useState(0);

    return (
        <UnreadMessagesContext.Provider value={{ unreadCount, setUnreadCount }}>
            {children}
        </UnreadMessagesContext.Provider>
    );
}