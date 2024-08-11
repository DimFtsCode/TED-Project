using Microsoft.AspNetCore.SignalR;
//dotnet add package Microsoft.AspNetCore.SignalR

namespace MyApi.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message, int senderId)
        {
            await Clients.All.SendAsync("ReceiveMessage", user, message, senderId);
        }

    }
}
