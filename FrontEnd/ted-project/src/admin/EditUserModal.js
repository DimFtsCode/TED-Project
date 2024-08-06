import React, { useState } from 'react';
import { Modal, Form, Button, Row, Col, Tabs, Tab } from 'react-bootstrap'; // Εισαγωγή Tabs και Tab

const EditUserModal = ({ showEditModal, setShowEditModal, editUser, handleEditChange, handleSaveEditUser }) => {
    const [currentTab, setCurrentTab] = useState('basic');

    const handleTabChange = (tab) => {
        setCurrentTab(tab);
    };

    return (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Edit User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {editUser && (
                    <Form>
                        <Row className="mb-3 justify-content-center text-center">
                            <Col className="d-flex justify-content-center">
                                {editUser.photoData ? (
                                    <img src={`data:${editUser.photoMimeType};base64,${editUser.photoData}`} alt="User Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                                ) : (
                                    <div style={{ width: '100px', height: '100px', border: '1px solid #ddd', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                        <span>No Photo</span>
                                    </div>
                                )}
                            </Col>
                        </Row>

                        <Tabs activeKey={currentTab} onSelect={handleTabChange} className="mb-3">
                            <Tab eventKey="basic" title="Basic Info">
                                <Form.Group>
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="firstName"
                                        value={editUser.firstName}
                                        onChange={handleEditChange}
                                    />
                                    <Form.Check
                                        type="checkbox"
                                        label="Public"
                                        name="publicFields"
                                        value="FirstName"
                                        checked={editUser.publicFields.includes('FirstName')}
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
                                    <Form.Check
                                        type="checkbox"
                                        label="Public"
                                        name="publicFields"
                                        value="LastName"
                                        checked={editUser.publicFields.includes('LastName')}
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
                                    <Form.Check
                                        type="checkbox"
                                        label="Public"
                                        name="publicFields"
                                        value="Email"
                                        checked={editUser.publicFields.includes('Email')}
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
                                    <Form.Check
                                        type="checkbox"
                                        label="Public"
                                        name="publicFields"
                                        value="PhoneNumber"
                                        checked={editUser.publicFields.includes('PhoneNumber')}
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
                                    <Form.Check
                                        type="checkbox"
                                        label="Public"
                                        name="publicFields"
                                        value="Address"
                                        checked={editUser.publicFields.includes('Address')}
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
                            </Tab>
                            <Tab eventKey="details" title="Details">
                                {editUser.education.map((edu, index) => (
                                    <div key={index}>
                                        <Form.Group>
                                            <Form.Label>Degree</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name={`education-${index}-degree`}
                                                value={edu.degree}
                                                onChange={handleEditChange}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Institution</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name={`education-${index}-institution`}
                                                value={edu.institution}
                                                onChange={handleEditChange}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Start Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name={`education-${index}-startDate`}
                                                value={edu.startDate ? new Date(edu.startDate).toISOString().split('T')[0] : ''}
                                                onChange={handleEditChange}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>End Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name={`education-${index}-endDate`}
                                                value={edu.endDate ? new Date(edu.endDate).toISOString().split('T')[0] : ''}
                                                onChange={handleEditChange}
                                            />
                                        </Form.Group>
                                        <Form.Check
                                            type="checkbox"
                                            label="Public"
                                            name={`education-${index}-isPublic`}
                                            checked={edu.isPublic}
                                            onChange={(e) => handleEditChange({ target: { name: `education-${index}-isPublic`, value: e.target.checked } })}
                                        />
                                    </div>
                                ))}
                                {editUser.skills.map((skill, index) => (
                                    <div key={index}>
                                        <Form.Group>
                                            <Form.Label>Skill Name</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name={`skills-${index}-skillName`}
                                                value={skill.skillName}
                                                onChange={handleEditChange}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Proficiency</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name={`skills-${index}-proficiency`}
                                                value={skill.proficiency}
                                                onChange={handleEditChange}
                                            />
                                        </Form.Group>
                                        <Form.Check
                                            type="checkbox"
                                            label="Public"
                                            name={`skills-${index}-isPublic`}
                                            checked={skill.isPublic}
                                            onChange={(e) => handleEditChange({ target: { name: `skills-${index}-isPublic`, value: e.target.checked } })}
                                        />
                                    </div>
                                ))}
                                {editUser.jobs.map((job, index) => (
                                    <div key={index}>
                                        <Form.Group>
                                            <Form.Label>Position</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name={`jobs-${index}-position`}
                                                value={job.position}
                                                onChange={handleEditChange}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Company</Form.Label>
                                            <Form.Control
                                                type="text"
                                                name={`jobs-${index}-company`}
                                                value={job.company}
                                                onChange={handleEditChange}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>Start Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name={`jobs-${index}-startDate`}
                                                value={job.startDate ? new Date(job.startDate).toISOString().split('T')[0] : ''}
                                                onChange={handleEditChange}
                                            />
                                        </Form.Group>
                                        <Form.Group>
                                            <Form.Label>End Date</Form.Label>
                                            <Form.Control
                                                type="date"
                                                name={`jobs-${index}-endDate`}
                                                value={job.endDate ? new Date(job.endDate).toISOString().split('T')[0] : ''}
                                                onChange={handleEditChange}
                                            />
                                        </Form.Group>
                                        <Form.Check
                                            type="checkbox"
                                            label="Public"
                                            name={`jobs-${index}-isPublic`}
                                            checked={job.isPublic}
                                            onChange={(e) => handleEditChange({ target: { name: `jobs-${index}-isPublic`, value: e.target.checked } })}
                                        />
                                    </div>
                                ))}
                            </Tab>

                        </Tabs>
                        <Button variant="primary" onClick={handleSaveEditUser} className="mt-3">Save Changes</Button>
                    </Form>
                )}
            </Modal.Body>
        </Modal>
    );
};

export default EditUserModal;
