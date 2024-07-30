import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Admin = () => {
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://localhost:7176/api/users');
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSelectUser = (userId) => {
        setSelectedUsers(prevState => 
            prevState.includes(userId) 
                ? prevState.filter(id => id !== userId) 
                : [...prevState, userId]
        );
    };

    const exportData = async (format) => {
        try {
            const response = await axios.post(`https://localhost:7176/api/users/export?format=${format}`, selectedUsers, {
                headers: {
                    'Content-Type': 'application/json'
                },
                responseType: 'blob' // Ensure the response is treated as a binary blob
            });
            const blob = new Blob([response.data], { type: format === 'json' ? 'application/json' : 'application/xml' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `users.${format}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error('Error exporting data:', error);
        }
    }

    return (
        <div>
            <h1>Admin Page</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Select</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user.userId}>
                            <td>
                                <input 
                                    type="checkbox" 
                                    checked={selectedUsers.includes(user.userId)} 
                                    onChange={() => handleSelectUser(user.userId)} 
                                />
                            </td>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>
                                <Link to={`/user/${user.userId}`} className="btn btn-info">View</Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => exportData('json')} className="btn btn-primary">Export JSON</button>
            <button onClick={() => exportData('xml')} className="btn btn-secondary">Export XML</button>
        </div>
    );
};

export default Admin;
