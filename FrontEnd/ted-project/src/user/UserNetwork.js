// src/user/UserNetwork.js
import React from 'react';
import { Container, Row, Col, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './User.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faNetworkWired } from '@fortawesome/free-solid-svg-icons';

const UserNetwork = () => {
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
          <h2>User Network</h2>
          <p>Here is your network information.</p>
          {/* Προσθέστε λίστα φίλων ή άλλες πληροφορίες δικτύου εδώ */}
        </Col>
      </Row>
    </Container>
  );
};

export default UserNetwork;
