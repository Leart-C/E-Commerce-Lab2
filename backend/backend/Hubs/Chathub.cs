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

        //// ✅ Metoda për "Typing..."
        //public async Task Typing(string receiverId)
        //{
        //    var senderId = Context.UserIdentifier;
        //    if (!string.IsNullOrEmpty(senderId))
        //    {
        //        await Clients.User(receiverId).SendAsync("UserTyping", senderId);
        //    }
        //}

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