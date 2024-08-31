using MyApi.Data;
using MyApi.Models;
using MyApi.DTOs;
using MyApi.Hubs;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.SignalR;

namespace MyApi.Services
{
    public class ArticleService
    {
        private readonly AppDbContext _context;

        private readonly IHubContext<ChatHub> _chatHubContext;
        
        public ArticleService(AppDbContext context, IHubContext<ChatHub> chatHubContext)
        {
            _context = context;
            _chatHubContext = chatHubContext;
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
                    AuthorId = a.AuthorId,
                    AuthorName = a.Author != null? a.Author.FirstName + " " + a.Author.LastName : "Unknown",
                    PhotoData = a.PhotoData,
                    PhotoMimeType = a.PhotoMimeType,
                    VideoData = a.VideoData,
                    VideoMimeType = a.VideoMimeType,
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
                AuthorId = article.AuthorId,
                AuthorName = article.Author != null ? article.Author.FirstName + " " + article.Author.LastName : "Unknown",
                PhotoData = article.PhotoData,
                PhotoMimeType = article.PhotoMimeType,
                VideoData = article.VideoData,
                VideoMimeType = article.VideoMimeType,
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
        public async Task<bool> LikeArticleAsync(int articleId, int userId)
        {
            var article = _context.Articles.FirstOrDefault(a => a.ArticleId == articleId);
            if (article == null) return false;

            // Check if the user has already liked this article
            var existingLike = _context.Likes.FirstOrDefault(l => l.ArticleId == articleId && l.LikerId == userId);
            if (existingLike != null) return false; // User has already liked the article

            var like = new Like { ArticleId = articleId, LikerId = userId };
            _context.Likes.Add(like);
            
            // Create a notification (NoteOfInterest) for the article author
            var liker = _context.Users.FirstOrDefault(u => u.UserId == userId);
            var noteOfInterest = new NoteOfInterest
            {
                UserId = article.AuthorId,
                Content = $"{liker?.FirstName} {liker?.LastName} liked your article '{article.Title}'",
                CreatedAt = DateTime.Now,
                IsRead = false
            };
            _context.NotesOfInterest.Add(noteOfInterest);
            await _context.SaveChangesAsync();
            
            // Notify the article author
            await _chatHubContext.Clients.All.SendAsync("ReceiveNoteOfInterest", article.AuthorId);
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