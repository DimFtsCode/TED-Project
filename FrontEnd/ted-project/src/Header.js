// src/Header.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './images/logo.jpg';
import { UserContext } from './UserContext';

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Ανακατεύθυνση στην αρχική σελίδα
  };

  return (
    <header className="bg-light">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-1">
            {!user ? (
              <Link className="navbar-brand" to="/"><strong>Business</strong></Link>
            ) : (
              <strong>Business</strong>
            )}
          </div>
          <div className="col-1">
            {!user ? (
              <Link className="navbar-brand" to="/">
                <img src={logo} alt="Logo" className="img-fluid" />
              </Link>
            ) : (
              <img src={logo} alt="Logo" className="img-fluid" />
            )}
          </div>
          <div className="col-8">
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
                        <Link className="nav-link" to="">Network</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="">Jobs</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="">Discussions</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="">Notifications</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="">Profile</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="">Settings</Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </nav>
          </div>
          {!user && (
            <div className="col-2 text-end">
              <Link className="btn btn-link nav-link" to="/register" style={{ fontWeight: 'bold' }}>Register</Link>
            </div>
          )}
          {user && (
            <div className="col-2 text-end">
              <button className="btn btn-link nav-link" onClick={handleLogout} style={{ fontWeight: 'bold' }}>Logout</button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
