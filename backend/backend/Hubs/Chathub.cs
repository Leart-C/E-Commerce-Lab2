using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace backend.Hubs 
{
    public class Chathub : Hub
    {
        // This is a simple example.
        // You can add methods here that clients can call directly (e.g., SendMessageToAll).
        // But for chat, we'll primarily use the Hub from the controller to push messages.
        public async Task SendMessage(string user, string message)
        {
            // This method could be called by a client to send a message to all.
            // For our chat, we'll push from the Controller to specific users.
            // However, you might use this for "user is typing" notifications.
            await Clients.All.SendAsync("ReceiveMessage", user, message);
        }

        // You can override OnConnectedAsync and OnDisconnectedAsync
        // to track connected users if needed for specific scenarios.
        public override async Task OnConnectedAsync()
        {
            // You could add logic here to track connected user IDs
            // (e.g., map ConnectionId to UserId from Claims)
            // string userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            // Logic for when a client disconnects
            await base.OnDisconnectedAsync(exception);
        }
    }
}