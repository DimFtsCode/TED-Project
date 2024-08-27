namespace MyApi.Models
{
    public class NoteOfInterest
    {
        public int Id { get; set; }
        public int UserId { get; set; } // The user who will receive the noitfication 
        public User? User { get; set; } // Navigation property to User
        public string? Content { get; set; }
        public DateTime CreatedAt { get; set; }
        public bool IsRead { get; set; } // To track if the notification is read

    }
}
