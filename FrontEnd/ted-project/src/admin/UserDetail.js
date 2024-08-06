import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, Modal, Button } from 'react-bootstrap';
import { UserContext } from '../UserContext';
import useIdleTimer from '../hooks/useIdleTimer';

const UserDetail = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const { logout } = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useIdleTimer(() => {
        setShowModal(true);
        setTimeout(() => {
            logout();
            navigate('/');
        }, 5000); // 5 δευτερόλεπτα
    }, 300000); // 5 λεπτά

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`https://localhost:7176/api/users/${userId}`);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    if (!user) return <div>Loading...</div>;

    return (
        <Container className="mt-5">
            <Row className="justify-content-center">
                <Col md={8}>
                    <Card>
                        <Card.Header>
                            <h2>User Details</h2>
                        </Card.Header>
                        <Card.Body>
                            <ListGroup variant="flush">
                                <ListGroup.Item><strong>Name:</strong> {user.firstName} {user.lastName}</ListGroup.Item>
                                <ListGroup.Item><strong>Email:</strong> {user.email}</ListGroup.Item>
                                <ListGroup.Item><strong>Phone Number:</strong> {user.phoneNumber || 'Not Provided'}</ListGroup.Item>
                                <ListGroup.Item><strong>Address:</strong> {user.address || 'Not Provided'}</ListGroup.Item>
                                <ListGroup.Item><strong>Password:</strong> {user.password}</ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Education:</strong>
                                    {user.education && user.education.length > 0 ? (
                                        <ul>
                                            {user.education.map((item, index) => (
                                                <li key={index}>{item.degree}, {item.institution} ({item.startDate} - {item.endDate})</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No education details provided.</p>
                                    )}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Jobs:</strong>
                                    {user.jobs && user.jobs.length > 0 ? (
                                        <ul>
                                            {user.jobs.map((item, index) => (
                                                <li key={index}>{item.position}, {item.company} ({item.startDate} - {item.endDate})</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No job details provided.</p>
                                    )}
                                </ListGroup.Item>
                                <ListGroup.Item>
                                    <strong>Skills:</strong>
                                    {user.skills && user.skills.length > 0 ? (
                                        <ul>
                                            {user.skills.map((item, index) => (
                                                <li key={index}>{item.skillName} ({item.proficiency})</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <p>No skill details provided.</p>
                                    )}
                                </ListGroup.Item>
                            </ListGroup>
                        </Card.Body>
                    </Card>
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

export default UserDetail;
