using Microsoft.AspNetCore.SignalR;
//dotnet add package Microsoft.AspNetCore.SignalR

namespace MyApi.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message, int senderId, int discussionId, List<int> participantIds)
        {
            Console.WriteLine($"ChatHub - Received message: {message}, from user: {user}, senderId: {senderId}, discussionId: {discussionId}");
            foreach (var participantId in participantIds)
            {
                Console.WriteLine($"Sending message to participantId: {participantId}");
                // send to all participants except the sender
                
                await Clients.User(participantId.ToString()).SendAsync("ReceiveMessage",user, message, senderId, discussionId);
            }
            
            // notify the sender that the message was sent
            await Clients.Caller.SendAsync("MessageSent", message);
        }

        public async Task SendFriendRequestNotification(int recipientUserId)
        {
            // send a notification to the recipient
            await Clients.User(recipientUserId.ToString()).SendAsync("ReceveFriendReqeust", recipientUserId);
        }
        public async Task PingHub()
        {
            Console.WriteLine("PingHub method called");
            await Clients.Caller.SendAsync("Pong", "Ping received");
        }

    }
}
