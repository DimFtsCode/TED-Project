import axios from 'axios';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { UserContext } from './UserContext';
import './Register.css'; // Import the custom CSS file
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { enUS } from 'date-fns/locale';

import profile1 from './images/stockProfiles/profile1.jpg';
import profile2 from './images/stockProfiles/profile2.jpg';
import profile3 from './images/stockProfiles/profile3.jpg';
import profile4 from './images/stockProfiles/profile4.jpg';
import profile5 from './images/stockProfiles/profile5.jpg';
import profile6 from './images/stockProfiles/profile6.jpg';
import profile7 from './images/stockProfiles/profile7.jpg';
import profile8 from './images/stockProfiles/profile8.jpg';
import profile9 from './images/stockProfiles/profile9.jpg';

const Register = () => {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [user, setUser] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
    photo: null,
    dateOfBirth: null, 
    address: '',
    isFirstNamePublic: true,
    isLastNamePublic: true,
    isEmailPublic: false,
    isPhoneNumberPublic: false,
    isDateOfBirthPublic: false,
    isAddressPublic: false,
  });
  const [error, setError] = useState('');
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // store the stock images in an array
  const defaultProfileImages = [
    profile1,
    profile2,
    profile3,
    profile4,
    profile5,
    profile6,
    profile7,
    profile8,
    profile9,
  ];
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setUser({
      ...user,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handlePhotoChange = (e) => {
    setUser({
      ...user,
      photo: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (user.password !== user.confirmPassword) {
        setError('Passwords do not match');
        return;
    }

    const formData = new FormData();
    const publicFields = [];

    // If the user hasn't uploaded a photo, assign a random default image
    if (!user.photo) {
        const randomIndex = Math.floor(Math.random() * defaultProfileImages.length);
        const randomImageUrl = defaultProfileImages[randomIndex];

        // Fetch the image and convert it to a Blob
        const response = await fetch(randomImageUrl);
        const blob = await response.blob();

        // Create a File object from the blob (with a filename and MIME type)
        const defaultPhotoFile = new File([blob], `defaultProfile${randomIndex + 1}.png`, { type: blob.type });
        formData.append('photo', defaultPhotoFile);
    } else {
        // Append the user-uploaded photo to formData
        formData.append('photo', user.photo);
    }

    // Append other user data to formData
    for (let key in user) {
        if (
            key !== 'confirmPassword' &&
            key !== 'isFirstNamePublic' &&
            key !== 'isLastNamePublic' &&
            key !== 'isEmailPublic' &&
            key !== 'isPhoneNumberPublic' &&
            key !== 'isDateOfBirthPublic' &&
            key !== 'isAddressPublic' &&
            user[key]
        ) {
            if (key === 'dateOfBirth') {
                formData.append(key, user[key].toISOString());
            } else {
                formData.append(key, user[key]);
            }
        }
    }

    // Collect public fields based on user input
    if (user.isFirstNamePublic) publicFields.push('FirstName');
    if (user.isLastNamePublic) publicFields.push('LastName');
    if (user.isEmailPublic) publicFields.push('Email');
    if (user.isPhoneNumberPublic) publicFields.push('PhoneNumber');
    if (user.isDateOfBirthPublic) publicFields.push('DateOfBirth');
    if (user.isAddressPublic) publicFields.push('Address');

    // Append public fields to formData
    formData.append('PublicFields', JSON.stringify(publicFields));

    try {
        const response = await axios.post('https://localhost:7176/api/userregistration/register', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            withCredentials: true,
        });

        const userData = {
            userId: response.data.userId,
            email: response.data.email,
            role: 'user',
        };
        login(userData);

        // Update the user state with the userId from the response
        setUser((prevState) => ({
            ...prevState,
            userId: response.data.userId,
        }));

        setShowSuccessModal(true);
    } catch (error) {
        console.error(error);

        const errorMessage = error.response?.data?.message || error.response?.data;

        if (typeof errorMessage === 'string' && errorMessage.includes('Email is already in use')) {
            setShowEmailModal(true);
        } else {
            setError('An error occurred during registration. Please try again.');
        }
    }
};



  const handleCloseEmailModal = () => {
    setShowEmailModal(false);
    navigate('/');
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/register-bio');
  };

  const handleSkip = async () => {
    // Ensure userId is available
    if (!user.userId) {
        console.error('User ID is undefined');
        return;
    }
    // try {
    //     await axios.post('https://localhost:7176/api/userbio/register-bio', userBioData, { withCredentials: true });
    //     setShowSuccessModal(false);
    //     navigate('/user');
    // } catch (error) {
    //     console.error('Error registering bio:', error);
    // }

    setShowSuccessModal(false);
    navigate('/user');
  };

  return (
    <div className="register-container container mt-5">
      <h2>Create a new account in two steps.</h2>
      <form onSubmit={handleSubmit} className="register-form mt-4">
        <div className="form-group mb-3">
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="firstName" className="form-label">First Name*</label>
              <input type="text" className="form-control" id="firstName" name="firstName" value={user.firstName} onChange={handleChange} placeholder="First Name" required />
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="isFirstNamePublic" name="isFirstNamePublic" checked={user.isFirstNamePublic} onChange={handleChange} />
                <label className="form-check-label" htmlFor="isFirstNamePublic">Public</label>
              </div>
            </div>
            <div className="col-md-6">
              <label htmlFor="lastName" className="form-label">Last Name*</label>
              <input type="text" className="form-control" id="lastName" name="lastName" value={user.lastName} onChange={handleChange} placeholder="Last Name" required />
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="isLastNamePublic" name="isLastNamePublic" checked={user.isLastNamePublic} onChange={handleChange} />
                <label className="form-check-label" htmlFor="isLastNamePublic">Public</label>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group mb-3">
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="email" className="form-label">Email*</label>
              <input type="email" className="form-control" id="email" name="email" value={user.email} onChange={handleChange} placeholder="Email" required />
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="isEmailPublic" name="isEmailPublic" checked={user.isEmailPublic} onChange={handleChange} />
                <label className="form-check-label" htmlFor="isEmailPublic">Public</label>
              </div>
            </div>
            <div className="col-md-6">
              <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
              <input type="text" className="form-control" id="phoneNumber" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="isPhoneNumberPublic" name="isPhoneNumberPublic" checked={user.isPhoneNumberPublic} onChange={handleChange} />
                <label className="form-check-label" htmlFor="isPhoneNumberPublic">Public</label>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group mb-3">
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="password" className="form-label">Password*</label>
              <input type="password" className="form-control" id="password" name="password" value={user.password} onChange={handleChange} placeholder="Password" required />
            </div>
            <div className="col-md-6">
              <label htmlFor="confirmPassword" className="form-label">Confirm Password*</label>
              <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
            </div>
          </div>
        </div>
        <div className="form-group mb-3">
          <div className="row">
            <div className="col-md-4">
            <label htmlFor="dateOfBirth" className="form-label">Date of Birth*</label>
            <DatePicker
                selected={user.dateOfBirth}
                onChange={(date) => setUser({ ...user, dateOfBirth: date })}
                dateFormat="MM/dd/yyyy"
                className="form-control"
                id="dateOfBirth"
                name="dateOfBirth"
                placeholderText="Select your date of birth"
                required
                locale={enUS}
                showYearDropdown        // Προσθέτει dropdown για επιλογή έτους
                showMonthDropdown       // Προσθέτει dropdown για επιλογή μήνα
                dropdownMode="select"   // Καθορίζει ότι το dropdown θα λειτουργεί με επιλογή
            />
              <div className="form-check">
                <input 
                  className="form-check-input" 
                  type="checkbox" 
                  id="isDateOfBirthPublic" 
                  name="isDateOfBirthPublic" 
                  checked={user.isDateOfBirthPublic} 
                  onChange={handleChange} 
                />
                <label className="form-check-label" htmlFor="isDateOfBirthPublic">Public</label>
              </div>
            </div>
            <div className="col-md-4">
              <label htmlFor="address" className="form-label">Address</label>
              <input type="text" className="form-control" id="address" name="address" value={user.address} onChange={handleChange} placeholder="Address" />
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="isAddressPublic" name="isAddressPublic" checked={user.isAddressPublic} onChange={handleChange} />
                <label className="form-check-label" htmlFor="isAddressPublic">Public</label>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group mb-3">
          <div className="row">
            <div className="col-md-6">
              <label htmlFor="photo" className="form-label">Profile Photo</label>
              <input type="file" className="form-control" id="photo" name="photo" onChange={handlePhotoChange} />
            </div>
          </div>
        </div>
        <div className="btn-container">
          <button type="submit" className="btn btn-primary">Register</button>
        </div>
        {error && <p className="text-danger mt-2">{error}</p>}
      </form>
  
      <Modal show={showEmailModal} onHide={handleCloseEmailModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'red' }}>E-mail is already in use.</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>E-mail is <strong>unique</strong> for every user.</p>
          <p>For <strong>privacy reasons</strong>, you need to register again.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseEmailModal}>
            Home Page
          </Button>
        </Modal.Footer>
      </Modal>
  
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
        <Modal.Header closeButton>
          <Modal.Title style={{ color: 'green' }}>Step 1 is completed</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Now you need to write your biography or press the Skip button to write your biography when you are ready.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseSuccessModal}>
            Write Biography
          </Button>
          <Button variant="secondary" onClick={handleSkip}>
            Skip
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
  
};

export default Register;
