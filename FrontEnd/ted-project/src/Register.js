import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate(); 
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
        // admin: false
    });
    const [error, setError] = useState(''); // Νέα κατάσταση για αποθήκευση μηνύματος σφάλματος

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
            if (key === 'admin') {
                formData.append(key, user[key] ? '1' : '0'); // append as string '1' or '0'
            } else {
                formData.append(key, user[key]);
            }
        }

        console.log('Form data:', ...formData); // Log the form data for debugging

        try {
            const response = await axios.post('https://localhost:7176/api/users/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });
            alert(response.data);
            navigate("/"); // Πλοήγηση στην αρχική σελίδα μετά την επιτυχή εγγραφή
        } catch (error) {
            console.error(error);
            setError(error.response.data); // Ενημέρωση της κατάστασης με το μήνυμα σφάλματος
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" name="firstName" value={user.firstName} onChange={handleChange} placeholder="First Name" required />
            <input type="text" name="lastName" value={user.lastName} onChange={handleChange} placeholder="Last Name" required />
            <input type="email" name="email" value={user.email} onChange={handleChange} placeholder="Email" required />
            <input type="text" name="phoneNumber" value={user.phoneNumber} onChange={handleChange} placeholder="Phone Number" required />
            <input type="password" name="password" value={user.password} onChange={handleChange} placeholder="Password" required />
            <input type="password" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} placeholder="Confirm Password" required />
            <input type="file" name="photo" onChange={handlePhotoChange} required />
            <input type="date" name="dateOfBirth" value={user.dateOfBirth} onChange={handleChange} required />
            <input type="text" name="address" value={user.address} onChange={handleChange} placeholder="Address" required />
            <button type="submit">Register</button>
            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Προβολή μηνύματος σφάλματος */}
        </form>
    );
};

export default Register;
