import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Row, Col, Nav, Form, FormControl, Button, Table, Pagination, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import './User.css';
import { UserContext } from '../UserContext';

const UserNetwork = () => {
  const { user: currentUser } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [friends, setFriends] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const resultsPerPage = 10;

  useEffect(() => {
    if (currentUser) {
      fetchFriends();
    }
  }, [currentUser]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`https://localhost:7176/api/usernetwork/${currentUser.userId}/friends`);
      console.log("Friends Response:", response.data); // Εκτύπωση της απάντησης
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
      setError('Error fetching friends.');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.get('https://localhost:7176/api/usernetwork/search', {
        params: { query: searchTerm },
      });
      console.log("Search Results:", response.data); // Εκτύπωση της απάντησης αναζήτησης
      setSearchResults(response.data);
      setCurrentPage(1); // Reset to first page on new search
    } catch (error) {
      console.error('Error searching users:', error);
      setError('No users found.');
    }
  };

  const handleConnect = async (friendId) => {
    try {
      await axios.post(`https://localhost:7176/api/usernetwork/${currentUser.userId}/sendrequest/${friendId}`);
      alert('Connection request sent!');
    } catch (error) {
      console.error('Error connecting to user:', error);
      setError('Error connecting to user.');
    }
  };

  const handleViewProfile = (userId) => {
    // Logic to view user profile
    console.log(`View profile of user ${userId}`);
  };

  const handleStartChat = (userId) => {
    // Logic to start chat with user
    console.log(`Start chat with user ${userId}`);
  };

  // Calculate the current page results
  const indexOfLastResult = currentPage * resultsPerPage;
  const indexOfFirstResult = indexOfLastResult - resultsPerPage;
  const currentResults = searchResults.slice(indexOfFirstResult, indexOfLastResult);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
          <Container className="mt-4">
            {error && <div className="alert alert-danger mt-3">{error}</div>}
            <h3>Connected Friends</h3>
            <Table striped bordered hover className="mt-3">
              <thead>
                <tr>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {friends.map((friend, index) => (
                  <tr key={index}>
                    <td>{friend.firstName}</td>
                    <td>{friend.lastName}</td>
                    <td>{friend.email}</td>
                    <td>
                      <Button variant="primary" onClick={() => handleViewProfile(friend.userId)}>View Profile</Button>
                      <Button variant="secondary" onClick={() => handleStartChat(friend.userId)} className="ml-2">Chat</Button>
                      <Button variant="success" onClick={() => handleConnect(friend.userId)} className="ml-2">Connect</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Form inline="true" onSubmit={handleSearch} className="mt-4">
              <FormControl
                type="text"
                placeholder="Search by name or email"
                className="mr-sm-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Button variant="outline-success" type="submit">Search</Button>
            </Form>
            <Row className="mt-3">
              {currentResults.map((user) => (
                <Col md={4} key={user.userId} className="mb-3">
                  <Card>
                    <Card.Body>
                      <Card.Title>{user.firstName} {user.lastName}</Card.Title>
                      <Card.Text>Email: {user.email}</Card.Text>
                      <Button variant="primary" onClick={() => handleViewProfile(user.userId)}>View Profile</Button>
                      <Button variant="secondary" onClick={() => handleStartChat(user.userId)} className="ml-2">Chat</Button>
                      <Button variant="success" onClick={() => handleConnect(user.userId)} className="ml-2">Connect</Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            <Pagination>
              {Array.from({ length: Math.ceil(searchResults.length / resultsPerPage) }, (_, i) => (
                <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => paginate(i + 1)}>
                  {i + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </Container>
        </Col>
      </Row>
    </Container>
  );
};

export default UserNetwork;
