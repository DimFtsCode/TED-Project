import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Container, Row, Col, Nav, Form, FormControl, Button, Table, Pagination, Card, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../UserContext';

const UserNetwork = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [error, setError] = useState('');
  const [friends, setFriends] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showChatModal, setShowChatModal] = useState(false);
  const [message, setMessage] = useState('');
  const [selectedFriendId, setSelectedFriendId] = useState(null);
  const resultsPerPage = 10;

  useEffect(() => {
    if (currentUser) {
      fetchFriends();
    }
  }, [currentUser]);

  const fetchFriends = async () => {
    try {
      const response = await axios.get(`https://localhost:7176/api/usernetwork/${currentUser.userId}/friends`);
      setFriends(response.data);
    } catch (error) {
      setError('Error fetching friends.');
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError('');
    try {
        const response = await axios.get(`https://localhost:7176/api/usernetwork/${currentUser.userId}/search`, {
            params: { query: searchTerm },
        });
        setSearchResults(response.data);
        setCurrentPage(1); // Reset to first page on new search
    } catch (error) {
        setError('No users found.');
    }
  };

  const handleConnect = async (friendId) => {
    try {
      await axios.post(`https://localhost:7176/api/usernetwork/${currentUser.userId}/sendrequest/${friendId}`);
      alert('Connection request sent!');
    } catch (error) {
      setError('Error connecting to user.');
    }
  };

  const handleViewProfile = (userId) => {
    navigate(`/network/user/${userId}`);
  };

  const handleChatClick = (friendId) => {
    setSelectedFriendId(friendId);
    setShowChatModal(true);
  };

  const handleCloseChatModal = () => {
    setShowChatModal(false);
    setMessage('');
  };

  const handleSendMessage = async () => {
    try {
      if (!currentUser || !currentUser.userId) {
        alert('User is not logged in');
        return;
      }
      const response = await axios.post(`https://localhost:7176/api/discussions`, {
        participants: [currentUser.userId, selectedFriendId]
      });
      const discussionId = response.data.id;
      await axios.post(`https://localhost:7176/api/messages/send`, {
        text: message,
        senderId: currentUser.userId,
        discussionId: discussionId,
        timestamp: new Date().toISOString()
      });
      setMessage('');
      setShowChatModal(false);
      navigate('/user/discussion');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message');
    }
  };

  

  const handleDeleteFriend = async (friendId) => {
    try {
      await axios.delete(`https://localhost:7176/api/usernetwork/${currentUser.userId}/friends/${friendId}`);
      setFriends(friends.filter(friend => friend.userId !== friendId));
      alert('Friend deleted successfully!');
    } catch (error) {
      setError('Error deleting friend.');
    }
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
                      <Button variant="info" onClick={() => handleChatClick(friend.userId)} className="ml-2">Chat</Button>
                      <Button variant="danger" onClick={() => handleDeleteFriend(friend.userId)} className="ml-2">Block</Button>
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

      {/* Chat Modal */}
      <Modal show={showChatModal} onHide={handleCloseChatModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Send Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="messageText">
              <Form.Label>Message</Form.Label>
              <Form.Control 
                as="textarea" 
                rows={3} 
                value={message} 
                onChange={(e) => setMessage(e.target.value)} 
                placeholder="Enter your message here" 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseChatModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSendMessage}>
            Send Message
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserNetwork;
