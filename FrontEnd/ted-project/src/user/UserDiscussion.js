import React, { useState, useEffect, useContext, useRef } from 'react';
import { Container, Row, Col, ListGroup, Card, Form, Button, Modal, Badge } from 'react-bootstrap';
import axios from 'axios';
import { UserContext } from '../UserContext';
import { UnreadMessagesContext } from '../UnreadMessagesContext';
import { SelectedDiscussionContext } from '../SelectedDiscussionContext';
import { SignalRContext } from '../SignalRContext';

const UserDiscussion = () => {
    const { user: currentUser } = useContext(UserContext);
    const [discussions, setDiscussions] = useState([]);
    const [messages, setMessages] = useState([]);
    const { setUnreadCount } = useContext(UnreadMessagesContext);
    const { selectedDiscussionId, setSelectedDiscussionId } = useContext(SelectedDiscussionContext);
    const [selectedDiscussion, setSelectedDiscussion] = useState(null);
    const [newMessage, setNewMessage] = useState('');
    const [showAddParticipantModal, setShowAddParticipantModal] = useState(false);
    const [showRemoveParticipantModal, setShowRemoveParticipantModal] = useState(false);
    const [friends, setFriends] = useState([]); 
    const [selectedFriendId, setSelectedFriendId] = useState(null);
    const [participants, setParticipants] = useState([]); 
    const [participantNames, setParticipantNames] = useState([]);
    const messageInputRef = useRef(null);
    const messagesEndRef = useRef(null);
    const {message } = useContext(SignalRContext);

    useEffect(() => {
        if (!currentUser || !currentUser.userId) {
            console.error('User is not logged in');
            return;
        }

        const fetchDiscussions = async () => {
            try {
                const response = await axios.get(`https://localhost:7176/api/discussions/user/${currentUser.userId}`);
                // console.log('Discussions Response:', response.data);
                setDiscussions(response.data);
                
                // Check if there is a saved discussion ID in the local storage. 
                const savedDiscussionId = localStorage.getItem('selectedDiscussionId');
                if (savedDiscussionId) {
                    const discussionId = parseInt(savedDiscussionId, 10);
                    setSelectedDiscussion(discussionId);
                    await fetchMessages(discussionId);

                    // Mark messages are read for the auto-selected discussion
                    await markMessagesAsRead(discussionId);
                } else if (response.data.length > 0) {  // else, selected the last discussion from the API response
                    const lastDiscussion = response.data[response.data.length - 1];
                    setSelectedDiscussion(lastDiscussion.id);
                    await fetchMessages(lastDiscussion.id);

                    // Mark messages are read for the auto-selected discussion
                    await markMessagesAsRead(lastDiscussion.id);
                }
            } catch (error) {
                console.error('Error fetching discussions:', error);
            }
        };

        fetchDiscussions();

    }, [currentUser]);

    const markMessagesAsRead = async (discussionId) => {
        try {
            // Mark the messages in this discussion as read
            await axios.post(`https://localhost:7176/api/messages/${discussionId}/mark-as-read/${currentUser.userId}`);
            
            // Fetch the updated discussions list and adjust the unread count
            const updatedDiscussions = await axios.get(`https://localhost:7176/api/discussions/user/${currentUser.userId}`);
            setDiscussions(updatedDiscussions.data);
    
            // Update the unread count in the context after marking messages as read
            const newUnreadCount = updatedDiscussions.data.reduce((total, discussion) => {
                return total + (discussion.unreadCount || 0);
            }, 0);
            setUnreadCount(newUnreadCount);
        } catch (error) {
            if (error.response && error.response.status === 404) {
                console.log("No unread messages to mark as read.");
            } else {
                console.error('Error marking messages as read:', error);
            }
        }
    }

    useEffect(() => {
        if (message) {
            // Log message details for debugging
            console.log('UserDiscussion: New message received', message);
    
            setDiscussions((prevDiscussions) => 
                prevDiscussions.map((discussion) => {
                    if (discussion.id === message.discussionId) {
                        // Avoid adding the message multiple times
                        if (message.discussionId === selectedDiscussion) {
                            setMessages((prevMessages) => {
                                // Check if the message already exists
                                const messageExists = prevMessages.some(
                                    (msg) => msg.senderId === message.senderId && msg.text === message.message && msg.timestamp === message.timestamp
                                );
    
                                if (!messageExists) {
                                    return [
                                        ...prevMessages,
                                        { senderName: message.user, text: message.message, senderId: message.senderId },
                                    ];
                                }
    
                                return prevMessages;
                            });
                            scrollToBottom();
                        } else {
                            return { ...discussion, unreadCount: (discussion.unreadCount || 0) + 1 };
                        }
                    }
                    return discussion;
                })
            );
        }
    }, [message]);

    const fetchMessages = async (id) => {
        try {
            const response = await axios.get(`https://localhost:7176/api/discussions/${id}`);
            console.log('Messages Response:', response.data.messages);
            setMessages(response.data.messages);
            setParticipants(response.data.participants); 
            scrollToBottom(); 
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const fetchFriends = async () => {
        try {
            const response = await axios.get(`https://localhost:7176/api/usernetwork/${currentUser.userId}/friends`);
            setFriends(response.data);
        } catch (error) {
            console.error('Error fetching friends:', error);
        }
    };

    const handleDiscussionClick = async (id) => {
        setSelectedDiscussion(id);
        setSelectedDiscussionId(id); // Context for the Header component
        await fetchMessages(id);
        localStorage.setItem('selectedDiscussionId', id);
        
        // Mark messages are read for the selected discussion
        await markMessagesAsRead(id);
    };
    
    const handleSendMessage = async () => {
        if (!newMessage.trim()) {
            return;
        }
        //console.log('Message sent:', newMessage, currentUser.userId, selectedDiscussion);

        try {
            await axios.post('https://localhost:7176/api/messages/send', {
                text: newMessage,
                senderId: currentUser.userId,
                discussionId: selectedDiscussion,
                timestamp: new Date().toISOString()
            });
            // Immediately show the message in the UI for the sender
            setMessages((prevMessages) => [
                ...prevMessages,
                {
                    senderName: "You",
                    text: newMessage,
                    senderId: currentUser.userId,
                },
            ]);

            setNewMessage('');
            messageInputRef.current.focus();
            scrollToBottom(); 
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (selectedDiscussion !== null) {
            scrollToBottom();
        }
    }, [messages]);

    const handleOpenAddParticipantModal = async () => {
        await fetchFriends(); 
        setShowAddParticipantModal(true);
    };

    const handleCloseAddParticipantModal = () => setShowAddParticipantModal(false);

    const handleAddParticipant = async () => {
        if (!selectedFriendId) return;
    
        try {
            const userId = parseInt(selectedFriendId, 10); 
    
            await axios.post(`https://localhost:7176/api/discussions/${selectedDiscussion}/add-participant`, {
                userId: userId
            });
    
            const updatedDiscussions = await axios.get(`https://localhost:7176/api/discussions/user/${currentUser.userId}`);
            setDiscussions(updatedDiscussions.data);
    
            const updatedMessagesResponse = await axios.get(`https://localhost:7176/api/discussions/${selectedDiscussion}`);
            setMessages(updatedMessagesResponse.data.messages); 
    
            alert('Participant added successfully.');
            setShowAddParticipantModal(false);
    
            scrollToBottom();
        } catch (error) {
            console.error('Error adding participant:', error);
            alert('Failed to add participant.');
        }
    };

    const handleOpenRemoveParticipantModal = () => {
        setShowRemoveParticipantModal(true);
    };

    const handleCloseRemoveParticipantModal = () => setShowRemoveParticipantModal(false);

    const handleRemoveParticipant = async () => {
        if (!selectedFriendId) return;
    
        try {
            const userId = parseInt(selectedFriendId, 10); 
    
            await axios.post(`https://localhost:7176/api/discussions/${selectedDiscussion}/remove-participant`, {
                userId: userId
            });
    
            const updatedDiscussions = await axios.get(`https://localhost:7176/api/discussions/user/${currentUser.userId}`);
            setDiscussions(updatedDiscussions.data);
    
            const updatedMessagesResponse = await axios.get(`https://localhost:7176/api/discussions/${selectedDiscussion}`);
            setMessages(updatedMessagesResponse.data.messages); 
    
            alert('Participant removed successfully.');
            setShowRemoveParticipantModal(false);
    
            scrollToBottom();
        } catch (error) {
            console.error('Error removing participant:', error);
            alert('Failed to remove participant.');
        }
    };

    // Handler για διαγραφή συζήτησης
    const handleDeleteDiscussion = async () => {
        if (!window.confirm('Are you sure you want to delete this discussion?')) return;
    
        try {
            await axios.post(`https://localhost:7176/api/discussions/${selectedDiscussion}/delete-or-remove-participant`, {
                userId: currentUser.userId
            });
    
            // Ενημέρωση της λίστας συζητήσεων μετά τη διαγραφή ή αφαίρεση συμμετέχοντα
            const updatedDiscussions = await axios.get(`https://localhost:7176/api/discussions/user/${currentUser.userId}`);
            setDiscussions(updatedDiscussions.data);
    
            // Καθαρισμός της επιλογής συζήτησης και μηνυμάτων
            setSelectedDiscussion(null);
            setMessages([]);
    
            alert('Discussion deleted or participant removed successfully.');
        } catch (error) {
            console.error('Error deleting discussion or removing participant:', error);
            alert('Failed to delete discussion or remove participant.');
        }
    };
    
    
    useEffect(() => {
        const fetchParticipantNames = async () => {
            const namesPromises = participants.map(async (participant) => {
                const response = await axios.get(`https://localhost:7176/api/users/${participant}/names`);
                return { id: participant, name: `${response.data.firstName} ${response.data.lastName}` };
            });
            const names = await Promise.all(namesPromises);
            setParticipantNames(names);
        };
    
        fetchParticipantNames();
    }, [participants]);
    
    const isDiscussionCreator = selectedDiscussion && discussions.length > 0 && 
        discussions.find(discussion => discussion.id === selectedDiscussion)?.participants?.[0] === currentUser.userId;

    if (!selectedDiscussion) {
        return <div>Loading discussions...</div>
    }
    return (
        <Container className="mt-5">
            <Row>
                <Col md={4}>
                    <Card>
                        <Card.Header>Discussions</Card.Header>
                        <ListGroup variant="flush">
                            {discussions.map((discussion) => (
                                <ListGroup.Item 
                                    className="d-flex justify-content-between align-items-start"
                                    key={discussion.id} 
                                    action
                                    onClick={() => handleDiscussionClick(discussion.id)}
                                    active={selectedDiscussion === discussion.id}
                                >
                                    {discussion.title}
                                    {discussion.unreadCount > 0 && (
                                        <Badge pill bg="primary">{discussion.unreadCount}</Badge>
                                    )}
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>
                <Col md={8}>
                    <Card>
                        <Card.Header>Messages</Card.Header>
                        <Card.Body style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {selectedDiscussion ? (
                                messages.length > 0 ? (
                                    <>
                                        {messages.map((message, index) => (
                                            <div 
                                                key={index} 
                                                style={{ 
                                                    textAlign: message.senderId === currentUser.userId ? 'right' : 'left',
                                                    marginBottom: '10px'
                                                }}
                                            >
                                                <div>
                                                    {message.senderId === currentUser.userId ? <strong> You </strong> : <strong> {message.senderName}</strong>}
                                                    
                                                </div>
                                                <div
                                                    style={{
                                                        background: message.senderId === currentUser.userId ? '#DCF8C6' : '#FFFFFF',
                                                        display: 'inline-block',
                                                        padding: '10px',
                                                        borderRadius: '10px',
                                                        maxWidth: '80%'
                                                    }}
                                                >
                                                    {message.text}
                                                </div>
                                            </div>
                                        ))}
                                        <div ref={messagesEndRef} />
                                    </>
                                ) : (
                                    <p>No messages in this discussion</p>
                                )
                            ) : (
                                <p>Choose a discussion to see the messages</p>
                            )}
                        </Card.Body>
                        <Card.Footer className="d-flex justify-content-between">
                        {selectedDiscussion && (
                            <Form.Group controlId="messageInput" className="flex-grow-1">
                                <Form.Control
                                    type="text"
                                    placeholder="Enter your message..."
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleSendMessage();
                                        }
                                    }}
                                    ref={messageInputRef}
                                />
                                <Button variant="primary" className="mt-2" onClick={handleSendMessage}>
                                    Send
                                </Button>
                                <Button 
                                    variant="secondary" 
                                    className="mt-2 ms-3 align-self-start" 
                                    onClick={handleOpenAddParticipantModal}
                                >
                                    Add Participant
                                </Button>
                                {isDiscussionCreator && (
                                    <>
                                        <Button 
                                            variant="danger" 
                                            className="mt-2 ms-3 align-self-start" 
                                            onClick={handleOpenRemoveParticipantModal}
                                        >
                                            Remove Participant
                                        </Button>
                                        
                                    </>
                                )}
                                <Button 
                                    variant="warning" 
                                    className="mt-2 ms-3 align-self-start" 
                                    onClick={handleDeleteDiscussion}
                                >
                                    Delete Discussion
                                </Button>
                            </Form.Group>
                        )}

                        </Card.Footer>
                    </Card>
                </Col>
            </Row>

            <Modal show={showAddParticipantModal} onHide={handleCloseAddParticipantModal} centered> 
                <Modal.Header closeButton>
                    <Modal.Title>Add Participant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Select a Friend to Add</Form.Label>
                        <Form.Control as="select" value={selectedFriendId} onChange={(e) => setSelectedFriendId(e.target.value)}>
                            <option value="">Select a friend...</option>
                            {friends.map((friend) => (
                                <option key={friend.userId} value={friend.userId}>
                                    {friend.firstName} {friend.lastName}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseAddParticipantModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleAddParticipant}>
                        Add
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={showRemoveParticipantModal} onHide={handleCloseRemoveParticipantModal} centered> 
                <Modal.Header closeButton>
                    <Modal.Title>Remove Participant</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group>
                        <Form.Label>Select a Participant to Remove</Form.Label>
                        <Form.Control as="select" value={selectedFriendId} onChange={(e) => setSelectedFriendId(e.target.value)}>
                            <option value="">Select a participant...</option>
                            {participantNames
                                .filter(participant => participant.id !== currentUser.userId)
                                .map(({ id, name }) => (
                                    <option key={id} value={id}>
                                        {name}
                                    </option>
                                ))}
                        </Form.Control>
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseRemoveParticipantModal}>
                        Close
                    </Button>
                    <Button variant="danger" onClick={handleRemoveParticipant}>
                        Remove
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default UserDiscussion;
