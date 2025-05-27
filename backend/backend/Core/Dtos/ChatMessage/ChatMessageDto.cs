using System.ComponentModel.DataAnnotations;

namespace backend.Core.Dtos.ChatMessage
{
        public class ChatMessageDto
        {
            [Required]
            public string SenderId { get; set; }
            public string ReceiverId { get; set; }
            public string Message { get; set; }
        }
}
