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

            // find the id's of the connected friends of the user
            var connectedFriendsIds = _context.Friendships
                                        .Where(f => f.UserId == userId)
                                        .Select(f => f.FriendId)
                                        .ToList();      

            
            // load all articles
            Console.WriteLine("Loading articles...");
            var articles = _context.Articles
                                    .Include(a => a.Author)
                                    .Include(a => a.Likes)
                                    .Include(a => a.Comments)
                                    .ThenInclude(c => c.Commenter)
                                    .AsSplitQuery()
                                    .ToList();
            if (articles.Count == 0) return new List<ArticleDto>();

            int numItems = articles.Count;
            double[,] ratings = new double[1, numItems];
            List<(Article article, double totalCommonFeatures)> articlesWithCommonFeatures = new List<(Article, double)>();

            for (int i = 0; i < numItems; i++)
            {
                var article = articles[i];
                double totalCommonFeatures = 0;

                foreach (var vector in interactionVectors)
                {
                    totalCommonFeatures += CalculateCommonFeatures(article, vector); // calculate common features based on interactions
                }

                if (connectedFriendsIds.Contains(article.AuthorId)) totalCommonFeatures += 0.5; // Boost articles authored by connected friends
                else totalCommonFeatures += 0.1; // Base value for the rest of the articles

                if (article.AuthorId == userId) totalCommonFeatures += 2.0; // Boost articles authored by the user

                ratings[0, i] = totalCommonFeatures;
                articlesWithCommonFeatures.Add((article, totalCommonFeatures)); // Store common features for writing to file
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

            // write total common featuers and normalized ratings to a file
            WriteCommonFeaturesToFile(articlesWithCommonFeatures, ratings, maxScore);

            int numLatentFeatures = 5;
            double learningRate = 0.01;
            double regularization = 0.05;
            int numIterations = 5000;
            var mf = new MatrixFactorization(1, numItems, numLatentFeatures, learningRate, regularization, numIterations);

            mf.Train(ratings);

            var predictedRatings = mf.GetPredictedRatings();

            var recommendedArticles = articles
                .Select((article, index) => (Article: article, Rating: predictedRatings[0, index]))
                .OrderByDescending(a => a.Rating)
                .Take(50) // return the top 30 recommended articles
                .ToList();

            // Write the recommendations to a file
            WriteRecommendationsToFile(recommendedArticles);

            return recommendedArticles
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
        }
        private double CalculateCommonFeatures(Article article, ArticleVector vector)
        {
            double commonFeatures = 0;

            // Prioritize interactions with the article
            if (article.ArticleId == vector.ArticleId)
            {
                if (vector.InteractionType == 1) commonFeatures += 1.5; // Like
                else if (vector.InteractionType == 2) commonFeatures += 2.0; // Comment (strongest interaction)
                else if (vector.InteractionType == 3) commonFeatures += 1.0; // View
            }

            // Prioritize articles authored by users the user has interacted with
            if (article.AuthorId == vector.AuthorId) commonFeatures += 1.0;
            

            return commonFeatures;
        }
        private void WriteRecommendationsToFile(List<(Article Article, double Rating)> recommendedArticles)
        {
            string filePath = "recommended_articles.txt"; // Define the file path

            using (StreamWriter writer = new StreamWriter(filePath, false)) // false means overwrite the file
            {
                foreach (var article in recommendedArticles)
                {
                    writer.WriteLine($"Rating: {article.Rating}, ArticleId: {article.Article.ArticleId}, AuthorId: {article.Article.AuthorId}, PostedDate: {article.Article.PostedDate}, Title: {article.Article.Title}");
                }
            }
        }

        // New method to write common features and normalized ratings to a file
        private void WriteCommonFeaturesToFile(List<(Article article, double totalCommonFeatures)> articlesWithCommonFeatures, double[,] ratings, double maxScore)
        {
            string filePath = "article_common_features.txt"; // Define the file path
            // Keep the original indices to align with the ratings array
            var indexedArticlesWithCommonFeatures = articlesWithCommonFeatures
                .Select((item, index) => (Article: item.article, TotalCommonFeatures: item.totalCommonFeatures, Index: index))
                .OrderByDescending(x => x.TotalCommonFeatures) // sort by common features
                .ToList();

            using (StreamWriter writer = new StreamWriter(filePath, false)) // false means overwrite the file
            {
                writer.WriteLine("Article Common Features and Normalized Ratings:");
                writer.WriteLine("maxScore: " + maxScore);

                foreach (var articleWithIndex in indexedArticlesWithCommonFeatures)
                {
                    // Use the original index from the unsorted list
                    int originalIndex = articleWithIndex.Index;
                    writer.WriteLine($"ArticleId: {articleWithIndex.Article.ArticleId}, AuthorId: {articleWithIndex.Article.AuthorId}, PostedDate: {articleWithIndex.Article.PostedDate}, Title: {articleWithIndex.Article.Title}, CommonFeatures: {articleWithIndex.TotalCommonFeatures}, Rating: {ratings[0, originalIndex]}");
                }
            }
        }
    }
}