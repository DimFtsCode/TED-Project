import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert, InputGroup, Modal } from 'react-bootstrap';
import { UserContext } from '../UserContext'; // Προσθήκη του UserContext

const UserSettings = () => {
    const { user: currentUser } = useContext(UserContext); // Λήψη του τρέχοντος χρήστη από το context
    const navigate = useNavigate(); // Χρήση του useNavigate για πλοήγηση
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const extractErrorMessage = (error) => {
        let errorMessage = 'An error occurred. Please try again.';
        if (error.response && error.response.data) {
            if (typeof error.response.data === 'string') {
                errorMessage = error.response.data;
            } else if (error.response.data.errors) {
                errorMessage = Object.values(error.response.data.errors).flat().join(', ');
            } else if (error.response.data.message) {
                errorMessage = error.response.data.message;
            } else {
                errorMessage = JSON.stringify(error.response.data);
            }
        }
        return errorMessage;
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();

        if (!currentUser || !currentUser.userId) {
            setEmailError('User is not defined.');
            return;
        }

        try {
            await axios.put(`https://localhost:7176/api/usersettings/${currentUser.userId}/email`, { email });
            setShowSuccessModal(true);
            setEmailError(''); // Clear error on success
            navigate(`/user/${currentUser.userId}`); // Redirect to user page
        } catch (error) {
            console.error(error);
            const errorMessage = extractErrorMessage(error);
            setEmailError(errorMessage);
            if (errorMessage.includes('Email is already in use')) {
                setShowEmailModal(true);
            }
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match.');
            return;
        }

        if (!currentUser || !currentUser.userId) {
            setPasswordError('User is not defined.');
            return;
        }

        try {
            await axios.put(`https://localhost:7176/api/usersettings/${currentUser.userId}/password`, { password });
            setShowSuccessModal(true);
            setPasswordError(''); // Clear error on success
            navigate(`/user/${currentUser.userId}`); // Redirect to user page
        } catch (error) {
            console.error(error);
            const errorMessage = extractErrorMessage(error);
            setPasswordError(errorMessage);
        }
    };

    return (
        <Container className="mt-5">
            <Row>
                <Col md={6}>
                    <Card>
                        <Card.Header as="h3">Change Email</Card.Header>
                        <Card.Body>
                            {emailError && <Alert variant="danger">{String(emailError)}</Alert>}
                            <Form onSubmit={handleEmailSubmit}>
                                <Form.Group className="mb-3" controlId="formEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Save Email
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={6}>
                    <Card>
                        <Card.Header as="h3">Change Password</Card.Header>
                        <Card.Body>
                            {passwordError && <Alert variant="danger">{String(passwordError)}</Alert>}
                            <Form onSubmit={handlePasswordSubmit}>
                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showPassword ? "text" : "password"}
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                        />
                                        <Button variant="outline-secondary" onClick={() => setShowPassword(!showPassword)}>
                                            <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                        </Button>
                                    </InputGroup>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="formConfirmPassword">
                                    <Form.Label>Confirm Password</Form.Label>
                                    <InputGroup>
                                        <Form.Control
                                            type={showConfirmPassword ? "text" : "password"}
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            required
                                        />
                                        <Button variant="outline-secondary" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                        </Button>
                                    </InputGroup>
                                </Form.Group>
                                <Button variant="primary" type="submit">
                                    Save Password
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Success</Modal.Title>
                </Modal.Header>
                <Modal.Body>Your settings have been updated successfully!</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showEmailModal} onHide={() => setShowEmailModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Email in Use</Modal.Title>
                </Modal.Header>
                <Modal.Body>The email you entered is already in use. Please try a different email.</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowEmailModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserSettings;
