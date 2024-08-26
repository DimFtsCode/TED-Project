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

        // Create a new article
        [HttpPost]
        public IActionResult CreateArticle([FromBody] Article article)
        {
            var createdArticle = _articleService.CreateArticle(article);
            return CreatedAtAction(nameof(GetArticleById), new { id = createdArticle.ArticleId }, createdArticle);
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