using Microsoft.AspNetCore.SignalR;
//dotnet add package Microsoft.AspNetCore.SignalR

namespace MyApi.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message, int senderId, List<int> participantIds)
        {
            foreach (var participantId in participantIds)
            {
                // send to all participants except the sender
                await Clients.User(participantId.ToString()).SendAsync("ReceiveMessage",user, message, senderId);
            }
            // await Clients.All.SendAsync("ReceiveMessage", user, message, senderId);
            // notify the sender that the message was sent
            await Clients.Caller.SendAsync("MessageSent", message);
        }

    }
}
