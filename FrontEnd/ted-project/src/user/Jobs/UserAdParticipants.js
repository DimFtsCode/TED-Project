import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, ListGroup, Spinner, Alert, Nav, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';

const UserAdParticipants = () => {
  const { user } = useContext(UserContext);
  const [jobs, setJobs] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [expandedParticipantId, setExpandedParticipantId] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`https://localhost:7176/api/advertisement/user/${user.userId}`);
        setJobs(response.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    if (user && user.userId) {
      fetchJobs();
    }
  }, [user]);

  const handleJobClick = async (id) => {
    setSelectedJob(id);
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(`https://localhost:7176/api/advertisement/${id}/participants`);
      const participantIds = response.data.map(p => p.userId);
      fetchParticipantDetails(participantIds);
    } catch (error) {
      console.error('Error fetching participants:', error);
      setError('Failed to load participants.');
      setLoading(false);
    }
  };

  const fetchParticipantDetails = async (participantIds) => {
    try {
      const participantsData = await Promise.all(
        participantIds.map(async (id) => {
          const response = await axios.get(`https://localhost:7176/api/users/${id}`);
          return response.data;
        })
      );
      setParticipants(participantsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching participant details:', error);
      setError('Failed to load participant details.');
      setLoading(false);
    }
  };

  const handleParticipantClick = (participantId) => {
    if (expandedParticipantId === participantId) {
      setExpandedParticipantId(null);
    } else {
      setExpandedParticipantId(participantId);
    }
  };

  const handleSendMessage = async (participantId) => {
    try {
      if (!user || !user.userId) {
        alert('User is not logged in');
        return;
      }
  
      const message = "Hello, I'm interested in connecting with you regarding your application.";
  
      const response = await axios.post(`https://localhost:7176/api/discussions`, {
        participants: [user.userId, participantId]
      });
  
      const discussionId = response.data.id;
  
      await axios.post(`https://localhost:7176/api/messages/send`, {
        text: message,
        senderId: user.userId,
        discussionId: discussionId,
        timestamp: new Date().toISOString()
      });
  
      setSuccessMessage(`"${message}" has been sent successfully!`);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message.');
    }
  };

  const handleDismiss = async (advertisementId, participantId) => {
    try {
      if (!user || !user.userId) {
        alert('User is not logged in');
        return;
      }
  
      const adTitle = selectedJob ? selectedJob.title : "this advertisement";
  
      const message = `We have chosen a candidate who more closely matches our requirements for the position titled "${adTitle}".`;
  
      await axios.delete(`https://localhost:7176/api/advertisement/${advertisementId}/participant/${participantId}`);
  
      const response = await axios.post(`https://localhost:7176/api/discussions`, {
        participants: [user.userId, participantId]
      });
  
      const discussionId = response.data.id;
  
      await axios.post(`https://localhost:7176/api/messages/send`, {
        text: message,
        senderId: user.userId,
        discussionId: discussionId,
        timestamp: new Date().toISOString()
      });
  
      setParticipants(participants.filter(p => p.userId !== participantId));
  
      setSuccessMessage(`"${message}" has been sent successfully to the dismissed participant.`);
      setShowSuccessModal(true);
    } catch (error) {
      console.error('Error dismissing participant:', error);
      setError('Failed to dismiss participant.');
    }
  };

  const closeModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <Container fluid style={{ height: '100vh' }}>
      <Row>
        <Col xs={3} md={2} style={{ padding: '20px' }}>
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

          <h5 className="mt-4">Select a Job Advertisement</h5>

          <ListGroup variant="flush" className="mt-4">
            {jobs.map(job => (
              <ListGroup.Item key={job.advertisementId} action onClick={() => handleJobClick(job.advertisementId)}>
                {job.title}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        <Col xs={12} md={{ span: 8, offset: 1 }}>
          <Card>
            <Card.Body>
              <Card.Title>Participants</Card.Title>
              {loading ? (
                <Spinner animation="border" />
              ) : error ? (
                <Alert variant="danger">{error}</Alert>
              ) : participants.length > 0 ? (
                <ListGroup variant="flush">
                  {participants.map((participant, index) => (
                    <ListGroup.Item 
                      key={index} 
                      action 
                      onClick={() => handleParticipantClick(participant.userId)}
                      style={{ cursor: 'pointer' }}
                    >
                      <Row>
                        <Col>
                          <strong>{participant.firstName} {participant.lastName}</strong>
                        </Col>
                        <Col>
                          <strong>Email:</strong> {participant.email}
                        </Col>
                      </Row>
                      {expandedParticipantId === participant.userId && (
                        <>
                          <Row className="mt-2">
                            <Col>
                              <strong>Phone:</strong> {participant.phoneNumber}
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col>
                              <strong>Address:</strong> {participant.address}
                            </Col>
                          </Row>
                          <Row className="mt-2">
                            <Col>
                              <strong>Date of Birth:</strong> {new Date(participant.dateOfBirth).toLocaleDateString()}
                            </Col>
                          </Row>

                          <Row className="mt-4">
                            <Col>
                              <strong>Education:</strong>
                              {participant.education && participant.education.length > 0 ? (
                                <ListGroup variant="flush">
                                  {participant.education
                                    .filter(edu => edu.isPublic)
                                    .map((edu, eduIndex) => (
                                      <ListGroup.Item key={eduIndex}>
                                        <div><strong>Degree:</strong> {edu.degree}</div>
                                        <div><strong>Institution:</strong> {edu.institution}</div>
                                        <div><strong>Level:</strong> {edu.level}</div>
                                        <div><strong>Duration:</strong> {new Date(edu.startDate).toLocaleDateString()} - {new Date(edu.endDate).toLocaleDateString()}</div>
                                      </ListGroup.Item>
                                    ))}
                                </ListGroup>
                              ) : (
                                <p>No public education information available.</p>
                              )}
                            </Col>
                          </Row>

                          <Row className="mt-4">
                            <Col>
                              <strong>Job History:</strong>
                              {participant.jobs && participant.jobs.length > 0 ? (
                                <ListGroup variant="flush">
                                  {participant.jobs
                                    .filter(job => job.isPublic)
                                    .map((job, jobIndex) => (
                                      <ListGroup.Item key={jobIndex}>
                                        <div><strong>Position:</strong> {job.position}</div>
                                        <div><strong>Company:</strong> {job.company}</div>
                                        <div><strong>Industry:</strong> {job.industry}</div>
                                        <div><strong>Level:</strong> {job.level}</div>
                                        <div><strong>Duration:</strong> {new Date(job.startDate).toLocaleDateString()} - {new Date(job.endDate).toLocaleDateString()}</div>
                                      </ListGroup.Item>
                                    ))}
                                </ListGroup>
                              ) : (
                                <p>No public job history available.</p>
                              )}
                            </Col>
                          </Row>

                          <Row className="mt-4">
                            <Col>
                              <strong>Skills:</strong>
                              {participant.skills && participant.skills.length > 0 ? (
                                <ListGroup variant="flush">
                                  {participant.skills
                                    .filter(skill => skill.isPublic)
                                    .map((skill, skillIndex) => (
                                      <ListGroup.Item key={skillIndex}>
                                        <div><strong>Skill:</strong> {skill.skillName}</div>
                                        <div><strong>Proficiency:</strong> {skill.proficiency}</div>
                                      </ListGroup.Item>
                                    ))}
                                </ListGroup>
                              ) : (
                                <p>No public skills information available.</p>
                              )}
                            </Col>
                          </Row>

                          <Row className="mt-4">
                            <Col>
                              <Button 
                                variant="primary" 
                                onClick={() => handleSendMessage(participant.userId)}
                              >
                                Approve Participation
                              </Button>
                              <Button 
                                variant="secondary" 
                                onClick={() => handleDismiss(selectedJob.advertisementId, participant.userId)} 
                                className="ms-2"
                              >
                                Dismiss Participation
                              </Button>
                            </Col>
                          </Row>
                        </>
                      )}
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>Choose a advertisement first or No participants found for this advertisement.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Modal show={showSuccessModal} onHide={closeModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Message Sent</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {successMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={closeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserAdParticipants;
