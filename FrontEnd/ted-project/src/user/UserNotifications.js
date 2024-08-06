import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Button, Table, Tabs, Tab } from 'react-bootstrap';
import { UserContext } from '../UserContext';

const UserNotifications = () => {
  const { user: currentUser } = useContext(UserContext);
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [notesOfInterest, setNotesOfInterest] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (currentUser) {
      fetchConnectionRequests();
      fetchNotesOfInterest();
    }
  }, [currentUser]);

  const fetchConnectionRequests = async () => {
    try {
      const response = await axios.get(`https://localhost:7176/api/usernetwork/${currentUser.userId}/requests`);
      console.log("Connection Requests Response:", response.data); // Εκτύπωση της απάντησης
      setConnectionRequests(response.data); // Χρήση του response.data
    } catch (error) {
      console.error('Error fetching connection requests:', error);
      setError('Error fetching connection requests.');
    }
  };

  const fetchNotesOfInterest = async () => {
    try {
      const response = await axios.get(`https://localhost:7176/api/notesofinterest/${currentUser.userId}`);
      setNotesOfInterest(response.data);
    } catch (error) {
      console.error('Error fetching notes of interest:', error);
      setError('Error fetching notes of interest.');
    }
  };

  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await axios.post(`https://localhost:7176/api/usernetwork/connectionrequests/${requestId}/accept`);
      console.log(response.data); // Εκτύπωση της απάντησης
      fetchConnectionRequests();
    } catch (error) {
      console.error('Error accepting connection request:', error);
      setError('Error accepting connection request.');
    }
  };
  
  const handleRejectRequest = async (requestId) => {
    try {
      const response = await axios.post(`https://localhost:7176/api/usernetwork/connectionrequests/${requestId}/reject`);
      console.log(response.data); // Εκτύπωση της απάντησης
      fetchConnectionRequests();
    } catch (error) {
      console.error('Error rejecting connection request:', error);
      setError('Error rejecting connection request.');
    }
  };

  return (
    <Container className="mt-4">
      <h2>Notifications</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <Tabs defaultActiveKey="connectionRequests" id="notification-tabs">
        <Tab eventKey="connectionRequests" title="Connection Requests">
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Sender</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(connectionRequests) && connectionRequests.map((request) => (
                <tr key={request.id}>
                  <td>{request.sender.firstName} {request.sender.lastName}</td> {/* Εμφάνιση του ονόματος αποστολέα */}
                  <td>
                    <Button variant="success" className="ml-2" onClick={() => handleAcceptRequest(request.id)}>Accept</Button>
                    <Button variant="danger" className="ml-2" onClick={() => handleRejectRequest(request.id)}>Reject</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
        <Tab eventKey="notesOfInterest" title="Notes of Interest">
          <Table striped bordered hover className="mt-3">
            <thead>
              <tr>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {notesOfInterest.map((note) => (
                <tr key={note.id}>
                  <td>{note.content}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default UserNotifications;
