using MyApi.Data;
using MyApi.Models;
using Microsoft.AspNetCore.SignalR;
using MyApi.Hubs;
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

        public async Task<Message> SendMessage(Message message)
        {
            // Έλεγχος εάν ο αποστολέας υπάρχει
            var sender = _context.Users.FirstOrDefault(u => u.UserId == message.SenderId);
            if (sender == null)
            {
                throw new InvalidOperationException("Sender does not exist.");
            }

            // Έλεγχος εάν η συζήτηση υπάρχει
            var discussion = _context.Discussions.FirstOrDefault(d => d.Id == message.DiscussionId);
            if (discussion == null)
            {
                throw new InvalidOperationException("Discussion does not exist.");
            }

            // Προσθέτουμε το όνομα του αποστολέα στο μήνυμα
            message.SenderName = $"{sender.FirstName} {sender.LastName}";

            // Προσθήκη και αποθήκευση του μηνύματος
            _context.Messages.Add(message);
            discussion.Messages.Add(message);
            _context.Discussions.Update(discussion);
            _context.SaveChanges();

            // Αποστολή του μηνύματος σε όλους τους συνδεδεμένους clients μέσω SignalR
            await _chatHubContext.Clients.All.SendAsync("ReceiveMessage", message.SenderName, message.Text, message.SenderId);

            return message;
        }
    }
}
