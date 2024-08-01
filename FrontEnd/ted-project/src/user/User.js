import React, { useContext, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../UserContext';
import useIdleTimer from '../hooks/useIdleTimer';
import { Modal, Button, Container, Row, Col, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import './User.css'; 
//npm install @fortawesome/react-fontawesome @fortawesome/free-solid-svg-icons @fortawesome/fontawesome-svg-core --legacy-peer-deps

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
    <Container fluid>
      <Row>
        <Col md={2} className="bg-light sidebar">
          <Nav className="flex-column">
            <Nav.Link as={Link} to="/user/profile" className="nav-link-custom">
              <FontAwesomeIcon icon={faUser} className="me-2" />
              Profile
            </Nav.Link>
            <Nav.Link as={Link} to="/user/network" className="nav-link-custom">
              <FontAwesomeIcon icon={faNetworkWired} className="me-2" />
              Network
            </Nav.Link>
          </Nav>
        </Col>
        <Col md={10}>
          <h1>User Page</h1>
          <p>Welcome to the User Page!</p>
        </Col>
      </Row>

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
    </Container>
  );
};

export default User;
