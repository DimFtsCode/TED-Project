import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Form, Button, Card, ListGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../UserContext';
import './User.css';

const UserProfile = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useContext(UserContext);
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    dateOfBirth: '',
    biography: '',
    photo: null,
    photoData: '',
    photoMimeType: '',
    publicFields: [],
    education: [],
    jobs: [],
    skills: []
  });

  useEffect(() => {
    if (currentUser) {
      fetchUserProfile();
    }
  }, [currentUser]);

  const fetchUserProfile = async () => {
    try {
        const response = await axios.get(`https://localhost:7176/api/users/${currentUser.userId}`);
        setProfile({
            ...response.data,
            publicFields: response.data.publicFields || [],
            education: response.data.education.map(edu => ({
                ...edu,
                startDate: edu.startDate ? edu.startDate.split('T')[0] : '',
                endDate: edu.endDate ? edu.endDate.split('T')[0] : ''
            })),
            jobs: response.data.jobs.map(job => ({
                ...job,
                startDate: job.startDate ? job.startDate.split('T')[0] : '',
                endDate: job.endDate ? job.endDate.split('T')[0] : ''
            })),
            skills: response.data.skills || []
        });
    } catch (error) {
        console.error('Error fetching user profile:', error);
    }
};


  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleCheckboxChange = (e) => {
    const { name } = e.target;
    setProfile((prevState) => {
      const newPublicFields = prevState.publicFields.includes(name)
        ? prevState.publicFields.filter((field) => field !== name)
        : [...prevState.publicFields, name];
      return { ...prevState, publicFields: newPublicFields };
    });
  };

  const handleFileChange = (e) => {
    setProfile({ ...profile, photo: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Δημιουργία του αντικειμένου για τα δεδομένα του χρήστη
    const userBioRequest = {
        userId: currentUser.userId,
        educations: profile.education,
        jobs: profile.jobs,
        skills: profile.skills
    };

    try {
        const response = await axios.post('https://localhost:7176/api/userbio/update-bio', userBioRequest, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        alert('Profile updated successfully!');
        navigate('/user');
    } catch (error) {
        console.error('Error updating profile:', error);
        alert('Error updating profile.');
    }
  };




  const handleAddEducation = () => {
    setProfile({
      ...profile,
      education: [
        ...profile.education,
        { degree: '', institution: '', startDate: '', endDate: '', isPublic: false }
      ]
    });
  };

  const handleAddJob = () => {
    setProfile({
      ...profile,
      jobs: [
        ...profile.jobs,
        { position: '', company: '', startDate: '', endDate: '', isPublic: false }
      ]
    });
  };

  const handleAddSkill = () => {
    setProfile({
      ...profile,
      skills: [
        ...profile.skills,
        { skillName: '', proficiency: '', isPublic: false }
      ]
    });
  };

  const handleEducationChange = (index, field, value) => {
    const newEducation = [...profile.education];
    newEducation[index][field] = value;
    setProfile({ ...profile, education: newEducation });
  };

  const handleJobChange = (index, field, value) => {
    const newJobs = [...profile.jobs];
    newJobs[index][field] = value;
    setProfile({ ...profile, jobs: newJobs });
  };

  const handleSkillChange = (index, field, value) => {
    const newSkills = [...profile.skills];
    newSkills[index][field] = value;
    setProfile({ ...profile, skills: newSkills });
  };

  const handleRemoveEducation = (index) => {
    const newEducation = [...profile.education];
    newEducation.splice(index, 1);
    setProfile({ ...profile, education: newEducation });
  };

  const handleRemoveJob = (index) => {
    const newJobs = [...profile.jobs];
    newJobs.splice(index, 1);
    setProfile({ ...profile, jobs: newJobs });
  };

  const handleRemoveSkill = (index) => {
    const newSkills = [...profile.skills];
    newSkills.splice(index, 1);
    setProfile({ ...profile, skills: newSkills });
  };

  const handleBasicInfoSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('userId', currentUser.userId);
    formData.append('phoneNumber', profile.phoneNumber);
    formData.append('address', profile.address);

    if (profile.photo) {
        formData.append('photo', profile.photo);
    }

    try {
        const response = await axios.post('https://localhost:7176/api/UserBasicInfo/update-basic-info', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        alert('Basic info updated successfully!');
        navigate('/user');
    } catch (error) {
        console.error('Error updating basic info:', error);
        alert('Error updating basic info.');
    }
  };


  return (
    <Container fluid>
        <Row>
            <Col md={2} className="bg-light sidebar">
                <Nav className="flex-column">
                    <Nav.Link as={Link} to="/user/profile" className="nav-link-custom">
                        <FontAwesomeIcon icon={faUser} className="me-2" />
                        Profile
                    </Nav.Link>
                    <Nav.Link as={Link} to="/user/network" className="nav-link-custom">
                        <FontAwesomeIcon icon={faNetworkWired} className="me-2" />
                        Network
                    </Nav.Link>
                </Nav>
            </Col>
            <Col md={10}>
                <h2>User Profile</h2>

                {/* Container for Photo, Phone Number, and Address */}
                <Container className="mb-4">
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                        {profile.photoData ? (
                            <img src={`data:${profile.photoMimeType};base64,${profile.photoData}`} alt="User Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
                        ) : (
                            <div style={{ width: '100px', height: '100px', border: '1px solid #ddd', borderRadius: '50%' }}></div>
                        )}
                        <h3>{profile.firstName} {profile.lastName}</h3>
                        <Form.Group controlId="formPhoto" className="mt-3">
                            <Form.Label>Change Photo</Form.Label>
                            <Form.Control type="file" name="photo" onChange={handleFileChange} />
                        </Form.Group>
                        <Form.Group controlId="formPhoneNumber" className="mt-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} />
                        </Form.Group>
                        <Form.Group controlId="formAddress" className="mt-3">
                            <Form.Label>Address</Form.Label>
                            <Form.Control type="text" name="address" value={profile.address} onChange={handleChange} />
                        </Form.Group>
                        <Button variant="primary" onClick={handleBasicInfoSubmit} className="mt-3">Update Basic Info</Button>
                    </div>
                </Container>

                {/* Container for Education, Jobs, and Skills */}
                <Container>
                    <Form onSubmit={handleSubmit}>
                        <ListGroup className="mb-3">
                            <ListGroup.Item>
                                <h4>Education</h4>
                                {profile.education.map((edu, index) => (
                                    <div key={index}>
                                        <Form.Group controlId={`formEducationDegree${index}`}>
                                            <Form.Label>Degree</Form.Label>
                                            <Form.Control type="text" name="degree" value={edu.degree} onChange={(e) => handleEducationChange(index, 'degree', e.target.value)} />
                                            <Form.Check type="checkbox" label="Public" name="isPublic" onChange={(e) => handleEducationChange(index, 'isPublic', e.target.checked)} checked={edu.isPublic} />
                                        </Form.Group>
                                        <Form.Group controlId={`formEducationInstitution${index}`}>
                                            <Form.Label>Institution</Form.Label>
                                            <Form.Control type="text" name="institution" value={edu.institution} onChange={(e) => handleEducationChange(index, 'institution', e.target.value)} />
                                        </Form.Group>
                                        <Form.Group controlId={`formEducationStartDate${index}`}>
                                            <Form.Label>Start Date</Form.Label>
                                            <Form.Control type="date" name="startDate" value={edu.startDate} onChange={(e) => handleEducationChange(index, 'startDate', e.target.value)} />
                                        </Form.Group>
                                        <Form.Group controlId={`formEducationEndDate${index}`}>
                                            <Form.Label>End Date</Form.Label>
                                            <Form.Control type="date" name="endDate" value={edu.endDate} onChange={(e) => handleEducationChange(index, 'endDate', e.target.value)} />
                                        </Form.Group>
                                        <Button variant="danger" onClick={() => handleRemoveEducation(index)}>Remove</Button>
                                    </div>
                                ))}
                                <Button variant="primary" onClick={handleAddEducation}>Add Education</Button>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h4>Jobs</h4>
                                {profile.jobs.map((job, index) => (
                                    <div key={index}>
                                        <Form.Group controlId={`formJobPosition${index}`}>
                                            <Form.Label>Position</Form.Label>
                                            <Form.Control type="text" name="position" value={job.position} onChange={(e) => handleJobChange(index, 'position', e.target.value)} />
                                        </Form.Group>
                                        <Form.Group controlId={`formJobCompany${index}`}>
                                            <Form.Label>Company</Form.Label>
                                            <Form.Control type="text" name="company" value={job.company} onChange={(e) => handleJobChange(index, 'company', e.target.value)} />
                                        </Form.Group>
                                        <Form.Group controlId={`formJobStartDate${index}`}>
                                            <Form.Label>Start Date</Form.Label>
                                            <Form.Control type="date" name="startDate" value={job.startDate} onChange={(e) => handleJobChange(index, 'startDate', e.target.value)} />
                                        </Form.Group>
                                        <Form.Group controlId={`formJobEndDate${index}`}>
                                            <Form.Label>End Date</Form.Label>
                                            <Form.Control type="date" name="endDate" value={job.endDate} onChange={(e) => handleJobChange(index, 'endDate', e.target.value)} />
                                        </Form.Group>
                                        <Form.Check type="checkbox" label="Public" name="isPublic" onChange={(e) => handleJobChange(index, 'isPublic', e.target.checked)} checked={job.isPublic} />
                                        <Button variant="danger" onClick={() => handleRemoveJob(index)}>Remove</Button>
                                    </div>
                                ))}
                                <Button variant="primary" onClick={handleAddJob}>Add Job</Button>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <h4>Skills</h4>
                                {profile.skills.map((skill, index) => (
                                    <div key={index}>
                                        <Form.Group controlId={`formSkillName${index}`}>
                                            <Form.Label>Skill Name</Form.Label>
                                            <Form.Control type="text" name="skillName" value={skill.skillName} onChange={(e) => handleSkillChange(index, 'skillName', e.target.value)} />
                                        </Form.Group>
                                        <Form.Group controlId={`formSkillProficiency${index}`}>
                                            <Form.Label>Proficiency</Form.Label>
                                            <Form.Control type="text" name="proficiency" value={skill.proficiency} onChange={(e) => handleSkillChange(index, 'proficiency', e.target.value)} />
                                        </Form.Group>
                                        <Form.Check type="checkbox" label="Public" name="isPublic" onChange={(e) => handleSkillChange(index, 'isPublic', e.target.checked)} checked={skill.isPublic} />
                                        <Button variant="danger" onClick={() => handleRemoveSkill(index)}>Remove</Button>
                                    </div>
                                ))}
                                <Button variant="primary" onClick={handleAddSkill}>Add Skill</Button>
                            </ListGroup.Item>
                        </ListGroup>
                        <Button variant="primary" type="submit">Update Education, Jobs, and Skills</Button>
                    </Form>
                </Container>
            </Col>
        </Row>
    </Container>
  );

};

export default UserProfile;
