import axios from 'axios';
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap'; //npm install bootstrap react-bootstrap --legacy-peer-deps
import { UserContext } from './UserContext';

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
        dateOfBirth: '',
        address: ''
    });
    const [error, setError] = useState('');
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser({
            ...user,
            [name]: value
        });
    };

    const handlePhotoChange = (e) => {
        setUser({
            ...user,
            photo: e.target.files[0]
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        for (let key in user) {
            formData.append(key, user[key]);
        }

        try {
            const response = await axios.post('https://localhost:7176/api/users/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            const userData = {
                userId: response.data.userId,  // Βεβαιώσου ότι λαμβάνεις το userId από την απάντηση του backend
                email: response.data.email,
                role: 'user',
            };
            console.log('User ID:', userData.userId);  // Προσθήκη του console.log για τον έλεγχο του userId
            login(userData);

            setShowSuccessModal(true);
        } catch (error) {
            console.error(error);
            setError(error.response.data);
            if (error.response && error.response.data && error.response.data.includes('Email is already in use')) {
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

    const handleSkip = () => {
        setShowSuccessModal(false);
        navigate('/user');
    };

    return (
        <div className="container mt-5">
            <h2>Create a new account in two steps.</h2>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label htmlFor="firstName" className="form-label">First Name*</label>
                        <input type="text" className="form-control" id="firstName" name="firstName" value={user.firstName} onChange={handleChange} placeholder="First Name" required />
                    </div>
                    <div className='col-md-2'></div>
                    <div className="col-md-4">
                        <label htmlFor="lastName" className="form-label">Last Name*</label>
                        <input type="text" className="form-control" id="lastName" name="lastName" value={user.lastName} onChange={handleChange} placeholder="Last Name" required />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label htmlFor="email" className="form-label">Email*</label>
                        <input type="email" className="form-control" id="email" name="email" value={user.email} onChange={handleChange} placeholder="Email" required />
                    </div>
                    <div className='col-md-2'></div>
                    <div className="col-md-4">
                        <label htmlFor="phoneNumber" className="form-label">Phone Number</label>
                        <input type="text" className="form-control" id="phoneNumber" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label htmlFor="password" className="form-label">Password*</label>
                        <input type="password" className="form-control" id="password" name="password" value={user.password} onChange={handleChange} placeholder="Password" required />
                    </div>
                    <div className='col-md-2'></div>
                    <div className="col-md-4">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password*</label>
                        <input type="password" className="form-control" id="confirmPassword" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-4">
                        <label htmlFor="dateOfBirth" className="form-label">Date of Birth*</label>
                        <input type="date" className="form-control" id="dateOfBirth" name="dateOfBirth" value={user.dateOfBirth} onChange={handleChange} required />
                    </div>
                    <div className='col-md-2'></div>
                    <div className="col-md-4">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input type="text" className="form-control" id="address" name="address" value={user.address} onChange={handleChange} placeholder="Address" />
                    </div>
                </div>
                <div className="row mb-3">
                    <div className='col-md-3'></div>
                    <div className="col-md-4">
                        <label htmlFor="photo" className="form-label">Profile Photo</label>
                        <input type="file" className="form-control" id="photo" name="photo" onChange={handlePhotoChange} />
                    </div>
                </div>
                <button type="submit" className="btn btn-primary">Step 1</button>
                {error && <p className="text-danger mt-2">{error}</p>}
            </form>

            <Modal show={showEmailModal} onHide={handleCloseEmailModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{ color: 'red' }}>E-mail is already in use.</Modal.Title>
                </Modal.Header>
                <Modal.Body>E-mail is <strong>Unit</strong> for every User.</Modal.Body>
                <Modal.Body>For <strong>Privacy Reasons</strong> u need to Register again.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseEmailModal}>
                        Home Page
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title style={{color: 'green'}}>Step 1 is completed</Modal.Title>
                </Modal.Header>
                <Modal.Body>Now you need to write your biography or press the Skip button to write your biography when you are ready.</Modal.Body>
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
