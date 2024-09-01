using MyApi.Data;
using MyApi.Models;
using MyApi.DTOs;
using MyApi.Utilities; // for the MatrixFactorization class
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;

namespace MyApi.Services
{
    public class ArticleVectorService
    {
        private readonly AppDbContext _context;
        private readonly IMemoryCache _cache;

        public ArticleVectorService(AppDbContext context, IMemoryCache cache)
        {
            _context = context;
            _cache = cache;
        }

        public bool AddArticleVector(ArticleVector vector)
        {
            var user =  _context.Users
                            .Include(u => u.ArticleVectors)
                            .FirstOrDefault(u => u.UserId == vector.UserId);
            
            if (user == null) return false;

            user.ArticleVectors.Add(vector);
            _context.SaveChanges();

            ClearCache(vector.UserId);
            return true;
        }

        public bool RemoveArticleVector(int articleId, int userId)
        {
            var vector = _context.ArticleVectors
                            .FirstOrDefault(v => v.UserId == userId && v.ArticleId == articleId && v.InteractionType == 1); // Like
            
            if (vector == null) return false;

            // if (vector.InteractionType != 1){
            //     Console.WriteLine("Only likes can be removed.");
            //     return false;
            // }

            _context.ArticleVectors.Remove(vector);
            _context.SaveChanges();

            ClearCache(userId);
            return true;
        }

        public List<ArticleDto> GetRecommendedArticles(int userId)
        {
            // Define a cache key for the user's recommendations
            string cacheKey = $"UserRecommendations_{userId}";

            // Check if the recommendations are already cached
            if (!_cache.TryGetValue(cacheKey, out List<ArticleDto>? recommendedArticles) || recommendedArticles == null)
            {
                // If not cached, calculate the recommendations
                recommendedArticles = CalculateRecommendations(userId);

                // Cache the recommendations with a sliding expiration (e.g., 1 hour)
                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetSlidingExpiration(TimeSpan.FromHours(1));

                _cache.Set(cacheKey, recommendedArticles, cacheEntryOptions);
            }

            return recommendedArticles;
        }

        public void ClearCache(int userId)
        {
            string cacheKey = $"UserRecommendations_{userId}";
            _cache.Remove(cacheKey);
        }


        public List<ArticleDto> CalculateRecommendations(int userId)
        {   
            // load the article vectors for the user
            var interactionVectors = _context.ArticleVectors
                                        .Where(v => v.UserId == userId)
                                        .ToList();    
            if (interactionVectors.Count < 15) return new List<ArticleDto>();
            
            // load all articles
            Console.WriteLine("Loading articles...");
            var articles = _context.Articles
                                .Include(a => a.Author)
                                .Include(a => a.Likes)
                                .Include(a => a.Comments)
                                .ThenInclude(c => c.Commenter)
                                .AsSplitQuery() // user query splitting to reduce the time it takes to load the articles
                                .ToList();
            if (articles.Count == 0) return new List<ArticleDto>();

            int numItems = articles.Count;
            double[,] ratings = new double[1, numItems];

            for (int i = 0; i < numItems; i++)
            {
                var article = articles[i];
                double totalCommonFeatures = 0;

                foreach (var vector in interactionVectors)
                {
                    totalCommonFeatures += CalculateCommonFeatures(article, vector);
                }

                ratings[0, i] = totalCommonFeatures;
            }

            // Normalize the ratings
            double maxScore = ratings.Cast<double>().Max();
            if (maxScore > 0)
            {
                for (int i = 0; i < numItems; i++)
                {
                    ratings[0, i] /= maxScore;
                }
            }

            int numLatentFeatures = 10;
            double learningRate = 0.01;
            double regularization = 0.1;
            int numIterations = 5000;
            var mf = new MatrixFactorization(1, numItems, numLatentFeatures, learningRate, regularization, numIterations); 

            mf.Train(ratings);

            var predictedRatings = mf.GetPredictedRatings();

            var recommededArticles = articles
                .Select((article, index) => new { Article = article, Rating = predictedRatings[0, index] })
                .OrderByDescending(a => a.Rating)
                .Take(50) // return the top 50 recommended articles
                .Select(x => new ArticleDto
                {
                    ArticleId = x.Article.ArticleId,
                    Title = x.Article.Title,
                    Content = x.Article.Content,
                    PostedDate = x.Article.PostedDate,
                    AuthorId = x.Article.AuthorId,
                    AuthorName = x.Article.Author != null ? x.Article.Author.FirstName + " " + x.Article.Author.LastName : "Unknown",
                    PhotoData = x.Article.PhotoData,
                    PhotoMimeType = x.Article.PhotoMimeType,
                    VideoData = x.Article.VideoData,
                    VideoMimeType = x.Article.VideoMimeType,
                    LikesCount = x.Article.Likes.Count,
                    Comments = x.Article.Comments.Select(c => new CommentDto
                    {
                        CommentId = c.CommentId,
                        Content = c.Content,
                        PostedDate = c.PostedDate,
                        CommenterName = c.Commenter != null ? c.Commenter.FirstName + " " + c.Commenter.LastName : "Anonymous",
                        CommenterPhotoData = c.Commenter != null ? c.Commenter.PhotoData : null,
                        CommenterPhotoMimeType = c.Commenter != null ? c.Commenter.PhotoMimeType : null
                    }).ToList()
                })
                .ToList();

            return recommededArticles;     
        }

        private double CalculateCommonFeatures(Article article, ArticleVector vector)
        {
            double commonFeatures = 0;

            if (article.AuthorId == vector.AuthorId) commonFeatures += 1.0;
            if (vector.InteractionType == 1) commonFeatures += 1.0; // Like
            if (vector.InteractionType == 2) commonFeatures += 2.0; // Comment (the strongest form of interaction)
            if (vector.InteractionType == 3) commonFeatures += 0.5; // View

            return commonFeatures;
        }
    }
}