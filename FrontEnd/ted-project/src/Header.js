import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import transparent_logo from './images/transparent-logo.png';
import { UserContext } from './UserContext';
import { UnreadMessagesContext } from './UnreadMessagesContext';
import axios from 'axios';

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const {unreadCount, setUnreadCount} = useContext(UnreadMessagesContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (user && user.userId) {
        try {
          const response = await axios.get(`https://localhost:7176/api/discussions/user/${user.userId}`);
          const discussions = response.data;
          const unreadMessagesCount = discussions.reduce((total, discussion) => {
            return total + (discussion.unreadCount || 0);
          }, 0);
          setUnreadCount(unreadMessagesCount);
        } catch (error) {
          console.error("Error fetching unread messages count: ", error);
        }
      }
    };
    fetchUnreadCount();

    // update unread count every 30 seconds
    const intervalId = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(intervalId);
  }, [user, setUnreadCount]);

  const handleLogout = () => {
    logout();
    navigate('/'); // Ανακατεύθυνση στην αρχική σελίδα
  };

  return (
    <header className="container-fluid">
        <div className="row align-items-center d-flex justify-content-between">
          <div className="col-1">
            {!user ? (
              <Link className="navbar-brand" to="/">
                <img src={transparent_logo} alt="Logo" className="img-fluid" />
              </Link>
            ) : (
              <Link className="navbar-brand" to="/user">
                <img src={transparent_logo} alt="Logo" className="img-fluid" />
              </Link>
            )}
          </div>
          <div className="col justify-content-center">
            <nav className="navbar navbar-expand-lg navbar-light">
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                <ul className="navbar-nav">
                  {user && user.role === 'admin' && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/admin">Admin Dashboard</Link>
                      </li>
                    </>
                  )}
                  {user && user.role === 'user' && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/user">Home</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/user/network">Network</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/user/jobs">Jobs</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/user/discussion">
                         Discussions{unreadCount > 0 ? ` (${unreadCount})` : ''}
                         </Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/user/notifications">Notifications</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/user/profile">Profile</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/user/settings">Settings</Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </nav>
          </div>
          {!user && (
            <div className="col-auto d-flex justify-content-end" >
              <Link className="btn btn-link nav-link" to="/register" style={{ fontWeight: 'bold', fontSize: '1.25rem'}}>Register</Link>
            </div>
          )}
          {user && (
            <div className="col-auto d-flex justify-content-end">
              <button className="btn btn-link nav-link" onClick={handleLogout} style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Logout</button>
            </div>
          )}
      </div>
    </header>
  );
};

export default Header;
