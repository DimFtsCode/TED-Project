using System;

namespace MyApi.Models
{
    public class Message
    {
        public int Id { get; set; }
        public string? Text { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;

        public int SenderId { get; set; }  // Μόνο το ID του αποστολέα
        public string? SenderName { get; set; }  // Το όνομα του αποστολέα
        public int DiscussionId { get; set; }  // Μόνο το ID της συζήτησης

        public List<MessageReadStatus> ReadStatuses { get; set; } = new List<MessageReadStatus>();
    }
}
