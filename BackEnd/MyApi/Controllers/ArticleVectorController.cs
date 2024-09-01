using Microsoft.AspNetCore.Mvc;
using MyApi.Models;
using MyApi.Services;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/articlevector")]
    public class ArticleVectorController : ControllerBase
    {
        private readonly ArticleVectorService _vectorService;

        public ArticleVectorController(ArticleVectorService vectorService)
        {
            _vectorService = vectorService;
        }

        [HttpPost]
        public IActionResult AddArticleVector([FromBody] ArticleVector vector)
        {
            if (_vectorService.AddArticleVector(vector))
            {
                return Ok(new { Message = "Article vector added successfully." });
            }

            return NotFound(new { Message = "User not found." });
        }

        // Remove article vector
        [HttpDelete("delete/{articleId}/{userId}")]
        public IActionResult RemoveArticleVector(int articleId, int userId)
        {
            if (_vectorService.RemoveArticleVector(articleId, userId))
            {
                return Ok(new { Message = "Article vector removed successfully." });
            }

            return NotFound(new { Message = "Article vector not found." });
        }

        [HttpGet("recommendations/{userId}")]
        public IActionResult GetRecommendedArticles(int userId, int pageNumber = 1, int pageSize = 10)
        {
            var recommendedArticles = _vectorService.GetRecommendedArticles(userId);

            if (recommendedArticles == null || !recommendedArticles.Any())
            {
                return NotFound(new { Message = "No recommendations found for this user." });
            }

            var pagedArticles = recommendedArticles
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(pagedArticles);
        }
    }
}