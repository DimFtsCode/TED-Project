import React from 'react';
import { Container, Row, Col, Nav, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
const UserJobs = () => {
  return (
    <Container fluid style={{ height: '100vh' }}>
      <Row>
        
        {/* Side Menu */}
        <Col xs={3} md={2} style={{  padding: '20px' }}>
          <h5 className="mt-4">Job Menu</h5>
          <Nav className="flex-column">
          <Nav.Item>
              <Nav.Link as={Link} to="/user/jobs">Home Job Page</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/user/jobs/create-ad">Create a New Job Advertise</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/user/jobs/view-ad">View Your Own Advertises</Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link as={Link} to="/user/jobs/participants">View Participants By Advertise</Nav.Link>
            </Nav.Item>
          </Nav>
        </Col>

        {/* Main Content */}
        <Col xs={9} md={10} style={{ padding: '20px' }}>
          <Card>
            <Card.Body>
              <Card.Title>Job Advertisements</Card.Title>
              <Card.Text>
                {/* Additional content can go here */}
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserJobs;
