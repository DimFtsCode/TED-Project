using MyApi.Models; // Προσθήκη της οδηγίας using


public class ConnectionRequest
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    public User Sender { get; set; } = null!; 
    public int ReceiverId { get; set; }
    public User Receiver { get; set; } = null!; 
    public bool IsAccepted { get; set; }
    public DateTime RequestDate { get; set; }
}
