import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Card, Form, Nav, ListGroup, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';

const UserJobsView = () => {
  const { user } = useContext(UserContext); // Απόκτηση του χρήστη από το context
  const [jobs, setJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [enums, setEnums] = useState({ Degree: [], EducationLevel: [], JobIndustry: [], JobLevel: [], JobPosition: [], SkillCategory: [] });
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Modal για επιβεβαίωση διαγραφής


  useEffect(() => {
    // Fetch enum values
    const fetchEnums = async () => {
      try {
        const response = await axios.get('https://localhost:7176/api/enum/all-enums');
        setEnums(response.data);
      } catch (error) {
        console.error('Error fetching enums:', error);
      }
    };

    fetchEnums();
  }, []);

  useEffect(() => {
    // Fetch the list of jobs created by the user
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`https://localhost:7176/api/advertisement/user/${user.userId}`);
        setJobs(response.data); // Αποθηκεύουμε όλες τις αγγελίες του χρήστη
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    if (user && user.userId) {
      fetchJobs();
    }
  }, [user]);

  const handleJobClick = (id) => {
    // Βρίσκουμε την αγγελία που επιλέχθηκε από τις ήδη φορτωμένες αγγελίες
    const job = jobs.find(job => job.advertisementId === id);
    setSelectedJob(job);
    setIsEditing(false); // Reset editing mode
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleUpdateClick = async () => {
    try {
      await axios.put(`https://localhost:7176/api/advertisement/${selectedJob.advertisementId}`, selectedJob);
      setIsEditing(false);
      setShowSuccessModal(true); // Show success modal
    } catch (error) {
      console.error('Error updating advertisement:', error);
    }
  };


  const handleDeleteClick = async () => {
    try {
      await axios.delete(`https://localhost:7176/api/advertisement/${selectedJob.advertisementId}`, {
        params: { userId: user.userId }
      });
      setShowDeleteModal(false);
      setJobs(jobs.filter(job => job.advertisementId !== selectedJob.advertisementId));
      setSelectedJob(null);
    } catch (error) {
      console.error('Error deleting advertisement:', error);
    }
  };


  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Μετατροπή σε int όπου χρειάζεται
    let newValue = value;
    if (["requiredDegree", "requiredEducationLevel", "requiredPosition", "requiredIndustry", "requiredJobLevel", "requiredSkill"].includes(id)) {
      newValue = parseInt(value, 10);
    }

    setSelectedJob({ ...selectedJob, [id]: newValue });
  };

  const handleCancelEditClick = () => {
    setIsEditing(false);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const handleShowDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
  };

  return (
    <Container fluid style={{ height: '100vh' }}>
      <Row>
        
        {/* Side Menu */}
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

          {/* List of Jobs */}
          <ListGroup variant="flush" className="mt-4">
            {jobs.map(job => (
              <ListGroup.Item key={job.advertisementId} action onClick={() => handleJobClick(job.advertisementId)}>
                {job.title}
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>

        {/* Main Content */}
        <Col xs={12} md={{ span: 6, offset: 1 }} style={{ padding: '20px' }}>
          <Card>
            <Card.Body>
              <Card.Title>Your Job Advertisements</Card.Title>
              {selectedJob ? (
                <Form>
                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="title">
                        <Form.Label>Job Title</Form.Label>
                        <Form.Control 
                          type="text" 
                          value={selectedJob.title} 
                          readOnly={!isEditing} 
                          onChange={handleInputChange} 
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="description" className="mt-3">
                        <Form.Label>Job Description</Form.Label>
                        <Form.Control 
                          as="textarea" 
                          rows={3} 
                          value={selectedJob.description} 
                          readOnly={!isEditing} 
                          onChange={handleInputChange} 
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="requiredDegree" className="mt-3">
                        <Form.Label>Required Degree</Form.Label>
                        <Form.Control 
                          as="select" 
                          value={selectedJob.requiredDegree} 
                          disabled={!isEditing} 
                          onChange={handleInputChange} 
                        >
                          {enums.Degree.map((degree, index) => (
                            <option key={index} value={index}>{degree}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="requiredEducationLevel" className="mt-3">
                        <Form.Label>Required Education Level</Form.Label>
                        <Form.Control 
                          as="select" 
                          value={selectedJob.requiredEducationLevel} 
                          disabled={!isEditing} 
                          onChange={handleInputChange} 
                        >
                          {enums.EducationLevel.map((level, index) => (
                            <option key={index} value={index}>{level}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="requiredPosition" className="mt-3">
                        <Form.Label>Required Position</Form.Label>
                        <Form.Control 
                          as="select" 
                          value={selectedJob.requiredPosition} 
                          disabled={!isEditing} 
                          onChange={handleInputChange} 
                        >
                          {enums.JobPosition.map((position, index) => (
                            <option key={index} value={index}>{position}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="requiredIndustry" className="mt-3">
                        <Form.Label>Required Industry</Form.Label>
                        <Form.Control 
                          as="select" 
                          value={selectedJob.requiredIndustry} 
                          disabled={!isEditing} 
                          onChange={handleInputChange} 
                        >
                          {enums.JobIndustry.map((industry, index) => (
                            <option key={index} value={index}>{industry}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="requiredJobLevel" className="mt-3">
                        <Form.Label>Required Job Level</Form.Label>
                        <Form.Control 
                          as="select" 
                          value={selectedJob.requiredJobLevel} 
                          disabled={!isEditing} 
                          onChange={handleInputChange} 
                        >
                          {enums.JobLevel.map((level, index) => (
                            <option key={index} value={index}>{level}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group controlId="minimumYearsExperience" className="mt-3">
                        <Form.Label>Minimum Years of Experience</Form.Label>
                        <Form.Control 
                          type="number" 
                          value={selectedJob.minimumYearsExperience} 
                          readOnly={!isEditing} 
                          onChange={handleInputChange} 
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group controlId="requiredSkill" className="mt-3">
                        <Form.Label>Required Skill</Form.Label>
                        <Form.Control 
                          as="select" 
                          value={selectedJob.requiredSkill} 
                          disabled={!isEditing} 
                          onChange={handleInputChange} 
                        >
                          {enums.SkillCategory.map((skill, index) => (
                            <option key={index} value={index}>{skill}</option>
                          ))}
                        </Form.Control>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button 
                    variant="primary" 
                    className="mt-3" 
                    onClick={isEditing ? handleUpdateClick : handleEditClick}
                  >
                    {isEditing ? 'Update Advertisement' : 'Change Advertisement'}
                  </Button>
                  
                  {isEditing && (
                    <Button 
                      variant="secondary" 
                      className="mt-3 ms-2" 
                      onClick={handleCancelEditClick}
                    >
                      Back
                    </Button>
                  )}

                  {!isEditing && (
                    <Button 
                      variant="danger" 
                      className="mt-3 ms-2" 
                      onClick={handleShowDeleteModal}
                    >
                      Delete Advertisement
                    </Button>
                  )}
                </Form>
              ) : (
                <p>Select a job to view details</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Success</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ color: 'green' }}>
          The advertisement titled "{selectedJob?.title}" has been updated successfully!
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the advertisement titled "{selectedJob?.title}"?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteClick}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserJobsView;
