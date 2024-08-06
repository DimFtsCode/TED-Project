import React from 'react';
import { Table, Button, Form } from 'react-bootstrap';

const UserTable = ({
    users, 
    selectedUsers, 
    setSelectedUsers, 
    handleSelectUser, 
    handleSelectAll, 
    selectAll, 
    setSelectAll, 
    setEditUser, 
    setShowEditModal, 
    handleDeleteUser,
    currentPage,
    rowsPerPage,
    renderPagination
}) => {

    const paginate = (array, pageNumber, rowsPerPage) => {
        const startIndex = (pageNumber - 1) * rowsPerPage;
        return array.slice(startIndex, startIndex + rowsPerPage);
    };

    const paginatedUsers = paginate(users, currentPage, rowsPerPage);

    return (
        <>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>
                            <Form.Check
                                type="checkbox"
                                checked={selectAll}
                                onChange={() => handleSelectAll(selectAll, setSelectAll, users, setSelectedUsers)} // Use setSelectedUsers here
                            />
                        </th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {paginatedUsers.map(user => (
                        <tr key={user.userId}>
                            <td>
                                <Form.Check
                                    type="checkbox"
                                    checked={selectedUsers.includes(user.userId)}
                                    onChange={() => handleSelectUser(user.userId, selectedUsers, setSelectedUsers)} // Use setSelectedUsers here
                                />
                            </td>
                            <td>{user.firstName} {user.lastName}</td>
                            <td>{user.email}</td>
                            <td>
                                <Button variant="info" onClick={() => { setEditUser(user); setShowEditModal(true); }}>Edit</Button>
                                <Button variant="danger" onClick={() => handleDeleteUser(user.userId)} className="ms-2">Delete</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            {renderPagination(users)}
        </>
    );
};

export default UserTable;
