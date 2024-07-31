// src/Footer.js
import React, { useContext } from 'react';
import { UserContext } from './UserContext';
import './Footer.css';


const Footer = () => {
  const { user } = useContext(UserContext);

  return (
    <footer className="bg-light text-center py-3">
      <div className="container">
        {!user ? (
          <p>Welcome to our site! Please login or register for more features.</p>
        ) : (
          <>
            {user.role === 'admin' && (
              <p>Welcome Admin! Manage your site .</p>
            )}
            {user.role === 'user' && (
              <p>Welcome back! Check your dashboard here.</p>
            )}
          </>
        )}
      </div>
    </footer>
  );
};

export default Footer;
