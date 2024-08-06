import React, { useState, useContext, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, Nav, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './User.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import { UserContext } from '../UserContext';

const UserProfile = () => {
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
    publicFields: []
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
        publicFields: response.data.publicFields || []
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
    const formData = new FormData();
    for (const key in profile) {
      if (key === 'photo' && profile[key]) {
        formData.append(key, profile[key]);
      } else if (key === 'publicFields') {
        formData.append(key, JSON.stringify(profile[key]));
      } else {
        formData.append(key, profile[key]);
      }
    }
    try {
      await axios.put(`https://localhost:7176/api/users/${currentUser.userId}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile.');
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
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            {profile.photoData ? (
              <img src={`data:${profile.photoMimeType};base64,${profile.photoData}`} alt="User Profile" style={{ width: '100px', height: '100px', borderRadius: '50%' }} />
            ) : (
              <div style={{ width: '100px', height: '100px', border: '1px solid #ddd', borderRadius: '50%' }}></div>
            )}
            <Form.Group controlId="formPhoto" className="mt-3">
              <Form.Label>Change Photo</Form.Label>
              <Form.Control type="file" name="photo" onChange={handleFileChange} />
            </Form.Group>
          </div>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control type="text" name="firstName" value={profile.firstName} onChange={handleChange} />
              <Form.Check type="checkbox" label="Public" name="firstName" onChange={handleCheckboxChange} checked={profile.publicFields.includes('firstName')} />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control type="text" name="lastName" value={profile.lastName} onChange={handleChange} />
              <Form.Check type="checkbox" label="Public" name="lastName" onChange={handleCheckboxChange} checked={profile.publicFields.includes('lastName')} />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" value={profile.email} onChange={handleChange} />
              <Form.Check type="checkbox" label="Public" name="email" onChange={handleCheckboxChange} checked={profile.publicFields.includes('email')} />
            </Form.Group>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} />
              <Form.Check type="checkbox" label="Public" name="phoneNumber" onChange={handleCheckboxChange} checked={profile.publicFields.includes('phoneNumber')} />
            </Form.Group>
            <Form.Group controlId="formAddress">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" value={profile.address} onChange={handleChange} />
              <Form.Check type="checkbox" label="Public" name="address" onChange={handleCheckboxChange} checked={profile.publicFields.includes('address')} />
            </Form.Group>
            <Form.Group controlId="formDateOfBirth">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" name="dateOfBirth" value={profile.dateOfBirth} onChange={handleChange} />
              <Form.Check type="checkbox" label="Public" name="dateOfBirth" onChange={handleCheckboxChange} checked={profile.publicFields.includes('dateOfBirth')} />
            </Form.Group>
            <Form.Group controlId="formBiography">
              <Form.Label>Biography</Form.Label>
              <Form.Control as="textarea" name="biography" rows={3} value={profile.biography} onChange={handleChange} />
              <Form.Check type="checkbox" label="Public" name="biography" onChange={handleCheckboxChange} checked={profile.publicFields.includes('biography')} />
            </Form.Group>
            <Button variant="primary" type="submit">Update Profile</Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default UserProfile;
