  import React, { useState, useContext } from 'react';
  import axios from 'axios';
  import { useNavigate, Link } from 'react-router-dom';
  import { UserContext } from './UserContext';
  import { Modal, Button } from 'react-bootstrap';
  import './Home.css'; // Import the custom CSS file

  const Home = () => {
    const navigate = useNavigate();
    const { login } = useContext(UserContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showLoginModal, setShowLoginModal] = useState(false);
    const [showReclaimModal, setShowReclaimModal] = useState(false);
    const [userName, setUserName] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        const response = await axios.post('https://localhost:7176/api/userlogin/login', { email, password });
        const userData = {
          userId: response.data.userId,
          email: response.data.email,
          role: response.data.isAdmin ? 'admin' : 'user',
        };
        setUserName(response.data.firstName);
        login(userData);
        setShowLoginModal(true);

        setTimeout(() => {
          if (response.data.isAdmin) {
            navigate('/admin');
          } else {
            navigate('/user');
          }
        }, 2000);
      } catch (error) {
        setError('Invalid e-mail or password');
      }
    };

    const handleReclaimPassword = async () => {
      try {
        const response = await axios.post('https://localhost:7176/api/usercheckemail/check-email', { email });
        if (response.data.exists) {
          setShowReclaimModal(true);
        } else {
          setError('Failed to send reclaim instructions. Please try again.');
        }
      } catch (error) {
        setError('Failed to send reclaim instructions. Please try again.');
      }
    };

    return (
      <div className="home-container">
        <div className="intro-section text-center mb-5">
          <h1>Welcome to Business Network</h1>
          <p>
            Our application is your gateway to professional networking and career opportunities.
            Connect with colleagues, discover new job opportunities, and engage in discussions
            with industry leaders. With Business Network, you can:
          </p>
          <ul className="benefits-list">
            <li>Create and customize your professional profile</li>
            <li>Connect with professionals from various industries</li>
            <li>Find and apply for job opportunities</li>
            <li>Participate in industry-specific discussions</li>
            <li>Receive notifications about important updates and opportunities</li>
            <li>Manage your professional network and grow your career</li>
          </ul>
          <p>
            Join our network and take the next step in your professional journey. 
            Please fill in your details to login and get started.
          </p>
        </div>
        <div className="login-section d-flex justify-content-center align-items-center">
          <div className="login-form-container">
            <h3 className="text-center">Please fill in your details to <strong>Log In</strong></h3>
            <form onSubmit={handleSubmit} className="mt-4">
              <div className="form-group">
                <label htmlFor="email">E-mail address</label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter e-mail"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  className="form-control"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  required
                />
              </div>
              <div className="d-flex justify-content-between">
                <button type="submit" className="btn btn-primary w-45">
                  Log In
                </button>
                <Link to="/register" className="btn btn-secondary w-45">
                  Sign Up
                </Link>
              </div>
              {error && <p className="text-danger mt-2">{error}</p>}
            </form>
            <div className="text-center mt-3">
              <button className="btn btn-link" onClick={handleReclaimPassword}>
                Reclaim Password
              </button>
            </div>
          </div>
        </div>
        <Modal show={showLoginModal} onHide={() => setShowLoginModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: 'green' }}>Welcome back, {userName}!</Modal.Title>
          </Modal.Header>
        </Modal>
        <Modal show={showReclaimModal} onHide={() => setShowReclaimModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title style={{ color: 'green' }}>Instructions Sent</Modal.Title>
          </Modal.Header>
          <Modal.Body>Instructions have been sent to your e-mail.</Modal.Body>
        </Modal>
      </div>
    );
  };

  export default Home;
