import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import logo from './images/logo.jpg'; 

const Header = () => {
  return (
    <header className="bg-light">
        <div className="container">
        <div className="row align-items-center">
          <div className="col-1">
            <Link className="navbar-brand" to="/"><strong>Business</strong></Link>
          </div>
          <div className="col-1">
            <Link className="navbar-brand" to="/">
              <img src={logo} alt="Logo" className="img-fluid" />
            </Link>
          </div>
          <div className="col-8">
            <nav className="navbar navbar-expand-lg navbar-light">
              <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
                <ul className="navbar-nav">
                  <li className="nav-item">
                    <Link className="nav-link" to="/register">Register</Link>
                  </li>
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
