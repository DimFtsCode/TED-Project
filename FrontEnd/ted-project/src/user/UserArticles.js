import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Image } from 'react-bootstrap';
import axios from 'axios';
import {encode} from 'base64-arraybuffer';
import { UserContext } from '../UserContext';
import likeIcon from '../images/like.svg';
import likedIcon from '../images/liked.svg';
import './UserArticles.css';

const UserArticles = () => {
  const [articles, setArticles] = useState([]);
  const { user } = useContext(UserContext);
  const [initialLoading, setInitialLoading] = useState(true); // for the initial spinner
  const [likedArticles, setLikedArticles] = useState([]); // Track the liked articles.
  const [articlesToShow, setArticlesToShow] = useState(5); // Track the articles to show on the page
  const [loadingMoreArticles, setLoadingMoreArticles] = useState(false); // Track the loading state for the "Load more" button
  const [expandedComments, setExpandedComments] = useState([]); // Track the expanded comments for each article

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const [articlesResponse, likedArticlesResponse] = await Promise.all([
          axios.get('https://localhost:7176/api/article'),
          axios.get(`https://localhost:7176/api/article/liked/${user.userId}`)
        ]);
        // log the first article to see the structure
        const sortedArticles = articlesResponse.data.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        setArticles(sortedArticles);
  
        // Set the liked articles from the response
        setLikedArticles(likedArticlesResponse.data);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setInitialLoading(false); // Hide the spinner after fetching
      }
    };
  
    fetchArticles();
  }, [user]);

  const handleLike = async (articleId) => {
    const articleIndex = articles.findIndex(article => article.articleId === articleId);
    if (articleIndex === -1) return;
  
    const alreadyLiked = likedArticles.includes(articleId);
    try {
      if (alreadyLiked) {
        // Unlike the article
        await axios.post(`https://localhost:7176/api/article/${articleId}/unlike`, { userId: user.userId });
        
        // Update the local liked state after the unlike request
        setLikedArticles(prevLikedArticles => prevLikedArticles.filter(id => id !== articleId));
        
        // Decrement the like count for the article
        setArticles(prevArticles => {
          const updatedArticles = [...prevArticles];
          updatedArticles[articleIndex] = {
            ...updatedArticles[articleIndex],
            likesCount: updatedArticles[articleIndex].likesCount - 1 // Adjusting the likes count here
          };
          return updatedArticles;
        });
      } else {
        // Like the article
        await axios.post(`https://localhost:7176/api/article/${articleId}/like`, { userId: user.userId });
        
        // Update the local liked state after the like request
        setLikedArticles(prevLikedArticles => [...prevLikedArticles, articleId]);
  
        // Increment the like count for the article
        setArticles(prevArticles => {
          const updatedArticles = [...prevArticles];
          updatedArticles[articleIndex] = {
            ...updatedArticles[articleIndex],
            likesCount: updatedArticles[articleIndex].likesCount + 1 // Adjusting the likes count here
          };
          //console.log("updated article likes count: ", updatedArticles[articleIndex].likesCount);
          return updatedArticles;
        });
      }
    } catch (error) {
      console.error('Error liking/unliking article:', error);
    }
  };

  const handleComment = async (articleId, comment) => {
    const articleIndex = articles.findIndex(article => article.articleId === articleId);
    if (articleIndex === -1) return;

    try {
      await axios.post(`https://localhost:7176/api/article/${articleId}/comment`, { content: comment, commenterId: user.userId });
      
      // Fetch the updated article with the new comments 
      const response = await axios.get(`https://localhost:7176/api/article/${articleId}`);
      const updatedArticle = response.data; // The updated article with comments
      
      // Update the local articles state 
      setArticles(prevArticles => {
        const updatedArticles = [...prevArticles];
        updatedArticles[articleIndex] = updatedArticle;
        return updatedArticles;
      })

      // Expand the comments for the article after posting a comment
      if (!expandedComments.includes(articleId)) {
        setExpandedComments(prevExpanded => [...prevExpanded, articleId]);
      }

    } catch (error) {
      console.error('Error posting comment:', error);
    }
  };

  // function to handle expannding/collapsing comments
  const toggleComments = (articleId) => {
    setExpandedComments(prevExpanded => 
      prevExpanded.includes(articleId) 
      ? prevExpanded.filter(id => id !== articleId) // collapse the comments
      : [...prevExpanded, articleId]                // expand the comments
    )
      
  }

  const loadMoreArticles = () => {
    setLoadingMoreArticles(true);
  }

  // simulate loading more articles 
  useEffect(() => {
    if (loadingMoreArticles) {
      setTimeout(() => {
        setArticlesToShow(prevArticlesToShow => prevArticlesToShow + 5); // load 5 more articles
        setLoadingMoreArticles(false);
      }, 1000);
    }
  }, [loadingMoreArticles]);

  return (
    <Container fluid style={{ height: '100vh', overflowY: 'auto' }}>
      <Row>
        <Col md={{ span: 8, offset: 2 }} style={{ padding: '20px' }}>
          <Card>
            <Card.Body>
              <Card.Title>Timeline</Card.Title>
              {initialLoading ? <Spinner animation="border" variant="primary" /> :
              articles.length > 0 ? (
                <>
                  {articles.slice(0, articlesToShow).map(article => (
                    <Card key={article.articleId} className="mb-3">
                      <Card.Header>
                        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <span>{new Date(article.postedDate).toLocaleDateString()}</span>
                          <span>By: {article.authorName}</span>
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <h5>{article.title}</h5>
                        <p>{article.content}</p>
                        <div>
                          <strong>Likes:</strong> {article.likesCount}
                          <Button variant="link" onClick={() => handleLike(article.articleId)} className='like-button'>
                            <img 
                              src={likedArticles.includes(article.articleId) ? likedIcon : likeIcon}
                              alt="Like"
                              style={{ width: '20px' }}
                              className='like-fade-transition'
                            />
                          </Button>
                        </div>
                        <div>
                        <Button variant="light" size='sm' onClick={() => toggleComments(article.articleId)}>
                          {expandedComments.includes(article.articleId) ? 'Hide comments' : 'Show comments'}
                        </Button>
                        {expandedComments.includes(article.articleId) && (
                          <div>
                            {article.comments.length > 0 ? (
                              article.comments.map(comment => {
                                // Use the base64 string for the image source
                                const commenterPhotoSrc = comment.commenterPhotoData
                                  ? `data:${comment.commenterPhotoMimeType};base64,${comment.commenterPhotoData}`
                                  : '../images/stockProfiles/default.jpg'; // Fallback to a default image if no photo data 

                                return (
                                  <div key={comment.commentId} className="comment-section">
                                    <Image
                                      src={commenterPhotoSrc}
                                      roundedCircle
                                      style={{ width: '40px', height: '40px', marginRight: '10px' }}
                                    />
                                    <div>
                                      <strong>{comment.commenterName === user.userName ? 'You' : comment.commenterName}</strong>
                                      <p>{comment.content}</p>
                                    </div>
                                  </div>
                                );
                              })
                            ) : (
                              <p>No comments yet.</p>
                            )}
                          </div>
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
                  ))}
                  {articlesToShow < articles.length && (
                    <Button variant="primary" onClick={loadMoreArticles}>
                    {loadingMoreArticles ? (
                      <>
                      <Spinner animation="border" size="sm" /> Loading...
                      </>) : ('Load more...')}
                    </Button>
                  )}
                </>
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