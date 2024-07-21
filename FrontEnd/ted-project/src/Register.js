import axios from 'axios';
import React, { useState } from 'react';

const Register = () => {
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
            const response = await axios.post('http://localhost:5297/api/users/register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            alert(response.data);
        } catch (error) {
            console.error(error);
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
        </form>
    );
};

export default Register;
