import React, {useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, Image, Button, Modal, Form } from 'react-bootstrap';
import { UserContext } from '../UserContext';

const UserNetworkProfile = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { user: currentUser } = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [enums, setEnums] = useState({
        Degree: [],
        EducationLevel: [],
        JobIndustry: [],
        JobLevel: [],
        JobPosition: [],
        SkillCategory: []
    });
    const [showChatModal, setShowChatModal] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchUser();
        fetchEnums();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`https://localhost:7176/api/users/${userId}`);
            console.log('User data:', response.data);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const fetchEnums = async () => {
        try {
            const response = await axios.get('https://localhost:7176/api/enum/all-enums');
            setEnums(response.data);
            console.log('Fetched Enums:', response.data);
        } catch (error) {
            console.error('Error fetching enums:', error);
        }
    };

    const handleChatClick = () => {
        setShowChatModal(true);
    };

    const handleCloseChatModal = () => {
        setShowChatModal(false);
    };

    const handleSendMessage = async () => {
        try {
            if (!currentUser || !currentUser.userId) {
                alert('User is not logged in');
                console.log('User is not logged in');
                return;
            }
    
            let discussionId = typeof currentDiscussionId !== 'undefined' ? currentDiscussionId : null;
            console.log('Existing Discussion ID:', discussionId);
    
            if (!discussionId) {
                const participantIds = [parseInt(currentUser.userId), parseInt(userId)];
                console.log('Creating discussion with participants:', participantIds);
        
                const response = await axios.post(`https://localhost:7176/api/discussions`, {
                    participants: participantIds
                });
        
                if (response.status === 201) {
                    discussionId = response.data.id;
                    console.log('Discussion created successfully. Discussion ID:', discussionId);
                } else {
                    console.error('Failed to create discussion. Status:', response.status);
                    alert('Failed to create discussion. Please try again.');
                    return;
                }
            }
            if (!discussionId) {
                alert('Failed to create or retrieve discussion.');
                return;
            }
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

    const handleBackClick = () => {
        navigate('/user/network');
    };

    if (!user) return <div>Loading...</div>;

    const publicFields = user.publicFields || [];

    const publicInfo = {
        firstName: publicFields.includes('FirstName') ? user.firstName : 'Private',
        lastName: publicFields.includes('LastName') ? user.lastName : 'Private',
        email: publicFields.includes('Email') ? user.email : 'Private',
        phoneNumber: publicFields.includes('PhoneNumber') ? user.phoneNumber : 'Private',
        address: publicFields.includes('Address') ? user.address : 'Private',
        education: (user.education || []).filter(edu => edu.isPublic),
        jobs: (user.jobs || []).filter(job => job.isPublic),
        skills: (user.skills || []).filter(skill => skill.isPublic)
    };

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Header className="text-center">
                            {user.photoData ? (
                                <Image 
                                    src={`data:${user.photoMimeType};base64,${user.photoData}`} 
                                    roundedCircle 
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                                    className="mb-3"
                                />
                            ) : (
                                <Image 
                                    src="https://via.placeholder.com/150" 
                                    roundedCircle 
                                    style={{ width: '150px', height: '150px', objectFit: 'cover' }} 
                                    className="mb-3"
                                />
                            )}
                            <h2>{publicInfo.firstName} {publicInfo.lastName}'s Profile</h2>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item><strong>Name:</strong> {publicInfo.firstName} </ListGroup.Item>
                                <ListGroup.Item><strong>Lastname:</strong> {publicInfo.lastName}</ListGroup.Item>
                                <ListGroup.Item><strong>Email:</strong> {publicInfo.email}</ListGroup.Item>
                                <ListGroup.Item><strong>Phone Number:</strong> {publicInfo.phoneNumber}</ListGroup.Item>
                                <ListGroup.Item><strong>Address:</strong> {publicInfo.address}</ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Education:</strong>
                                    {publicInfo.education.length > 0 ? (
                                        <ul>
                                            {publicInfo.education.map((edu, index) => (
                                                <li key={index}>
                                                    {`${enums.Degree[edu.degree] || edu.degree}, ${enums.EducationLevel[edu.level] || edu.level}, ${edu.institution} (${new Date(edu.startDate).toLocaleDateString()} - ${new Date(edu.endDate).toLocaleDateString()})`}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No public education details provided.</p>
                                    )}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Jobs:</strong>
                                    {publicInfo.jobs.length > 0 ? (
                                        <ul>
                                            {publicInfo.jobs.map((job, index) => (
                                                <li key={index}>
                                                    {`${enums.JobPosition[job.position] || job.position}, ${enums.JobIndustry[job.industry] || job.industry}, ${enums.JobLevel[job.level] || job.level}, ${job.company} (${new Date(job.startDate).toLocaleDateString()} - ${new Date(job.endDate).toLocaleDateString()})`}
                                                </li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No public job details provided.</p>
                                    )}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Skills:</strong>
                                    {publicInfo.skills.length > 0 ? (
                                        <ul>
                                            {publicInfo.skills.map((skill, index) => (
                                                <li key={index}>{`${enums.SkillCategory[skill.skillName] || skill.skillName}, ${skill.proficiency}`}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No public skill details provided.</p>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                            <Row className="mt-3">
                                <Col className="text-center">
                                    <Button 
                                        variant="primary" 
                                        onClick={handleChatClick} 
                                    >
                                        Chat
                                    </Button>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Row className="mt-3">
                <Col className="text-center">
                    <Button 
                        variant="secondary" 
                        onClick={handleBackClick} 
                    >
                        Back
                    </Button>
                </Col>
            </Row>

            {/* Chat Modal */}
            <Modal show={showChatModal} onHide={handleCloseChatModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Send Message to {publicInfo.firstName}</Modal.Title>
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

export default UserNetworkProfile;
