import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../UserContext';
import useIdleTimer from '../hooks/useIdleTimer';
import { Container, Row, Col, Tabs, Tab, FormControl, Button, Modal } from 'react-bootstrap';
import UserTable from './UserTable';
import EditUserModal from './EditUserModal';
import PaginationComponent from './PaginationComponent';

const Admin = () => {
    const navigate = useNavigate();
    const {user: currentUser, logout } = useContext(UserContext);
    const [currentFirstName, setCurrentFirstName] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedAllUsers, setSelectedAllUsers] = useState([]);
    const [selectedAdminUsers, setSelectedAdminUsers] = useState([]);
    const [selectedNonAdminUsers, setSelectedNonAdminUsers] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectAllAll, setSelectAllAll] = useState(false);
    const [selectAllAdmins, setSelectAllAdmins] = useState(false);
    const [selectAllNonAdmins, setSelectAllNonAdmins] = useState(false);
    const [key, setKey] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editUser, setEditUser] = useState(null);

    useIdleTimer(() => {
        setShowModal(true);
        setTimeout(() => {
            logout();
            navigate('/');
        }, 5000); // 5 seconds
    }, 300000); // 5 minutes

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get('https://localhost:7176/api/users');
            setUsers(response.data);
            // find the current user
            const currUserFirstName = response.data.find(user => user.userId === currentUser.userId);
            setCurrentFirstName(currUserFirstName.firstName);;
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSelectUser = (userId, selectedUsers, setSelectedUsers) => {
        setSelectedUsers(prevState =>
            prevState.includes(userId)
                ? prevState.filter(id => id !== userId)
                : [...prevState, userId]
        );
    };

    const handleSelectAll = (selectAll, setSelectAll, filteredUsers, setSelectedUsers) => {
        if (selectAll) {
            setSelectedUsers([]);
        } else {
            const allUserIds = filteredUsers.map(user => user.userId);
            setSelectedUsers(allUserIds);
        }
        setSelectAll(!selectAll);
    };

    const exportData = async (format, selectedUsers) => {
        try {
            const response = await axios.post(`https://localhost:7176/api/userexport/export?format=${format}`, selectedUsers, {
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
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        const [field, index, key] = name.split('-');
    
        if (['education', 'skills', 'jobs', 'publicFields'].includes(field)) {
            if (field === 'publicFields') {
                const fieldName = value;
                const updatedFields = editUser.publicFields.includes(fieldName)
                    ? editUser.publicFields.filter(field => field !== fieldName)
                    : [...editUser.publicFields, fieldName];
                setEditUser({ ...editUser, publicFields: updatedFields });
            } else {
                const updatedItems = [...editUser[field]];
                updatedItems[index] = {
                    ...updatedItems[index],
                    [key]: value
                };
    
                // Επικύρωση ημερομηνιών
                if (key === 'startDate' || key === 'endDate') {
                    const startDate = new Date(updatedItems[index].startDate);
                    const endDate = new Date(updatedItems[index].endDate);
    
                    if (startDate > endDate) {
                        alert('Η ημερομηνία έναρξης πρέπει να είναι πριν από την ημερομηνία λήξης');
                        return;
                    }
                }
    
                setEditUser({ ...editUser, [field]: updatedItems });
            }
        } else {
            setEditUser({ ...editUser, [name]: value });
        }
    };
    
    
    
    
    

    const handleSaveEditUser = async () => {
        try {
            const formattedUser = {
                ...editUser,
                education: editUser.education.map(({ degree, institution, startDate, endDate }) => ({
                    degree,
                    institution,
                    startDate: new Date(startDate).toISOString(),
                    endDate: new Date(endDate).toISOString(),
                })),
                jobs: editUser.jobs.map(({ position, company, startDate, endDate }) => ({
                    position,
                    company,
                    startDate: new Date(startDate).toISOString(),
                    endDate: new Date(endDate).toISOString(),
                })),
                skills: editUser.skills.map(({ skillName, proficiency }) => ({
                    skillName,
                    proficiency,
                })),
            };
    
            await axios.put(`https://localhost:7176/api/users/${editUser.userId}`, formattedUser);
            setShowEditModal(false);
            setEditUser(null);
            fetchUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };
    

    const handleDeleteUser = async (userId) => {
        try {
            await axios.delete(`https://localhost:7176/api/users/${userId}`);
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };
    

    const renderPagination = (filteredUsers) => (
        <PaginationComponent 
            totalItems={filteredUsers.length}
            currentPage={currentPage}
            rowsPerPage={rowsPerPage}
            handlePageChange={handlePageChange}
        />
    );

    return (
        <Container>
            <Row className="my-4">
                <Col>
                    <h2>Welcome back {currentFirstName}! Manage all users here</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3">
                        <Tab eventKey="all" title="All Users">
                            <UserTable 
                                users={users} 
                                selectedUsers={selectedAllUsers} 
                                setSelectedUsers={setSelectedAllUsers} // Add this line
                                handleSelectUser={handleSelectUser} 
                                handleSelectAll={handleSelectAll} 
                                selectAll={selectAllAll} 
                                setSelectAll={setSelectAllAll} 
                                setEditUser={setEditUser} 
                                setShowEditModal={setShowEditModal} 
                                handleDeleteUser={handleDeleteUser}
                                currentPage={currentPage}
                                rowsPerPage={rowsPerPage}
                                renderPagination={renderPagination}
                            />
                        </Tab>
                        <Tab eventKey="admins" title="Admins">
                            <UserTable 
                                users={users.filter(user => user.admin === true)} 
                                selectedUsers={selectedAdminUsers} 
                                setSelectedUsers={setSelectedAdminUsers} // Add this line
                                handleSelectUser={handleSelectUser} 
                                handleSelectAll={handleSelectAll} 
                                selectAll={selectAllAdmins} 
                                setSelectAll={setSelectAllAdmins} 
                                setEditUser={setEditUser} 
                                setShowEditModal={setShowEditModal} 
                                handleDeleteUser={handleDeleteUser}
                                currentPage={currentPage}
                                rowsPerPage={rowsPerPage}
                                renderPagination={renderPagination}
                            />
                        </Tab>
                        <Tab eventKey="nonAdmins" title="Users">
                            <UserTable 
                                users={users.filter(user => user.admin === false)} 
                                selectedUsers={selectedNonAdminUsers} 
                                setSelectedUsers={setSelectedNonAdminUsers} // Add this line
                                handleSelectUser={handleSelectUser} 
                                handleSelectAll={handleSelectAll} 
                                selectAll={selectAllNonAdmins} 
                                setSelectAll={setSelectAllNonAdmins} 
                                setEditUser={setEditUser} 
                                setShowEditModal={setShowEditModal} 
                                handleDeleteUser={handleDeleteUser}
                                currentPage={currentPage}
                                rowsPerPage={rowsPerPage}
                                renderPagination={renderPagination}
                            />
                        </Tab>
                    </Tabs>
                </Col>
            </Row>
            <Row className="my-3">
                <Col md="auto">
                    <FormControl as="select" value={rowsPerPage} onChange={(e) => setRowsPerPage(Number(e.target.value))}>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                    </FormControl>
                </Col>
                <Col>
                    <Button variant="primary" onClick={() => exportData('json', key === 'all' ? selectedAllUsers : key === 'admins' ? selectedAdminUsers : key === 'nonAdmins' ? selectedNonAdminUsers : [])}>Export JSON</Button>
                    <Button variant="secondary" onClick={() => exportData('xml', key === 'all' ? selectedAllUsers : key === 'admins' ? selectedAdminUsers : key === 'nonAdmins' ? selectedNonAdminUsers : [])} className="ms-2">Export XML</Button>
                </Col>
            </Row>

            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Session Timeout</Modal.Title>
                </Modal.Header>
                <Modal.Body>You have been inactive for a while. You will be logged out in 5 seconds.</Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleCloseModal}>
                        OK
                    </Button>
                </Modal.Footer>
            </Modal>

            <EditUserModal 
                showEditModal={showEditModal}
                setShowEditModal={setShowEditModal}
                editUser={editUser}
                handleEditChange={handleEditChange}
                handleSaveEditUser={handleSaveEditUser}
            />
        </Container>
    );
};

export default Admin;
