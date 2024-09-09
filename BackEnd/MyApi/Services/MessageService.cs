using MyApi.Data;
using MyApi.Models;
using Microsoft.AspNetCore.SignalR;
using MyApi.Hubs;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;

namespace MyApi.Services
{
    public class MessageService
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<ChatHub> _chatHubContext;

        public MessageService(AppDbContext context, IHubContext<ChatHub> chatHubContext)
        {
            _context = context;
            _chatHubContext = chatHubContext;
        }

        public bool MarkMessagesAsRead(int discussionId, int userId)
        {
            var messages = _context.Messages
                .Where(m => m.DiscussionId == discussionId)
                .Include(m => m.ReadStatuses)
                .ToList();

            bool anyUpdated = false;

            foreach (var message in messages)
            {
                var readStatus = message.ReadStatuses.FirstOrDefault(rs => rs.UserId == userId);
                if (readStatus != null && !readStatus.IsRead)
                {
                    readStatus.IsRead = true;
                    anyUpdated = true;
                }
            }

            if (anyUpdated)
            {
                _context.SaveChanges();
            }

            return anyUpdated;
        }

        public async Task<Message> SendMessage(Message message)
        {
            // Check if the sender exists
            var sender = _context.Users.FirstOrDefault(u => u.UserId == message.SenderId);
            if (sender == null)
            {
                throw new InvalidOperationException("Sender does not exist.");
            }

            // Check if the discussion exists
            var discussion = _context.Discussions.FirstOrDefault(d => d.Id == message.DiscussionId);
            if (discussion == null)
            {
                throw new InvalidOperationException("Discussion does not exist.");
            }

            // Add the sender's name to the message
            message.SenderName = $"{sender.FirstName} {sender.LastName}";

            // Add and save the message
            _context.Messages.Add(message);
            discussion.Messages.Add(message);
            _context.Discussions.Update(discussion);
            _context.SaveChanges();

            // Send the message to all connected clients using SignalR
            await _chatHubContext.Clients.All.SendAsync("ReceiveMessage", message.SenderName, message.Text, message.SenderId, message.DiscussionId);

            return message;
        }
    }
}
