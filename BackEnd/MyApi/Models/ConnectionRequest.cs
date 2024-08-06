using MyApi.Models; // Προσθήκη της οδηγίας using


public class ConnectionRequest
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    public User Sender { get; set; } = null!; // Χρήση null-forgiving operator
    public int ReceiverId { get; set; }
    public User Receiver { get; set; } = null!; // Χρήση null-forgiving operator
    public bool IsAccepted { get; set; }
    public DateTime RequestDate { get; set; }
}
