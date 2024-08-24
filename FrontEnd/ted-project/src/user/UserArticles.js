import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form } from 'react-bootstrap';
import axios from 'axios'; 
import { UserContext } from '../UserContext';

const UserArticles = () => {
  const [articles, setArticles] = useState([]);
  const { user } = useContext(UserContext);

  useEffect(() => {
    // Fetch articles from the backend
    const fetchArticles = async () => {
      try {
        const response = await axios.get('https://localhost:7176/api/article');
        const sortedArticles = response.data.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        setArticles(sortedArticles);
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };

    fetchArticles();
  }, [user]);

  const handleLike = async (articleId) => {
    try {
      await axios.post(`https://localhost:7176/api/article/${articleId}/like`, { userId: user.userId });
      // Optionally refresh the articles or update the UI to reflect the new like
    } catch (error) {
      console.error('Error liking article:', error);
    }
  };

  const handleComment = async (articleId, comment) => {
    try {
      await axios.post(`https://localhost:7176/api/article/${articleId}/comment`, { content: comment, commenterId: user.userId });
      // Optionally refresh the articles or update the UI to reflect the new comment
    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  return (
    <Container fluid style={{ height: '100vh', overflowY: 'auto' }}>
      <Row>
        <Col md={{ span: 8, offset: 2 }} style={{ padding: '20px' }}>
          <Card>
            <Card.Body>
              <Card.Title>Timeline</Card.Title>
              <Card.Text>
                Below are the articles posted by users:
              </Card.Text>

              {articles.length > 0 ? (
                articles.map(article => (
                  <Card key={article.articleId} className="mb-3">
                    <Card.Header>
                      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                        <span>{new Date(article.postedDate).toLocaleDateString()}</span>
                        <span>By: {article.author.firstName} {article.author.lastName}</span>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <h5>{article.title}</h5>
                      <p>{article.content}</p>
                      <div>
                        <strong>Likes:</strong> {article.likes.length}
                        <Button variant="link" onClick={() => handleLike(article.articleId)}>Like</Button>
                      </div>
                      <div>
                        <strong>Comments:</strong>
                        {article.comments.length > 0 ? (
                          article.comments.map(comment => (
                            <p key={comment.commentId}>{comment.content} - {comment.commenter.firstName}</p>
                          ))
                        ) : (
                          <p>No comments yet.</p>
                        )}
                      </div>
                      <Form.Control
                        type="text"
                        placeholder="Add a comment"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleComment(article.articleId, e.target.value);
                            e.target.value = '';
                          }
                        }}
                      />
                    </Card.Body>
                  </Card>
                ))
              ) : (
                <p>No articles found.</p>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserArticles;