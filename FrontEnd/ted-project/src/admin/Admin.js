import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import useIdleTimer from '../hooks/useIdleTimer';
import { Table, Button, Modal, Form, Container, Row, Col } from 'react-bootstrap';

const Admin = () => {
    const navigate = useNavigate();
    const { logout } = useContext(UserContext);
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectAll, setSelectAll] = useState(false);

    useIdleTimer(() => {
        setShowModal(true);
        setTimeout(() => {
            logout();
            navigate('/');
        }, 5000); // 5 δευτερόλεπτα
    }, 300000); // 5 λεπτά

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://localhost:7176/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers(prevState => 
            prevState.includes(userId) 
                ? prevState.filter(id => id !== userId) 
                : [...prevState, userId]
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedUsers([]);
        } else {
            const allUserIds = users.map(user => user.userId);
            setSelectedUsers(allUserIds);
        }
        setSelectAll(!selectAll);
    };

    const exportData = async (format) => {
        try {
            const response = await axios.post(`https://localhost:7176/api/users/export?format=${format}`, selectedUsers, {
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'blob' // Ensure the response is treated as a binary blob
            });
            const blob = new Blob([response.data], { type: format === 'json' ? 'application/json' : 'application/xml' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `users.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    }

    const handleCloseModal = () => {
        setShowModal(false);
    };

    return (
        <Container>
            <Row className="my-4">
                <Col>
                    <h1>Admin Page</h1>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>
                                    <Form.Check 
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={handleSelectAll}
                                    />
                                </th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.userId}>
                                    <td>
                                        <Form.Check
                                            type="checkbox"
                                            checked={selectedUsers.includes(user.userId)}
                                            onChange={() => handleSelectUser(user.userId)}
                                        />
                                    </td>
                                    <td>{user.firstName} {user.lastName}</td>
                                    <td>{user.email}</td>
                                    <td>
                                        <Link to={`/user/${user.userId}`} className="btn btn-info">View</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Col>
            </Row>
            <Row className="my-3">
                <Col>
                    <Button variant="primary" onClick={() => exportData('json')}>Export JSON</Button>
                    <Button variant="secondary" onClick={() => exportData('xml')} className="ms-2">Export XML</Button>
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

export default Admin;
