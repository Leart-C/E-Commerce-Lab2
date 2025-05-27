using System.ComponentModel.DataAnnotations;

namespace backend.Core.Dtos.ConversationSummaryDto
{
    public class ConversationSummaryDto
    {
        public string OtherUserId { get; set; }
        public string OtherUsername { get; set; }
        public string LastMessageSnippet { get; set; }
        public DateTime LastMessageTimestamp { get; set; }
        public int UnreadMessageCount { get; set; } // Unread messages sent TO the current user from this conversation
    }
}
