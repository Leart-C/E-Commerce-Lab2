using System.ComponentModel.DataAnnotations;

//Output
namespace backend.Core.Dtos.ChatMessage
{
        public class ChatMessageDto
        {
        public int Id { get; set; }
        public string SenderId { get; set; } 
        public string ReceiverId { get; set; } 
        public string Message { get; set; } 
        public bool IsRead { get; set; } 
        public DateTime Timestampt { get; set; } 
        public string SenderUsername { get; set; }
        public string ReceiverUsername { get; set; }
    }
}
