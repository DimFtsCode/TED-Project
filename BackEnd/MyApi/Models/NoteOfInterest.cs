using MyApi.Models; // Προσθήκη της οδηγίας using


public class NoteOfInterest
{
    public int Id { get; set; }
    public string Content { get; set; } = string.Empty; // Αρχικοποίηση με κενή τιμή
    public int UserId { get; set; }
    public User User { get; set; } = null!; // Χρήση null-forgiving operator
}
