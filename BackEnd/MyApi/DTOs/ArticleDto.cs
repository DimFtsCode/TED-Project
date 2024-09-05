// Data Transfer Object for Articles

namespace MyApi.DTOs
{
    public class ArticleDto
    {
        public int ArticleId { get; set; }
        public string? Title { get; set; }
        public string? Content { get; set; }
        public DateTime PostedDate { get; set; }
        public int AuthorId { get; set; }
        public string? AuthorName { get; set; }
        public byte[]? PhotoData { get; set; }
        public string? PhotoMimeType { get; set; }
        public byte[]? VideoData { get; set; }
        public string? VideoMimeType { get; set; }
        public int LikesCount { get; set; }
        public List<CommentDto>? Comments { get; set; }
    }
}