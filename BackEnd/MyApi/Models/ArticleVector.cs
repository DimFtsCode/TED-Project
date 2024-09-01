namespace MyApi.Models
{
    public class ArticleVector
    {
        public int ArticleVectorId { get; set; }
        public int ArticleId { get; set; }
        public User? Author { get; set; }   // The author of the article
        public int AuthorId { get; set; }  
        public User? User { get; set; }     // The user who interacted with the article
        public int UserId { get; set; }     
        public int InteractionType { get; set; } // 1: Like, 2: Comment, 3: View
    }
}