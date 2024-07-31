// src/User.js
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import useIdleTimer from '../hooks/useIdleTimer';
import { Modal, Button } from 'react-bootstrap';

const User = () => {
  const navigate = useNavigate();
  const { logout } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);

  useIdleTimer(() => {
    setShowModal(true);
    setTimeout(() => {
      logout();
      navigate('/');
    }, 5000); // 5 δευτερόλεπτα
  }, 300000); // 5 λεπτά

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      <h1>User Page</h1>
      <p>Welcome to the User Page!</p>

      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Session Timeout</Modal.Title>
        </Modal.Header>
        <Modal.Body>You have been inactive for a while. You will be logged out in 5 seconds.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseModal}>
            OK
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default User;
