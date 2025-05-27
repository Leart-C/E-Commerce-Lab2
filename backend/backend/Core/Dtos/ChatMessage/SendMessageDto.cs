using System.ComponentModel.DataAnnotations;

//Input
namespace backend.Core.Dtos.ChatMessage
{
    public class SendMessageDto
    {
        [Required]
        public string ReceiverId { get; set; }
        [Required]
        public string Message { get; set; } 
    }
}