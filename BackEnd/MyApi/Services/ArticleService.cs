using MyApi.Data;
using MyApi.Models;
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
        public List<Article> GetAllArticles()
        {
            return _context.Articles
                .Include(a => a.Author)
                .Include(a => a.Likes)
                .Include(a => a.Comments)
                .ThenInclude(c => c.Commenter)
                .ToList();
        }

        // Get article by id
        public Article? GetArticleById(int id)
        {
            return _context.Articles
                .Include(a => a.Author)
                .Include(a => a.Likes)
                .Include(a => a.Comments)
                .ThenInclude(c => c.Commenter)
                .FirstOrDefault(a => a.ArticleId == id);
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
            var article = _context.Articles. FirstOrDefault(a => a.ArticleId == articleId);
            if (article == null) return false;

            var like = new Like { ArticleId = articleId, LikerId= userId };
            _context.Likes.Add(like);
            _context.SaveChanges();
            return true;
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