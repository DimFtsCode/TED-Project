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
                  {!user && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/register">Register</Link>
                      </li>
                    </>
                  )}
                  {user && user.role === 'admin' && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/admin">Admin Dashboard</Link>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link btn" onClick={handleLogout}>Logout</button>
                      </li>
                    </>
                  )}
                  {user && user.role === 'user' && (
                    <>
                      <li className="nav-item">
                        <Link className="nav-link" to="/user">User Dashboard</Link>
                      </li>
                      <li className="nav-item">
                        <button className="nav-link btn" onClick={handleLogout}>Logout</button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
