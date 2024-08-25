using MyApi.Data;
using MyApi.Models;
using MyApi.DTOs;
using Microsoft.EntityFrameworkCore;

namespace MyApi.Services
{
    public class ArticleService
    {
        private readonly AppDbContext _context;
        
        public ArticleService(AppDbContext context)
        {
            _context = context;
        }

        // Get all articles
        public List<ArticleDto> GetAllArticles()
        {
            return _context.Articles
                .Include(a => a.Author)
                .Include(a => a.Likes)
                .Include(a => a.Comments)
                .ThenInclude(c => c.Commenter)
                .Select(a => new ArticleDto
                {
                    ArticleId = a.ArticleId,
                    Title = a.Title,
                    Content = a.Content,
                    PostedDate = a.PostedDate,
                    AuthorName = a.Author != null? a.Author.FirstName + " " + a.Author.LastName : "Unknown",
                    LikesCount = a.Likes.Count,
                    Comments = a.Comments.Select(static c => new CommentDto
                    {
                        CommentId = c.CommentId,
                        Content = c.Content,
                        PostedDate = c.PostedDate,
                        CommenterName = c.Commenter != null? c.Commenter.FirstName + " " + c.Commenter.LastName : "Anonymous",
                        CommenterPhotoData = c.Commenter != null ? c.Commenter.PhotoData : null,
                        CommenterPhotoMimeType = c.Commenter != null ? c.Commenter.PhotoMimeType : null
                    }).ToList()
                }).ToList();
        }

        // Get article by id
        public ArticleDto? GetArticleById(int id)
        {
            var article = _context.Articles
                .Include(a => a.Author)
                .Include(a => a.Likes)
                .Include(a => a.Comments)
                .ThenInclude(c => c.Commenter)
                .FirstOrDefault(a => a.ArticleId == id);

            if (article == null) return null;

            return new ArticleDto
            {
                ArticleId = article.ArticleId,
                Title = article.Title,
                Content = article.Content,
                PostedDate = article.PostedDate,
                AuthorName = article.Author != null ? article.Author.FirstName + " " + article.Author.LastName : "Unknown",
                LikesCount = article.Likes.Count,
                Comments = article.Comments.Select(c => new CommentDto
                {
                    CommentId = c.CommentId,
                    Content = c.Content,
                    PostedDate = c.PostedDate,
                    CommenterName = c.Commenter != null ? c.Commenter.FirstName + " " + c.Commenter.LastName : "Anonymous",
                    CommenterPhotoData = c.Commenter != null ? c.Commenter.PhotoData : null,
                    CommenterPhotoMimeType = c.Commenter != null ? c.Commenter.PhotoMimeType : null
                }).ToList()
            };
        }

        // Create new article
        public Article CreateArticle(Article article)
        {
            _context.Articles.Add(article);
            _context.SaveChanges();
            return article;
        }

        // Like an article
        public bool LikeArticle(int articleId, int userId)
        {
            var article = _context.Articles.FirstOrDefault(a => a.ArticleId == articleId);
            if (article == null) return false;

            // Check if the user has already liked this article
            var existingLike = _context.Likes.FirstOrDefault(l => l.ArticleId == articleId && l.LikerId == userId);
            if (existingLike != null) return false; // User has already liked the article

            var like = new Like { ArticleId = articleId, LikerId = userId };
            _context.Likes.Add(like);
            _context.SaveChanges();
            return true;
        }

        // Unlike an article
        public bool UnlikeArticle(int articleId, int userId)
        {
            var like = _context.Likes.FirstOrDefault(l => l.ArticleId == articleId && l.LikerId == userId);
            if (like == null) return false;

            _context.Likes.Remove(like);
            _context.SaveChanges();
            return true;
        }

        // Get the liked articles by a certain user
        public List<int>GetLikedArticlesByUser(int userId)
        {
            return _context.Likes
                .Where(like => like.LikerId == userId)
                .Select(like => like.ArticleId)
                .ToList();
        }

        // Add a comment to an article
        public bool AddComment(int articleId, Comment comment)
        {
            var article = _context.Articles.FirstOrDefault(a => a.ArticleId == articleId);
            if (article == null) return false;

            comment.ArticleId = articleId;
            _context.Comments.Add(comment);
            _context.SaveChanges();
            return true;
        }
    }
}