import React, { useEffect, useState, useContext } from 'react';
import { Container, Row, Col, Card, Button, Form, Spinner, Image, Modal } from 'react-bootstrap';
import axios from 'axios';
import { UserContext } from '../../UserContext';
import likeIcon from '../../images/like.svg';
import likedIcon from '../../images/liked.svg';
import './UserArticles.css';

const UserArticles = () => {
  const [articles, setArticles] = useState([]);
  const { user } = useContext(UserContext);
  const [initialLoading, setInitialLoading] = useState(true); // for the initial spinner
  const [likedArticles, setLikedArticles] = useState([]); // Track the liked articles.
  const [articlesToShow, setArticlesToShow] = useState(5); // Track the articles to show on the page
  const [loadingMoreArticles, setLoadingMoreArticles] = useState(false); // Track the loading state for the "Load more" button
  const [expandedComments, setExpandedComments] = useState([]); // Track the expanded comments for each article
  const [showModal, setShowModal] = useState(false);
  const [modalImageSrc, setModalImageSrc] = useState(''); // Store the image to be shown in the modal
  const [showArticleModal, setShowArticleModal] = useState(false);
  const [modalArticle, setModalArticle] = useState(null); // Store the article to be shown in the article modal
  const [pageNumber, setPageNumber] = useState(1); // track the current page number

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const recommendedArticlesResponse = await axios.get(`https://localhost:7176/api/articlevector/recommendations/${user.userId}?pageNumber=${pageNumber}&pageSize=5`);
        
        if (recommendedArticlesResponse.data && recommendedArticlesResponse.data.length > 0) {
          //setArticles(recommendedArticlesResponse.data);
          setArticles(prevArticles => pageNumber === 1 ? recommendedArticlesResponse.data : [...prevArticles, ...recommendedArticlesResponse.data]);
          setInitialLoading(false);
          setLoadingMoreArticles(false);
          console.log("First fetch: ", recommendedArticlesResponse.data[3]);
          console.log("bringing ", recommendedArticlesResponse.data.length, " articles");
        } else {
          fetchRegularArticles();
        }
      } catch (error) {
        console.error('Error fetching recommendations, falling back to regular articles:', error);
        fetchRegularArticles();
      }
    };

    const fetchRegularArticles = async () => {
      try {
        const regularArticlesResponse = await axios.get(`https://localhost:7176/api/article?pageNumber=${pageNumber}&pageSize=5`);
        const sortedArticles = regularArticlesResponse.data.sort((a, b) => new Date(b.postedDate) - new Date(a.postedDate));
        setArticles(prevArticles => pageNumber === 1 ? sortedArticles : [...prevArticles, ...sortedArticles]);
      } catch (error) {
        console.error('Error fetching regular articles:', error);
      } finally {
        setInitialLoading(false);
        setLoadingMoreArticles(false);
      }
    };

    const fetchLikedArticles = async () => {
      try {
        const likedArticlesResponse = await axios.get(`https://localhost:7176/api/article/liked/${user.userId}`);
        setLikedArticles(likedArticlesResponse.data);
      } catch (error) {
        console.error('Error fetching liked articles:', error);
      }
    };

    fetchLikedArticles();
    fetchArticles();
  }, [user, pageNumber]);

  const handleLike = async (articleId) => {
    const articleIndex = articles.findIndex(article => article.articleId === articleId);
    if (articleIndex === -1) return;
  
    const alreadyLiked = likedArticles.includes(articleId);
    try {
      if (alreadyLiked) {
        // Unlike the article
        await axios.post(`https://localhost:7176/api/article/${articleId}/unlike`, { userId: user.userId });
        
        // Update the liked state after the unlike request
        setLikedArticles(prevLikedArticles => prevLikedArticles.filter(id => id !== articleId));
        // Decrement the like count for the article
        setArticles(prevArticles => {
          const updatedArticles = [...prevArticles];
          updatedArticles[articleIndex] = {
            ...updatedArticles[articleIndex],
            likesCount: updatedArticles[articleIndex].likesCount - 1
          };
          return updatedArticles;
        });

        // Send a request to the backend to record the interaction
        await axios.delete(`https://localhost:7176/api/articlevector/delete/${articleId}/${user.userId}`); // delete the like interaction
      } else {
        // Like the article
        await axios.post(`https://localhost:7176/api/article/${articleId}/like`, { userId: user.userId });
        
        // Update the liked state after the like request
        setLikedArticles(prevLikedArticles => [...prevLikedArticles, articleId]);
        // Increment the like count for the article
        setArticles(prevArticles => {
          const updatedArticles = [...prevArticles];
          updatedArticles[articleIndex] = {
            ...updatedArticles[articleIndex],
            likesCount: updatedArticles[articleIndex].likesCount + 1
          };
          return updatedArticles;
        });

        // Send a request to the backend to record the interaction
        await axios.post('https://localhost:7176/api/articlevector', {
          articleId: articleId,
          authorId: articles[articleIndex].authorId,
          userId: user.userId,
          interactionType: 1, // 1 represents a "like"
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
      // fetch the updated article with the new comments
      const response = await axios.get(`https://localhost:7176/api/article/${articleId}`);
      const updatedArticle = response.data;
      
      // Update the local articles state
      setArticles(prevArticles => {
        const updatedArticles = [...prevArticles];
        updatedArticles[articleIndex] = updatedArticle;
        return updatedArticles;
      });
      // Expand the comments section after posting a commnent
      if (!expandedComments.includes(articleId)) {
        setExpandedComments(prevExpanded => [...prevExpanded, articleId]);
      }

      // Send a request to the backend to record the interaction
      await axios.post('https://localhost:7176/api/articlevector', {
        articleId: articleId,
        authorId: articles[articleIndex].authorId,
        userId: user.userId,
        interactionType: 2, // 2 represents a "comment"
      });
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
    );
  };

  const loadMoreArticles = () => {
    setLoadingMoreArticles(true);
  };

  // simulate loading more articles 
  useEffect(() => {
    if (loadingMoreArticles) {
      setTimeout(() => {
        setPageNumber(prevPageNumber => prevPageNumber + 1);
        setArticlesToShow(prevArticlesToShow => prevArticlesToShow + 5); // load 5 more articles
        setLoadingMoreArticles(false);
      }, 1000);
    }
  }, [loadingMoreArticles]);


  const handleViewArticle = async (article) => {
    setModalArticle(article);
    setShowArticleModal(true);

    try {
      await axios.post('https://localhost:7176/api/articlevector', {
        articleId: article.articleId,
        authorId: article.authorId,
        userId: user.userId,
        interactionType: 3, // 3 represents a "view"
      });
    } catch (error) {
      console.error('Error recording article view:', error);
    }
  };

  const handleImageClick = (imageSrc) => {
    setModalImageSrc(imageSrc);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setModalImageSrc('');
  };

  const handleCloseArticleModal = () => {
    setShowArticleModal(false);
    setModalArticle(null);
  };

  return (
    <>
      <Container fluid>
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
                              <span>By: {article.authorId === user.userId ? 'Me' : article.authorName}</span>
                            </div>
                          </Card.Header>
                          <Card.Body>
                            <h5>{article.title}</h5>
                            <p>{article.content.slice(0, 100)}...</p>
                            {/* Display the multimedia content if available */}
                            <Row>
                            {article.photoData && (
                              <Col md={6}>
                              <Image 
                                src={`data:${article.photoMimeType};base64,${article.photoData}`}
                                alt='Article Photo'
                                fluid
                                className='restricted-media'
                                onClick={() => handleImageClick(`data:${article.photoMimeType};base64,${article.photoData}`)}
                                  style={{ cursor: 'pointer' }} 
                                /> 
                              </Col>
                            )}
                            </Row>
                            <Row>
                            {article.videoData && (
                              <Col md={6}>
                              <video controls className='restricted-media'>
                                <source src={`data:${article.videoMimeType};base64,${article.videoData}`} type={article.videoMimeType} />
                                Your browser does not support the video tag.
                                </video>
                              </Col>
                            )}
                            </Row>
                            <Button variant="light" onClick={() => handleViewArticle(article)}>View</Button>
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
                                {expandedComments.includes(article.articleId) ? 'Hide comments' : 'Show comments' + ` (${article.comments.length})`}
                              </Button>
                              {expandedComments.includes(article.articleId) && (
                                <div>
                                  {article.comments.length > 0 ? (
                                    article.comments.map(comment => {
                                      const commenterPhotoSrc = comment.commenterPhotoData
                                        ? `data:${comment.commenterPhotoMimeType};base64,${comment.commenterPhotoData}`
                                        : '../images/stockProfiles/default.jpg';

                                      return (
                                        <div key={comment.commentId} className="comment-section">
                                          <Image
                                            src={commenterPhotoSrc}
                                            roundedCircle
                                            style={{ width: '40px', height: '40px', marginRight: '10px' }}
                                          />
                                          <div>
                                            <strong>{comment.commenterName == (user.firstName + " " + user.lastName) ? 'Me' : comment.commenterName}</strong>
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
                      <Button variant="primary" onClick={loadMoreArticles}>
                        {loadingMoreArticles ? (
                          <>
                            <Spinner animation="border" size="sm" /> Loading...
                          </>
                        ) : ('Load more...')}
                      </Button>
                    </>
                  ) : (
                    <p>No articles found.</p>
                  )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal for displaying images */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Body>
          <Image src={modalImageSrc} alt='Full Size Image' fluid />
        </Modal.Body>
      </Modal>

      {/* Modal for displaying the full article */}
      <Modal show={showArticleModal} onHide={handleCloseArticleModal} centered>
        <Modal.Header closeButton>
          {modalArticle && (
          <Modal.Title>Article by {modalArticle.authorId === user.userId ? 'Me' : modalArticle.authorName}</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          {modalArticle && (
            <>
              <h5>{modalArticle.title}</h5>
              <p>{modalArticle.content}</p>
              <Row>
                {modalArticle.photoData && (
                  <Col md={6}>
                  <Image 
                    src={`data:${modalArticle.photoMimeType};base64,${modalArticle.photoData}`}
                    alt='Article Photo'
                    fluid
                    className='restricted-media'
                    onClick={() => handleImageClick(`data:${modalArticle.photoMimeType};base64,${modalArticle.photoData}`)}
                      style={{ cursor: 'pointer' }} 
                    /> 
                  </Col>
                )}
                </Row>
                <Row>
                {modalArticle.videoData && (
                  <Col md={6}>
                  <video controls className='restricted-media'>
                    <source src={`data:${modalArticle.videoMimeType};base64,${modalArticle.videoData}`} type={modalArticle.videoMimeType} />
                    Your browser does not support the video tag.
                    </video>
                  </Col>
                )}
               </Row>
            </>
          )}
        </Modal.Body>
      </Modal>
    </>
  );
};

export default UserArticles;