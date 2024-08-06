using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyApi.Models;
using MyApi.Data;

namespace MyApi.Services
{
    public class UserNetworkService
    {
        private readonly AppDbContext _context;

        public UserNetworkService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<User>> SearchUsersAsync(string query)
        {
            return await _context.Users
                .Where(u => (u.FirstName != null && u.FirstName.Contains(query)) ||
                            (u.LastName != null && u.LastName.Contains(query)) ||
                            (u.Email != null && u.Email.Contains(query)))
                .ToListAsync();
        }

        public async Task SendConnectionRequestAsync(int senderId, int receiverId)
        {
            var request = new ConnectionRequest
            {
                SenderId = senderId,
                ReceiverId = receiverId,
                IsAccepted = false,
                RequestDate = DateTime.Now
            };
            _context.ConnectionRequests.Add(request);
            await _context.SaveChangesAsync();
        }

        public async Task AcceptConnectionRequestAsync(int requestId)
        {
            var request = await _context.ConnectionRequests.FindAsync(requestId);
            if (request != null)
            {
                request.IsAccepted = true;
                _context.ConnectionRequests.Update(request);

                var friendship1 = new Friendship
                {
                    UserId = request.SenderId,
                    FriendId = request.ReceiverId,
                    IsAccepted = true,
                    FriendshipDate = DateTime.Now
                };

                var friendship2 = new Friendship
                {
                    UserId = request.ReceiverId,
                    FriendId = request.SenderId,
                    IsAccepted = true,
                    FriendshipDate = DateTime.Now
                };

                _context.Friendships.Add(friendship1);
                _context.Friendships.Add(friendship2);

                await _context.SaveChangesAsync();
            }
        }


        public async Task RejectConnectionRequestAsync(int requestId)
        {
            var request = await _context.ConnectionRequests.FindAsync(requestId);
            if (request != null)
            {
                _context.ConnectionRequests.Remove(request);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<ConnectionRequest>> GetConnectionRequestsAsync(int userId)
        {
            return await _context.ConnectionRequests
                .Include(cr => cr.Sender)
                .Where(cr => cr.ReceiverId == userId && !cr.IsAccepted)
                .ToListAsync();
        }

        public async Task<List<User>> GetFriendsAsync(int userId)
        {
            var friendships = await _context.Friendships
                .Include(f => f.Friend)
                .Where(f => f.UserId == userId && f.IsAccepted)
                .ToListAsync();

            // Εκτύπωση των αποτελεσμάτων για διάγνωση
            foreach (var friendship in friendships)
            {
                Console.WriteLine($"UserId: {friendship.UserId}, FriendId: {friendship.FriendId}, Friend: {friendship.Friend.FirstName} {friendship.Friend.LastName}");
            }

            return friendships.Select(f => f.Friend).ToList();
        }

    }
}
