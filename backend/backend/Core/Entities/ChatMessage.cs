using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Core.Entities
{
    public class ChatMessage
    {
        [Key]
        public int Id {  get; set; }
        
        public string SenderId { get; set; }
        public string ReceiverId { get; set; }
        [Required]
        public string Message { get; set; }
        public bool isRead { get; set; } = false;
        public DateTime Timestampt { get; set; } = DateTime.UtcNow;

        #region User navigation
        [ForeignKey(nameof(SenderId))]
        public ApplicationUser Sender { get; set; }
        [ForeignKey(nameof(ReceiverId))]
        public ApplicationUser Receiver { get; set; }
        #endregion
    }
}
