using backend.Core.Dtos.ChatMessage;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace backend.Hubs
{
    public class Chathub : Hub
    {
        public async Task SendMessage(ChatMessageDto messageDto)
        {
            await Clients.All.SendAsync("ReceiveMessage", messageDto);
        }

        public override async Task OnConnectedAsync()
        {
            await base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {

            await base.OnDisconnectedAsync(exception);
        }
    }
}