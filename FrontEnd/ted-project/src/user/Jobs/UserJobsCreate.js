import React, { useState, useContext, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Nav, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../../UserContext';

const UserJobsCreate = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const [enums, setEnums] = useState({ Degree: [], EducationLevel: [], JobIndustry: [], JobLevel: [], JobPosition: [], SkillCategory: [] });
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requiredDegree, setRequiredDegree] = useState('');
  const [requiredEducationLevel, setRequiredEducationLevel] = useState('');
  const [requiredPosition, setRequiredPosition] = useState('');
  const [requiredIndustry, setRequiredIndustry] = useState('');
  const [requiredJobLevel, setRequiredJobLevel] = useState('');
  const [minimumYearsExperience, setMinimumYearsExperience] = useState('');
  const [requiredSkill, setRequiredSkill] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch enum values
    const fetchEnums = async () => {
      try {
        const response = await axios.get('https://localhost:7176/api/enum/all-enums');
        setEnums(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching enums:', error);
      }
    };

    fetchEnums();
    }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newAd = {
      title,
      description,
      requiredDegree: enums.Degree.indexOf(requiredDegree),
      requiredEducationLevel: enums.EducationLevel.indexOf(requiredEducationLevel),
      requiredPosition: enums.JobPosition.indexOf(requiredPosition),
      requiredIndustry: enums.JobIndustry.indexOf(requiredIndustry),
      requiredJobLevel: enums.JobLevel.indexOf(requiredJobLevel),
      minimumYearsExperience: parseInt(minimumYearsExperience, 10),
      requiredSkill: enums.SkillCategory.indexOf(requiredSkill),
      postedDate: new Date().toISOString(),
      userId: user.userId, // Get user ID from context
    };

    try {
      const response = await axios.post('https://localhost:7176/api/advertisement', newAd, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Advertisement created:', response.data);
      navigate('/user/jobs/view-ad');
    } catch (error) {
      console.error('Error creating advertisement:', error);
      setError('Failed to create advertisement. Please try again.');
    }
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
        <Col xs={9} md={{ span: 6, offset: 1 }} style={{ padding: '20px', height: '800px', overflowY: 'auto' }}>
            <Card>
                <Card.Body>
                <Card.Title>Create a New Job Advertisement</Card.Title>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Row>
                    <Col md={12}>
                        <Form.Group controlId="jobTitle">
                        <Form.Label>Job Title and Company</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter job title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        </Form.Group>
                    </Col>
                    </Row>

                    <Row>
                    <Col md={12}>
                        <Form.Group controlId="jobDescription" className="mt-3">
                        <Form.Label>Job Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            placeholder="Enter job description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        </Form.Group>
                    </Col>
                    </Row>

                    <Row>
                    <Col md={6}>
                        <Form.Group controlId="requiredDegree" className="mt-3">
                        <Form.Label>Required Degree</Form.Label>
                        <Form.Control
                            as="select"
                            value={requiredDegree}
                            onChange={(e) => setRequiredDegree(e.target.value)}
                        >
                            <option value="" disabled hidden>Select Degree</option>
                            {enums.Degree.map((degree) => (
                            <option key={degree} value={degree}>{degree}</option>
                            ))}
                        </Form.Control>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="requiredEducationLevel" className="mt-3">
                        <Form.Label>Required Education Level</Form.Label>
                        <Form.Control
                            as="select"
                            value={requiredEducationLevel}
                            onChange={(e) => setRequiredEducationLevel(e.target.value)}
                        >
                            <option value="" disabled hidden>Select Education Level</option>
                            {enums.EducationLevel.map((level) => (
                            <option key={level} value={level}>{level}</option>
                            ))}
                        </Form.Control>
                        </Form.Group>
                    </Col>
                    </Row>

                    <Row>
                    <Col md={6}>
                        <Form.Group controlId="requiredPosition" className="mt-3">
                        <Form.Label>Required Position</Form.Label>
                        <Form.Control
                            as="select"
                            value={requiredPosition}
                            onChange={(e) => setRequiredPosition(e.target.value)}
                        >
                            <option value="" disabled hidden>Select Position</option>
                            {enums.JobPosition.map((position) => (
                            <option key={position} value={position}>{position}</option>
                            ))}
                        </Form.Control>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="requiredIndustry" className="mt-3">
                        <Form.Label>Required Industry</Form.Label>
                        <Form.Control
                            as="select"
                            value={requiredIndustry}
                            onChange={(e) => setRequiredIndustry(e.target.value)}
                        >
                            <option value="" disabled hidden>Select Industry</option>
                            {enums.JobIndustry.map((industry) => (
                            <option key={industry} value={industry}>{industry}</option>
                            ))}
                        </Form.Control>
                        </Form.Group>
                    </Col>
                    </Row>

                    <Row>
                    <Col md={6}>
                        <Form.Group controlId="requiredJobLevel" className="mt-3">
                        <Form.Label>Required Job Level</Form.Label>
                        <Form.Control
                            as="select"
                            value={requiredJobLevel}
                            onChange={(e) => setRequiredJobLevel(e.target.value)}
                        >
                            <option value="" disabled hidden>Select Job Level</option>
                            {enums.JobLevel.map((level) => (
                            <option key={level} value={level}>{level}</option>
                            ))}
                        </Form.Control>
                        </Form.Group>
                    </Col>

                    <Col md={6}>
                        <Form.Group controlId="minimumYearsExperience" className="mt-3">
                        <Form.Label>Minimum Years of Experience in Current Position</Form.Label>
                        <Form.Control
                            type="number"
                            placeholder="Enter minimum years of experience"
                            value={minimumYearsExperience}
                            onChange={(e) => setMinimumYearsExperience(e.target.value)}
                        />
                        </Form.Group>
                    </Col>
                    </Row>

                    <Row>
                    <Col md={6}>
                        <Form.Group controlId="requiredSkill" className="mt-3">
                        <Form.Label>Required Skill</Form.Label>
                        <Form.Control
                            as="select"
                            value={requiredSkill}
                            onChange={(e) => setRequiredSkill(e.target.value)}
                        >
                            <option value="" disabled hidden>Select Skill</option>
                            {enums.SkillCategory.map((skill) => (
                            <option key={skill} value={skill}>{skill}</option>
                            ))}
                        </Form.Control>
                        </Form.Group>
                    </Col>
                    </Row>

                    <Button variant="primary" type="submit" className="mt-3">
                    Create
                    </Button>
                </Form>
                </Card.Body>
            </Card>
            </Col>

      </Row>
    </Container>
  );
};

export default UserJobsCreate;
