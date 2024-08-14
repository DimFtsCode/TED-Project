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
  const [selectedForm, setSelectedForm] = useState('education');
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
  const [enums, setEnums] = useState({
    Degree: [],
    EducationLevel: [],
    JobIndustry: [],
    JobLevel: [],
    JobPosition: [],
    SkillCategory: []
  });

  const [newEducation, setNewEducation] = useState({ degree: '', level: '', institution: '', startDate: '', endDate: '', isPublic: false });
  const [newJob, setNewJob] = useState({ position: '', industry: '', level: '', company: '', startDate: '', endDate: '', isPublic: false });
  const [newSkill, setNewSkill] = useState({ skillName: '', proficiency: '', isPublic: false });

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
    if (!newEducation.degree || !newEducation.level || !newEducation.institution || !newEducation.startDate) {
        alert('Please fill in all required (*) fields.');
        return;
    }
    setProfile(prevProfile => ({
      ...prevProfile,
      education: [...prevProfile.education, newEducation]
    }));
    // Καθαρισμός της φόρμας μετά την προσθήκη
    setNewEducation({ degree: '', level: '', institution: '', startDate: '', endDate: '', isPublic: false });
  };
  
  const handleAddJob = () => {
    if (!newJob.position || !newJob.industry || !newJob.level || !newJob.company || !newJob.startDate) {
        alert('Please fill in all required (*) fields.');
        return;
    }
    setProfile(prevProfile => ({
      ...prevProfile,
      jobs: [...prevProfile.jobs, newJob]
    }));
    // Καθαρισμός της φόρμας μετά την προσθήκη
    setNewJob({ position: '', industry: '', level: '', company: '', startDate: '', endDate: '', isPublic: false });
  };
  

  const handleAddSkill = () => {
    if (!newSkill.skillName || !newSkill.proficiency) {
        alert('Please fill in all required (*) fields.');
        return;
    }
    setProfile(prevProfile => ({
      ...prevProfile,
      skills: [...prevProfile.skills, newSkill]
    }));
    // Καθαρισμός της φόρμας μετά την προσθήκη
    setNewSkill({ skillName: '', proficiency: '', isPublic: false });
  };


  const handleEducationChange = (field, value) => {
    setNewEducation({ ...newEducation, [field]: value });
  };

  const handleJobChange = (field, value) => {
    setNewJob({ ...newJob, [field]: value });
  };

  const handleSkillChange = (field, value) => {
    setNewSkill({ ...newSkill, [field]: value });
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

 

  const handleDeleteEducation = (index) => {
    const newEducation = [...profile.education];
    newEducation.splice(index, 1);
    setProfile({ ...profile, education: newEducation });
  };

 
  const handleDeleteJob = (index) => {
    const newJobs = [...profile.jobs];
    newJobs.splice(index, 1);
    setProfile({ ...profile, jobs: newJobs });
  };


  const handleDeleteSkill = (index) => {
    const newSkills = [...profile.skills];
    newSkills.splice(index, 1);
    setProfile({ ...profile, skills: newSkills });
  };

  const handleFormSelection = (e) => {
    setSelectedForm(e.target.value);
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
        </Row>    
        
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
            {/* Education, Jobs, and Skills List */}
            <Container className="mt-4">
                <h4>Biography List</h4>

                {/* Education List */}
                <h5>Education</h5>
                <ul className="list-group mb-3">
                    {profile.education.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                            <strong>Education {index + 1}:</strong>
                            {` ${enums.Degree[item.degree] || item.degree}, ${enums.EducationLevel[item.level] || item.level}, ${item.institution}, ${item.startDate} - ${item.endDate}`}
                            {item.isPublic && <span className="badge bg-primary ms-2">Public</span>}
                        </span>
                        <span>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteEducation(index)}>Delete</button>
                        </span>
                        </li>
                    ))}
                    </ul>

                    <h5>Jobs</h5>
                    <ul className="list-group mb-3">
                    {profile.jobs.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        <span>
                            <strong>Job {index + 1}:</strong>
                            {` ${enums.JobPosition[item.position] || item.position}, ${enums.JobIndustry[item.industry] || item.industry}, ${enums.JobLevel[item.level] || item.level}, ${item.company}, ${item.startDate} - ${item.endDate}`}
                            {item.isPublic && <span className="badge bg-primary ms-2">Public</span>}
                        </span>
                        <span>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDeleteJob(index)}>Delete</button>
                        </span>
                        </li>
                    ))}
                    </ul>
                {/* Skills List */}
                <h5>Skills</h5>
                <ul className="list-group mb-3">
                    {profile.skills.map((item, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                            <span>
                                <strong>Skill {index + 1}:</strong>
                                {` ${enums.SkillCategory[item.skillName] || item.skillName}, ${item.proficiency}`}
                                {item.isPublic && <span className="badge bg-primary ms-2">Public</span>}
                            </span>
                            <span>
                                <button className="btn btn-sm btn-danger" onClick={() => handleDeleteSkill(index)}>Delete</button>
                            </span>
                        </li>
                    ))}
                </ul>
            </Container>
        
            {/* Container for Education, Jobs, and Skills */}
            <Container className="mt-4">
                <h2>User Profile</h2>

                {/* Επιλογή Φόρμας */}
                <Form.Group controlId="formSelection">
                    <Form.Label>Select Form to Add</Form.Label>
                    <Form.Select value={selectedForm} onChange={handleFormSelection}>
                        <option value="education">Education</option>
                        <option value="job">Job</option>
                        <option value="skill">Skill</option>
                    </Form.Select>
                </Form.Group>

                {/* Προσθήκη μόνο της επιλεγμένης φόρμας */}
                <Form onSubmit={handleSubmit}>
                    <ListGroup className="mb-3">
                        {selectedForm === 'education' && (
                            <ListGroup.Item>
                                <h4>Add Education</h4>
                                <Form.Group controlId="formEducationDegreeNew">
                                    <Form.Label>Degree*</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="degree"
                                        value={newEducation.degree}
                                        onChange={(e) => handleEducationChange('degree', e.target.value)}
                                    >
                                        <option value="" disabled hidden>Select Degree</option> {/* Default empty disabled option */}
                                        {enums.Degree.map((degree, i) => (
                                            <option key={i} value={degree}>
                                                {degree}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formEducationLevelNew">
                                    <Form.Label>Level*</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="level"
                                        value={newEducation.level}
                                        onChange={(e) => handleEducationChange('level', e.target.value)}
                                    >
                                        <option value="" disabled hidden>Select Level</option> {/* Default empty disabled option */}
                                        {enums.EducationLevel.map((level, i) => (
                                            <option key={i} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formEducationInstitutionNew">
                                    <Form.Label>Institution*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="institution"
                                        value={newEducation.institution}
                                        onChange={(e) => handleEducationChange('institution', e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEducationStartDateNew">
                                    <Form.Label>Start Date*</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        value={newEducation.startDate}
                                        onChange={(e) => handleEducationChange('startDate', e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formEducationEndDateNew">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        value={newEducation.endDate}
                                        onChange={(e) => handleEducationChange('endDate', e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Check
                                    type="checkbox"
                                    label="Public"
                                    name="isPublic"
                                    checked={newEducation.isPublic}
                                    onChange={(e) => handleEducationChange('isPublic', e.target.checked)}
                                />
                                <Button variant="primary" onClick={handleAddEducation}>Add Education</Button>
                            </ListGroup.Item>
                        )}
                        
                        {selectedForm === 'job' && (
                            <ListGroup.Item>
                                <h4>Add Job</h4>
                                <Form.Group controlId="formJobPositionNew">
                                    <Form.Label>Position*</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="position"
                                        value={newJob.position}
                                        onChange={(e) => handleJobChange('position', e.target.value)}
                                    >
                                        <option value="" disabled hidden>Select Position</option>
                                        {enums.JobPosition.map((position, i) => (
                                            <option key={i} value={position}>
                                                {position}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formJobIndustryNew">
                                    <Form.Label>Industry*</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="industry"
                                        value={newJob.industry}
                                        onChange={(e) => handleJobChange('industry', e.target.value)}
                                    >
                                        <option value="" disabled hidden>Select Industry</option>
                                        {enums.JobIndustry.map((industry, i) => (
                                            <option key={i} value={industry}>
                                                {industry}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formJobLevelNew">
                                    <Form.Label>Job Level*</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="level"
                                        value={newJob.level}
                                        onChange={(e) => handleJobChange('level', e.target.value)}
                                    >
                                        <option value="" disabled hidden>Select Level</option>
                                        {enums.JobLevel.map((level, i) => (
                                            <option key={i} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formJobCompanyNew">
                                    <Form.Label>Company*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="company"
                                        value={newJob.company}
                                        onChange={(e) => handleJobChange('company', e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formJobStartDateNew">
                                    <Form.Label>Start Date*</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="startDate"
                                        value={newJob.startDate}
                                        onChange={(e) => handleJobChange('startDate', e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Group controlId="formJobEndDateNew">
                                    <Form.Label>End Date</Form.Label>
                                    <Form.Control
                                        type="date"
                                        name="endDate"
                                        value={newJob.endDate}
                                        onChange={(e) => handleJobChange('endDate', e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Check
                                    type="checkbox"
                                    label="Public"
                                    name="isPublic"
                                    checked={newJob.isPublic}
                                    onChange={(e) => handleJobChange('isPublic', e.target.checked)}
                                />
                                <Button variant="primary" onClick={handleAddJob}>Add Job</Button>
                            </ListGroup.Item>
                        )}
                        
                        {selectedForm === 'skill' && (
                            <ListGroup.Item>
                                <h4>Add Skill</h4>
                                <Form.Group controlId="formSkillNameNew">
                                    <Form.Label>Skill Name*</Form.Label>
                                    <Form.Control
                                        as="select"
                                        name="skillName"
                                        value={newSkill.skillName}
                                        onChange={(e) => handleSkillChange('skillName', e.target.value)}
                                    >
                                        <option value="" disabled hidden>Select Skill</option>
                                        {enums.SkillCategory.map((skillName, i) => (
                                            <option key={i} value={skillName}>
                                                {skillName}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formSkillProficiencyNew">
                                    <Form.Label>Proficiency*</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="proficiency"
                                        value={newSkill.proficiency}
                                        onChange={(e) => handleSkillChange('proficiency', e.target.value)}
                                    />
                                </Form.Group>
                                <Form.Check
                                    type="checkbox"
                                    label="Public"
                                    name="isPublic"
                                    checked={newSkill.isPublic}
                                    onChange={(e) => handleSkillChange('isPublic', e.target.checked)}
                                />
                                <Button variant="primary" onClick={handleAddSkill}>Add Skill</Button>
                            </ListGroup.Item>
                        )}
                    </ListGroup>
                    <Button variant="primary" type="submit">Update Education, Jobs, and Skills</Button>
                </Form>

        </Container>
    </Container>
  );

};

export default UserProfile;
