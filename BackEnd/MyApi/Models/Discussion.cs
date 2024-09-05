namespace MyApi.Models
{
    public class Discussion
    {
        public int Id { get; set; }
        public string? Title { get; set; }

        // Simple list of User IDs instead of UserDiscussion objects
        public List<int> Participants { get; set; } = new List<int>();

        // One-to-Many relationship with Message
        public List<Message> Messages { get; set; } = new List<Message>();
    }
}
