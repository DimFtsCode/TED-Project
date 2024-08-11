import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './images/logo.jpg';
import transparent_logo from './images/transparent-logo.png';
import { UserContext } from './UserContext';

const Header = () => {
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

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
                        <Link className="nav-link" to="">Jobs</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="">Discussions</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="/user/notifications">Notifications</Link>
                      </li>
                      <li className="nav-item">
                        <Link className="nav-link" to="">Profile</Link>
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
