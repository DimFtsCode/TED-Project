using MyApi.Models;

public class Friendship
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int FriendId { get; set; }
    public User Friend { get; set; } = null!;
    public DateTime FriendshipDate { get; set; }
    public bool IsAccepted { get; set; }
}
