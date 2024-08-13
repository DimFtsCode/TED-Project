import React, { useState,useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Tabs, Tab } from 'react-bootstrap'; // Εισαγωγή Tabs και Tab
import './EditUserModal.css';
import axios from 'axios';


const EditUserModal = ({ showEditModal, setShowEditModal, editUser, handleEditChange, handleSaveEditUser }) => {
    const [currentTab, setCurrentTab] = useState('basic');
    const [enums, setEnums] = useState({
        Degree: [],
        EducationLevel: [],
        JobIndustry: [],
        JobLevel: [],
        JobPosition: [],
        SkillCategory: []
    });

    useEffect(() => {
        const fetchEnums = async () => {
            try {
                const response = await axios.get('https://localhost:7176/api/enum/all-enums');
                setEnums(response.data);
                console.log('Enums fetched:', response.data);
            } catch (error) {
                console.error('Error fetching enums:', error);
            }
        };

        fetchEnums();
    }, []);

    const handleTabChange = (tab) => {
        setCurrentTab(tab);
    };

    return (
        <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered className="custom-modal">
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
                            {/* Education Tab */}
                                <Tab eventKey="education" title="Education">
                                    {editUser.education.map((edu, index) => (
                                        <div key={index}>
                                            <Form.Label>Degree</Form.Label>
                                            <Form.Control
                                                as="select"
                                                name={`education-${index}-degree`}
                                                value={enums.Degree[edu.degree]}  // Μετατροπή του αριθμού σε string
                                                onChange={(e) => {
                                                    const selectedIndex = enums.Degree.indexOf(e.target.value);
                                                    handleEditChange({
                                                        target: { name: `education-${index}-degree`, value: selectedIndex }
                                                    });
                                                }}
                                            >
                                                {enums.Degree.map((degree, i) => (
                                                    <option key={i} value={degree}>
                                                        {degree}
                                                    </option>
                                                ))}
                                            </Form.Control>
                                            <Form.Group>
                                                <Form.Label>Education Level</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name={`education-${index}-level`}
                                                    value={enums.EducationLevel[edu.level]}  // Μετατροπή του αριθμού σε string
                                                    onChange={(e) => {
                                                        const selectedIndex = enums.EducationLevel.indexOf(e.target.value);
                                                        handleEditChange({
                                                            target: { name: `education-${index}-level`, value: selectedIndex }
                                                        });
                                                    }}
                                                >
                                                    {enums.EducationLevel.map((level, i) => (
                                                        <option key={i} value={level}>
                                                            {level}
                                                        </option>
                                                    ))}
                                                </Form.Control>
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
                                </Tab>

                                {/* Jobs Tab */}
                                <Tab eventKey="jobs" title="Jobs">
                                    {editUser.jobs.map((job, index) => (
                                        <div key={index}>
                                            <Form.Group>
                                                <Form.Label>Position</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name={`jobs-${index}-position`}
                                                    value={enums.JobPosition[job.position]}  // Μετατροπή του αριθμού σε string
                                                    onChange={(e) => {
                                                        const selectedIndex = enums.JobPosition.indexOf(e.target.value);
                                                        handleEditChange({
                                                            target: { name: `jobs-${index}-position`, value: selectedIndex }
                                                        });
                                                    }}
                                                >
                                                    {enums.JobPosition.map((position, i) => (
                                                        <option key={i} value={position}>
                                                            {position}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>

                                            <Form.Group>
                                                <Form.Label>Industry</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name={`jobs-${index}-industry`}
                                                    value={enums.JobIndustry[job.industry]}  // Μετατροπή του αριθμού σε string
                                                    onChange={(e) => {
                                                        const selectedIndex = enums.JobIndustry.indexOf(e.target.value);
                                                        handleEditChange({
                                                            target: { name: `jobs-${index}-industry`, value: selectedIndex }
                                                        });
                                                    }}
                                                >
                                                    {enums.JobIndustry.map((industry, i) => (
                                                        <option key={i} value={industry}>
                                                            {industry}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group>
                                                <Form.Label>Job Level</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name={`jobs-${index}-level`}
                                                    value={enums.JobLevel[job.level]}  // Μετατροπή του αριθμού σε string
                                                    onChange={(e) => {
                                                        const selectedIndex = enums.JobLevel.indexOf(e.target.value);
                                                        handleEditChange({
                                                            target: { name: `jobs-${index}-level`, value: selectedIndex }
                                                        });
                                                    }}
                                                >
                                                    {enums.JobLevel.map((level, i) => (
                                                        <option key={i} value={level}>
                                                            {level}
                                                        </option>
                                                    ))}
                                                </Form.Control>
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

                                {/* Skills Tab */}
                                <Tab eventKey="skills" title="Skills">
                                    {editUser.skills.map((skill, index) => (
                                        <div key={index}>
                                            <Form.Group>
                                                <Form.Label>Skill Name</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    name={`skills-${index}-skillName`}
                                                    value={enums.SkillCategory[skill.skillName]}  // Μετατροπή του αριθμού σε string
                                                    onChange={(e) => {
                                                        const selectedIndex = enums.SkillCategory.indexOf(e.target.value);
                                                        handleEditChange({
                                                            target: { name: `skills-${index}-skillName`, value: selectedIndex }
                                                        });
                                                    }}
                                                >
                                                    {enums.SkillCategory.map((skillName, i) => (
                                                        <option key={i} value={skillName}>
                                                            {skillName}
                                                        </option>
                                                    ))}
                                                </Form.Control>
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
