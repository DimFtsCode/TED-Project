import React from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';

const EditUserModal = ({ showEditModal, setShowEditModal, editUser, handleEditChange, handleSaveEditUser }) => {
    return (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {editUser && (
                    <Form>
                        <Row className="mb-3 text-center">
                            <Col>
                                {editUser.photoData ? (
                                    <img src={`data:${editUser.photoMimeType};base64,${editUser.photoData}`} alt="User Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                                ) : (
                                    <div style={{ width: '100px', height: '100px', border: '1px solid #ddd', borderRadius: '50%' }}></div>
                                )}
                            </Col>
                        </Row>
                        <Form.Group>
                            <Form.Label>First Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="firstName"
                                value={editUser.firstName}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Last Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="lastName"
                                value={editUser.lastName}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={editUser.email}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="phoneNumber"
                                value={editUser.phoneNumber}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Address</Form.Label>
                            <Form.Control
                                type="text"
                                name="address"
                                value={editUser.address}
                                onChange={handleEditChange}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Admin</Form.Label>
                            <Form.Check
                                type="checkbox"
                                name="admin"
                                checked={editUser.admin}
                                onChange={(e) => handleEditChange({ target: { name: 'admin', value: e.target.checked } })}
                            />
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Biography</Form.Label>
                            <Form.Control
                                as="textarea"
                                name="biography"
                                value={editUser.biography.join('\n')} // Join the array into a single string with new lines
                                onChange={handleEditChange}
                                rows={5} // Adjust the number of rows as needed
                            />
                        </Form.Group>
                        <Button variant="primary" onClick={handleSaveEditUser}>Save Changes</Button>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default EditUserModal;
