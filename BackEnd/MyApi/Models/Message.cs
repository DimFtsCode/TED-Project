namespace MyApi.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string? Text { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public int SenderId { get; set; } 
        public string? SenderName { get; set; }  
        public int DiscussionId { get; set; }  

        public List<MessageReadStatus> ReadStatuses { get; set; } = new List<MessageReadStatus>();
    }
}
