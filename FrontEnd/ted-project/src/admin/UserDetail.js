import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const UserDetail = () => {
    const { userId } = useParams();
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetchUser();
    }, []);

    const fetchUser = async () => {
        try {
            const response = await axios.get(`https://localhost:7176/api/users/${userId}`);
            setUser(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    if (!user) return <div>Loading...</div>;

    return (
        <div>
            <h1>User Details</h1>
            <p>Name: {user.firstName} {user.lastName}</p>
            <p>Email: {user.email}</p>
            <p>Phone Number: {user.phoneNumber}</p>
            <p>Address: {user.address}</p>
            {/* Προσθέστε οποιαδήποτε άλλα στοιχεία χρήστη θέλετε να εμφανίσετε */}
        </div>
    );
};

export default UserDetail;
