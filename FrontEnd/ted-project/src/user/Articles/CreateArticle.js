import React, { useState, useContext } from 'react';
import { Container, Row, Col, Form, Button, Spinner, Card, Image, Collapse, Alert } from 'react-bootstrap';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import photoVideoIcon from '../../images/photo-video-icon.svg';

const CreateArticle = ({ onArticleCreated }) => {
    const {user} = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [photo, setPhoto] = useState(null);
    const [video, setVideo] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [showMediaOptions, setShowMediaOptions] = useState(false);
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData();
        formData.append('Title', title); 
        formData.append('Content', content);
        formData.append('AuthorId', user.userId);
        if (photo) {
        formData.append('Photo', photo);
        }
        if (video) {
        formData.append('Video', video);
        }

        try {
        const response = await axios.post('https://localhost:7176/api/article', formData, {
            headers: {
            'Content-Type': 'multipart/form-data',
            },
        });

        // Pass the newly created article to the parent component
        onArticleCreated(response.data);

        // Show success message
        setShowSuccessMessage(true);
        
        // Clear the form after a short delay
        setTimeout(() => {
            setTitle('');
            setContent('');
            setPhoto(null);
            setVideo(null);
            setShowSuccessMessage(false); // Hide the success message
        }, 2000);
        } catch (error) {
        console.error('Error creating article:', error);
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <Container fluid style={{overflowY: 'auto' }}>
        <Row>
        <Col md={{ span: 8, offset: 2 }} style={{ padding: '20px' }}>
        <Card className="mb-3">
          <Card.Body>
            <Card.Title>Create New Article</Card.Title>
            <Form onSubmit={handleSubmit}>
              <Form.Group controlId="formTitle" className="mb-3">
                <Form.Control
                  type="text"
                  placeholder="Enter article title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </Form.Group>
    
              <Form.Group controlId="formContent" className="mb-3">
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="What's on your mind?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                />
              </Form.Group>
    
              <Button
                variant="light"
                className="d-flex align-items-center"
                onClick={() => setShowMediaOptions(!showMediaOptions)}
              >
                <Image src={photoVideoIcon} alt="Photo/Video" style={{ width: '20px', marginRight: '5px' }} />
                Photo/Video
              </Button>
    
              <Collapse in={showMediaOptions}>
                <div>
                  <Form.Group controlId="formPhoto" className="mb-2">
                    <Form.Control type="file" onChange={(e) => setPhoto(e.target.files[0])} />
                  </Form.Group>
    
                  <Form.Group controlId="formVideo" className="mb-2">
                    <Form.Control type="file" onChange={(e) => setVideo(e.target.files[0])} />
                  </Form.Group>
                </div>
              </Collapse>
    
              <Button variant="primary" type="submit" disabled={isLoading}>
                {isLoading ? <Spinner animation="border" size="sm" /> : 'Post'}
              </Button>
            </Form>
    
            {showSuccessMessage && (
              <Alert variant="success" className="mt-3">
                Your article has been posted successfully!
              </Alert>
            )}
          </Card.Body>
        </Card>
        </Col>
        </Row>
        </Container>

      );
    };

export default CreateArticle;