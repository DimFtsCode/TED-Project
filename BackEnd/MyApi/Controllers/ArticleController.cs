using Microsoft.AspNetCore.Mvc;
using MyApi.Models;
using MyApi.DTOs;
using MyApi.Services;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticleController : ControllerBase
    {
        private readonly ArticleService _articleService;

        public ArticleController(ArticleService articleService)
        {
            _articleService = articleService;
        }

        // Get all articles \
        [HttpGet]
        public IActionResult GetAllArticles()
        {
            List<ArticleDto> articles = _articleService.GetAllArticles();
            return Ok(articles);
        }

        // Get article by id
        [HttpGet("{id}")]
        public IActionResult GetArticleById(int id)
        {
            ArticleDto? article = _articleService.GetArticleById(id);
            if (article == null) return NotFound();
            return Ok(article);
        }

        [HttpPost]
        public IActionResult CreateArticle([FromForm] IFormCollection form)
        {
            // Extract form data
            string title = form["Title"].FirstOrDefault() ?? string.Empty;
            string content = form["Content"].FirstOrDefault() ?? string.Empty;
            if (!int.TryParse(form["AuthorId"].FirstOrDefault(), out int authorId))
            {
                return BadRequest("Invalid author ID");
            }

            // Extract files (photo and video)
            IFormFile? photo = form.Files.GetFile("Photo");
            IFormFile? video = form.Files.GetFile("Video");

            // Prepare the article object
            var article = new Article
            {
                Title = title,
                Content = content,
                PostedDate = DateTime.Now,
                AuthorId = authorId,
            };

            // Process the photo if provided
            if (photo != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    photo.CopyTo(memoryStream);
                    article.PhotoData = memoryStream.ToArray();
                    article.PhotoMimeType = photo.ContentType;
                }
            }

            // Process the video if provided
            if (video != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    video.CopyTo(memoryStream);
                    article.VideoData = memoryStream.ToArray();
                    article.VideoMimeType = video.ContentType;
                }
            }

            // Save the article using the service
            var createdArticle = _articleService.CreateArticle(article);

            // Convert the created article back to a DTO to return it in the response
            var createdArticleDto = new ArticleDto
            {
                ArticleId = createdArticle.ArticleId,
                Title = createdArticle.Title,
                Content = createdArticle.Content,
                PostedDate = createdArticle.PostedDate,
                AuthorId = createdArticle.AuthorId, // Send back author ID
                PhotoData = createdArticle.PhotoData,
                PhotoMimeType = createdArticle.PhotoMimeType,
                VideoData = createdArticle.VideoData,
                VideoMimeType = createdArticle.VideoMimeType,
                LikesCount = 0, // New article, so no likes yet
                Comments = new List<CommentDto>() // New article, so no comments yet
            };

            return Ok(createdArticleDto);
        }
            
        

        // Add a like to an article 
        [HttpPost("{id}/like")]
        public IActionResult LikeArticle(int id, [FromBody] LikeRequest likeRequest)
        {
            var result = _articleService.LikeArticle(id, likeRequest.UserId);
            if (!result) return NotFound();
            return Ok();
        }

        // Remove a like from an article
        [HttpPost("{id}/unlike")]
        public IActionResult UnlikeArticle(int id, LikeRequest likeRequest)
        {
            var result = _articleService.UnlikeArticle(id, likeRequest.UserId);
            if (!result) return NotFound();
            return Ok();
        }
        public class LikeRequest
        {
            public int UserId { get; set; }
        }

        // Get liked articles for a specific user 
        [HttpGet("liked/{userId}")]
        public IActionResult GetLikedArticles(int userId)
        {
            var likedArticleIds = _articleService.GetLikedArticlesByUser(userId);
            return Ok(likedArticleIds);
        }

        // add a comment
        [HttpPost("{id}/comment")]
        public IActionResult AddComment(int id, [FromBody] Comment comment)
        {
            var result = _articleService.AddComment(id, comment);
            if (!result) return NotFound();
            return Ok();
        }
    }
}