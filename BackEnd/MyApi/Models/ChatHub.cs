using Microsoft.AspNetCore.SignalR;
//dotnet add package Microsoft.AspNetCore.SignalR

namespace MyApi.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message, int senderId, int discussionId, List<int> participantIds)
        {
            foreach (var participantId in participantIds)
            {
                // send to all participants except the sender
                await Clients.User(participantId.ToString()).SendAsync("ReceiveMessage",user, message, senderId, discussionId);
            }
            
            // notify the sender that the message was sent
            await Clients.Caller.SendAsync("MessageSent", message);
        }

        public async Task SendFriendRequestNotification(int recipientUserId)
        {
            // send a notification to the recipient
            await Clients.User(recipientUserId.ToString()).SendAsync("ReceiveFriendRequest", recipientUserId);
        }

        public async Task SendNoteOfInterestNotification(int recipientUserId)
        {
            // send a notification to the recipient
            await Clients.User(recipientUserId.ToString()).SendAsync("ReceiveNoteOfInterest", recipientUserId);
        }
        public async Task PingHub()
        {
            Console.WriteLine("PingHub method called");
            await Clients.Caller.SendAsync("Pong", "Ping received");
        }

    }
}
