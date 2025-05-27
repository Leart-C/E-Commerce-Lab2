using System.ComponentModel.DataAnnotations;

//Input
namespace backend.Core.Dtos.ChatMessage
{
        public class EditMessageDto
        {
        [Required]
        public string NewMessage { get; set; }
    }
}
