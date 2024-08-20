import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Nav, Button, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios'; // Για να κάνουμε τα αιτήματα στο backend
import { UserContext } from '../UserContext';

const UserJobs = () => {
  const [advertisements, setAdvertisements] = useState([]);
  const { user } = useContext(UserContext);
  const [enums, setEnums] = useState({ Degree: [], EducationLevel: [], JobIndustry: [], JobLevel: [], JobPosition: [], SkillCategory: [] });
  const [activeCardId, setActiveCardId] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [showModal, setShowModal] = useState(false);

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
    const fetchAdvertisements = async () => {
      try {
        // Πρώτη προσπάθεια - Ανάκτηση προτεινόμενων διαφημίσεων
        const response1 = await fetch(`https://localhost:7176/api/addvector/recommendations/${user.userId}`);
        if (!response1.ok) {
          throw new Error(`HTTP error! status: ${response1.status}`);
        }
        const data1 = await response1.json();
  
        if (data1 && data1.length > 0) {
          // Αν υπάρχουν προτεινόμενες διαφημίσεις, ταξινόμησέ τις
          const sortedAds = data1.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
          setAdvertisements(sortedAds);
        } else {
          // Αν δεν υπάρχουν προτεινόμενες διαφημίσεις, κάνε fallback στο δεύτερο endpoint
          throw new Error('No recommended ads available, fetching fallback ads.');
        }
      } catch (error) {
        console.error('Error fetching data or fallback:', error);
        // Είτε σε περίπτωση σφάλματος είτε αν δεν υπάρχουν προτεινόμενες διαφημίσεις, κάνε fallback στο δεύτερο endpoint
        try {
          const response2 = await axios.get(`https://localhost:7176/api/advertisement/filtered/${user.userId}`);
          const sortedAds = response2.data.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
          setAdvertisements(sortedAds);
        } catch (fallbackError) {
          console.error('Error fetching fallback advertisements:', fallbackError);
        }
      }
    };
  
    fetchAdvertisements();
  }, [user]);
  

  const getEnumString = (enumType, value) => {
    const enumMapping = enums[enumType];
    return enumMapping[value] || value;
  };

  const handleCardClick = async (advertisementId) => {
    console.log('handleCardClick called with advertisementId:', advertisementId);

    if (!advertisementId || !advertisements || advertisements.length === 0) {
      return;
    }

    console.log('Advertisements array:', advertisements);

    if (activeCardId === advertisementId) {
      setActiveCardId(null);
      return;
    }

    setActiveCardId(advertisementId);

    const selectedAd = advertisements.find(ad => ad.advertisementId.toString() === advertisementId);
    console.log('Selected advertisement:', selectedAd);

    if (selectedAd && !userDetails[selectedAd.userId]) {
      try {
        const response = await axios.get(`https://localhost:7176/api/users/${selectedAd.userId}`);
        console.log('Fetched user details:', response.data);
        setUserDetails(prevState => ({
          ...prevState,
          [selectedAd.userId]: response.data,
        }));
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }

    createUserVector(selectedAd);
  };

  const createUserVector =async (advertisement) => {
    const userVector = {
        advertisementId: advertisement.advertisementId,
        requiredDegree: advertisement.requiredDegree,
        requiredEducationLevel: advertisement.requiredEducationLevel,
        requiredPosition: advertisement.requiredPosition,
        requiredIndustry: advertisement.requiredIndustry,
        requiredJobLevel: advertisement.requiredJobLevel,
        requiredSkill: advertisement.requiredSkill,
        userId: user.userId,
    };

    console.log('User vector created:', userVector);

    try {
        const response = await axios.post('https://localhost:7176/api/addvector', userVector);
        console.log('Advertisement vector added successfully:', response.data);
    } catch (error) {
        console.error('Error adding advertisement vector:', error);
    }
    
  };

  const handleSendCV = async (advertisementId) => {
    try {
      await axios.post(`https://localhost:7176/api/advertisement/${advertisementId}/participant/${user.userId}`);
      console.log('Send CV clicked');
      setShowModal(true); // Εμφανίζει το modal όταν το CV σταλεί επιτυχώς
    } catch (error) {
      console.error('Error sending CV:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
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
        </Col>

        <Col xs={8} md={{ span: 6, offset: 1 }} style={{ padding: '20px', height: '800px', overflowY: 'auto' }}>
          <Card>
            <Card.Body>
              <Card.Title>Job Advertisements</Card.Title>
              <Card.Text>
                Below are the job advertisements sorted from newest to oldest:
              </Card.Text>

              {advertisements.length > 0 ? (
                advertisements.map(ad => (
                  <Card key={ad.advertisementId} className="mb-3">
                    <Card.Header onClick={() => handleCardClick(ad.advertisementId.toString())} style={{ cursor: 'pointer' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <span>{new Date(ad.postedDate).toLocaleDateString()}</span>
                        <span>{getEnumString('JobPosition', ad.requiredPosition)}</span>
                        <span>{getEnumString('JobLevel', ad.requiredJobLevel)}</span>
                        <span>{getEnumString('JobIndustry', ad.requiredIndustry)}</span>
                      </div>
                    </Card.Header>
                    {activeCardId === ad.advertisementId.toString() && (
                      <Card.Body>
                        <h5>{ad.title}</h5>
                        <p>{ad.description}</p>
                        <Row>
                          <Col xs={6} md={4}>
                            <p><strong>Posted on:</strong> {new Date(ad.postedDate).toLocaleDateString()}</p>
                          </Col>
                          <Col xs={6} md={4}>
                            <p><strong>Required Level:</strong> {getEnumString('JobLevel', ad.requiredJobLevel)}</p>
                          </Col>
                          <Col xs={6} md={4}>
                            <p><strong>Industry:</strong> {getEnumString('JobIndustry', ad.requiredIndustry)}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={6} md={4}>
                            <p><strong>Required Degree:</strong> {getEnumString('Degree', ad.requiredDegree)}</p>
                          </Col>
                          <Col xs={6} md={4}>
                            <p><strong>Required Education Level:</strong> {getEnumString('EducationLevel', ad.requiredEducationLevel)}</p>
                          </Col>
                          <Col xs={6} md={4}>
                            <p><strong>Minimum Years Experience:</strong> {ad.minimumYearsExperience}</p>
                          </Col>
                        </Row>
                        <Row>
                          <Col xs={6} md={4}>
                            <p><strong>Required Skill:</strong> {getEnumString('SkillCategory', ad.requiredSkill)}</p>
                          </Col>
                        </Row>
                        {userDetails[ad.userId] && (
                          <div>
                            <h5><strong>The advertise created by: </strong>{userDetails[ad.userId].firstName} {userDetails[ad.userId].lastName}</h5>
                            {userDetails[ad.userId].jobs.length > 0 && (
                              <>
                                <p><strong>Position:</strong> {getEnumString('JobPosition', userDetails[ad.userId].jobs[userDetails[ad.userId].jobs.length - 1].position)}</p>
                                <p><strong>Level:</strong> {getEnumString('JobLevel', userDetails[ad.userId].jobs[userDetails[ad.userId].jobs.length - 1].level)}</p>
                              </>
                            )}
                          </div>
                        )}
                        <div className="d-flex justify-content-end mt-3">
                          <Button variant="primary" onClick={() => handleSendCV(ad.advertisementId)}>Send CV</Button>
                        </div>
                      </Card.Body>
                    )}
                  </Card>
                ))
              ) : (
                <p>No advertisements found.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal για την επιβεβαίωση της αποστολής του CV */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>CV Sent</Modal.Title>
        </Modal.Header>
        <Modal.Body>Your CV has been successfully sent to the employer.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UserJobs;
