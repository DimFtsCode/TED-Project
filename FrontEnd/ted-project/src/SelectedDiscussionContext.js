import React, { createContext, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const SelectedDiscussionContext = createContext();

export const SelectedDiscussionProvider = ({ children }) => {
    const [selectedDiscussionId, setSelectedDiscussionId] = useState(null);
    const location = useLocation();

    useEffect( () => {
        // Reset selected discussion id when navigating away from discussions page
        if (location.pathname !== "/user/discussions") {
            setSelectedDiscussionId(null);
        }
    }, [location]);

    return (
        <SelectedDiscussionContext.Provider value={{ selectedDiscussionId, setSelectedDiscussionId }}>
            {children}
        </SelectedDiscussionContext.Provider>
    );
};

