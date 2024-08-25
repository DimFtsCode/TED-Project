namespace MyApi.DTOs
{
    public class CommentDto
    {
        public int CommentId { get; set; }
        public string? Content { get; set; }
        public DateTime PostedDate { get; set; }
        public string? CommenterName { get; set; }
        public byte[]? CommenterPhotoData { get; set; }
        public string? CommenterPhotoMimeType { get; set; }
    }
}