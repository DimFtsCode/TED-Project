import React, { useContext, useState, useEffect } from 'react';
import Badge from 'react-bootstrap/Badge';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import transparent_logo from './images/transparent-logo.png';
import { UserContext } from './UserContext';
import { UnreadMessagesContext } from './UnreadMessagesContext';
import { SelectedDiscussionContext } from './SelectedDiscussionContext';
import { SignalRContext } from './SignalRContext';
import axios from 'axios';

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const {unreadCount, setUnreadCount} = useContext(UnreadMessagesContext);
  const { selectedDiscussionId } = useContext(SelectedDiscussionContext);
  const { message, friendRequests } = useContext(SignalRContext);
  const [ pendingFriendRequests, setPendingFriendRequests] = useState(0);
  const navigate = useNavigate();
  
  const fetchUnreadCount = async () => {
    if (user && user.userId) {
      try {
        const response = await axios.get(`https://localhost:7176/api/discussions/user/${user.userId}`);
        const discussions = response.data;
        const unreadMessagesCount = discussions.reduce((total, discussion) => {
          // exclude selected discussion from unread count
          if (discussion.id !== selectedDiscussionId){
            return total + (discussion.unreadCount || 0);
          }
          return total;
        }, 0);
        // console.log("Header: Fetched unread messages count: ", unreadMessagesCount);
        setUnreadCount(unreadMessagesCount);
      } catch (error) {
        console.error("Error fetching unread messages count: ", error);
      }
    }
  };

  // Function to fetch pending friend requests
  const fetchUserFriendRequests = async () => {
    if (user && user.userId) {
      try {
        const response = await axios.get(`https://localhost:7176/api/usernetwork/${user.userId}/requests`);
        // console.log("User : ", user.userId, "Friend Requests Response:", response.data); // Log the response
        setPendingFriendRequests(response.data.length); // Update the count with the length of pending requests
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    }
  };

  // fetch unread count and friend requests on component mount
  useEffect(() => {
    fetchUnreadCount();
    if (friendRequests > 0) {
      fetchUserFriendRequests();
    }
  }, [user]);

  // fetch the user's pending friend requests when the friendRequests state changes
  useEffect( () => {
    if (friendRequests > 0) {
      fetchUserFriendRequests();
    } else {
      setPendingFriendRequests(0);
    }
  }, [friendRequests]);

  useEffect(() => {
    if (message){
      console.log("Header: Received message from SignalR ", message);
      if (message.senderId !== user.userId) {
        fetchUnreadCount();
      }
    } 
  }, [message]);

  useEffect(() => {
    // Update unread count periodically
    const intervalId = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(intervalId);
  }, [user]);

  const handleLogout = () => {
    logout();
    navigate('/'); // Ανακατεύθυνση στην αρχική σελίδα
  };

  return (
    <header className="container-fluid">
      <div className="row align-items-center d-flex justify-content-between">
        <div className="col-1">
          <Link className="navbar-brand" to={user ? "/user" : "/"}>
            <img src={transparent_logo} alt="Logo" className="img-fluid" />
          </Link>
        </div>
        <div className="col justify-content-center">
          <nav className="navbar navbar-expand-lg navbar-light">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
              <ul className="navbar-nav">
                {user?.role === 'admin' && (
                  <li className="nav-item">
                    <Link className="nav-link" to="/admin">Admin Dashboard</Link>
                  </li>
                )}
                {user?.role === 'user' && (
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
                        Discussions {unreadCount > 0 && <Badge pill bg="primary">{unreadCount}</Badge>}
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link className="nav-link" to="/user/notifications">
                        Notifications {pendingFriendRequests > 0 && <Badge pill bg="primary">{pendingFriendRequests}</Badge>}
                      </Link>
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
          <div className="col-auto d-flex justify-content-end">
            <Link className="btn btn-link nav-link" to="/register" style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>Register</Link>
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
