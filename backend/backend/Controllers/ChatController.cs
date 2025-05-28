using backend.Core.Dtos.ChatMessage;
using backend.Core.Entities;
using backend.data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using backend.Core.DbContext;
using AutoMapper;
using backend.Core.Dtos.ConversationSummaryDto;
using Microsoft.AspNetCore.SignalR;
using backend.Hubs;

namespace backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ChatController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly IHubContext<Chathub> _hubContext;

        public ChatController(ApplicationDbContext context, UserManager<ApplicationUser> userManager, IHubContext<Chathub> hubContext)
        {
            _context = context;
            _userManager = userManager;
            _hubContext = hubContext;
        }
        #region Endpoints
        #region Get the User Id
        private string GetUserId()
        {
            return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
        #endregion

        #region Send a message
        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] SendMessageDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var senderId = GetUserId();
            if (string.IsNullOrEmpty(senderId))
            {
                return Unauthorized("Sender ID not found.");
            }


            var receiverExists = await _userManager.FindByIdAsync(dto.ReceiverId);
            if (receiverExists == null)
            {
                return NotFound("Receiver user not found.");
            }


            var chatMessage = new ChatMessage
            {
                SenderId = senderId,
                ReceiverId = dto.ReceiverId,
                Message = dto.Message,
                Timestampt = DateTime.UtcNow,
                isRead = false
            };

            _context.ChatMessage.Add(chatMessage);
            await _context.SaveChangesAsync();

            var senderUser = await _userManager.FindByIdAsync(chatMessage.SenderId);
            var receiverUser = await _userManager.FindByIdAsync(chatMessage.ReceiverId);

            var responseDto = new ChatMessageDto
            {
                Id = chatMessage.Id,
                SenderId = chatMessage.SenderId,
                ReceiverId = chatMessage.ReceiverId,
                Message = chatMessage.Message,
                IsRead = chatMessage.isRead,
                Timestampt = chatMessage.Timestampt,
                SenderUsername = (await _userManager.FindByIdAsync(chatMessage.SenderId))?.UserName,
                ReceiverUsername = (await _userManager.FindByIdAsync(chatMessage.ReceiverId))?.UserName
            };

            await _hubContext.Clients.User(dto.ReceiverId).SendAsync("ReceiveMessage", responseDto);
            await _hubContext.Clients.User(senderId).SendAsync("ReceiveMessage", responseDto);


            return StatusCode(201, responseDto); // 201 Created
        }

        #endregion

        #region Get Recent Conversations
        [HttpGet("conversations")]
        public async Task<IActionResult> GetRecentConversations()
        {
            var currentUserId = GetUserId();
            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("User ID not found");
            }
            var distinctChatPartners = await _context.ChatMessage
                .Where(cm => cm.SenderId == currentUserId || cm.ReceiverId == currentUserId)
                .Select(cm => cm.SenderId == currentUserId ? cm.ReceiverId : cm.SenderId)
                .Where(id => id != null)
                .Distinct()
                .ToListAsync();

            var conversations = new List<ConversationSummaryDto>();
            foreach (var partnerId in distinctChatPartners)
            {
                var lastMessage = await _context.ChatMessage
                    .Where(cm => (cm.SenderId == currentUserId && cm.ReceiverId == partnerId) ||
                                 (cm.SenderId == partnerId && cm.ReceiverId == currentUserId))
                    .OrderByDescending(cm => cm.Timestampt)
                    .FirstOrDefaultAsync();

                if (lastMessage == null) continue;
                var unreadCount = await _context.ChatMessage
                    .Where(cm => cm.SenderId == partnerId && cm.ReceiverId == currentUserId && !cm.isRead)
                    .CountAsync();

                var partnerUser = await _userManager.FindByIdAsync(partnerId);
                if (partnerUser == null)
                {
                    partnerUser = new ApplicationUser { UserName = "[Deleted User]" };
                }
                conversations.Add(new ConversationSummaryDto
                {
                    OtherUserId = partnerId,
                    OtherUsername = partnerUser?.UserName,
                    LastMessageSnippet = lastMessage.Message.Length > 50 ? lastMessage.Message.Substring(0, 50) + "..." : lastMessage.Message,
                    LastMessageTimestampt = lastMessage.Timestampt,
                    UnreadMessageCount = unreadCount
                });
            }
            conversations = conversations.OrderByDescending(c => c.LastMessageTimestampt).ToList();
            return Ok(conversations);
        }
        #endregion

        #region Get Conversation History
        [HttpGet("messages/{otherUserId}")]
        public async Task<IActionResult> GetConversationHistory(string otherUserId, [FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 50)
        {
            var currentUserId = GetUserId();
            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("User ID not found.");
            }

            var otherUserExists = await _userManager.FindByIdAsync(otherUserId);
            if (otherUserExists == null)
            {
                return NotFound("Other user not found.");
            }


            var messagesQuery = _context.ChatMessage
                .Where(cm => (cm.SenderId == currentUserId && cm.ReceiverId == otherUserId) ||
                             (cm.SenderId == otherUserId && cm.ReceiverId == currentUserId))
                .OrderBy(cm => cm.Timestampt)
                .Include(cm => cm.Sender)
                .Include(cm => cm.Receiver);


            var paginatedMessages = await messagesQuery
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();


            var unreadMessagesToCurrentUser = paginatedMessages
                .Where(cm => cm.ReceiverId == currentUserId && !cm.isRead)
                .ToList();

            foreach (var message in unreadMessagesToCurrentUser)
            {
                message.isRead = true;
            }
            await _context.SaveChangesAsync();


            var messageDtos = paginatedMessages.Select(cm => new ChatMessageDto
            {
                Id = cm.Id,
                SenderId = cm.SenderId,
                ReceiverId = cm.ReceiverId,
                Message = cm.Message,
                IsRead = cm.isRead,
                Timestampt = cm.Timestampt,
                SenderUsername = cm.Sender?.UserName ?? "[Deleted User]",
                ReceiverUsername = cm.Receiver?.UserName ?? "[Deleted User]"
            }).ToList();

            return Ok(messageDtos);
        }
        #endregion

        #region Edit Your Message
        [HttpPut("messages/{messageId}")]
        public async Task<IActionResult> EditMessage(int messageId, [FromBody] EditMessageDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var currentUserId = GetUserId();
            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("User ID not found.");
            }


            var messageToEdit = await _context.ChatMessage
                .Where(cm => cm.Id == messageId)
                .Include(cm => cm.Sender)
                .Include(cm => cm.Receiver)
                .FirstOrDefaultAsync();

            if (messageToEdit == null)
            {
                return NotFound("Message not found.");
            }


            if (messageToEdit.SenderId != currentUserId)
            {
                return Forbid("You are not authorized to edit this message.");
            }
            messageToEdit.Message = dto.NewMessage;
            messageToEdit.isRead = false;

            await _context.SaveChangesAsync();


            var responseDto = new ChatMessageDto
            {
                Id = messageToEdit.Id,
                SenderId = messageToEdit.SenderId,
                ReceiverId = messageToEdit.ReceiverId,
                Message = messageToEdit.Message,
                IsRead = messageToEdit.isRead,
                Timestampt = messageToEdit.Timestampt,
                SenderUsername = messageToEdit.Sender?.UserName ?? "[Deleted User]",
                ReceiverUsername = messageToEdit.Receiver?.UserName ?? "[Deleted User]"
            };

            await _hubContext.Clients.User(messageToEdit.ReceiverId).SendAsync("MessageEdited", responseDto);
            await _hubContext.Clients.User(messageToEdit.SenderId).SendAsync("MessageEdited", responseDto);

            return Ok(responseDto);
        }
        #endregion

        #region Delete your message
        // DeleteMessage
        [HttpDelete("messages/{messageId}")]
        public async Task<IActionResult> DeleteMessage(int messageId)
        {
            var currentUserId = GetUserId();
            if (string.IsNullOrEmpty(currentUserId))
            {
                return Unauthorized("User ID not found.");
            }


            var messageToDelete = await _context.ChatMessage
                .Where(cm => cm.Id == messageId)
                .FirstOrDefaultAsync();

            if (messageToDelete == null)
            {
                return NotFound("Message not found or you don't have access to it.");
            }


            if (messageToDelete.SenderId != currentUserId)
            {
                return Forbid("You are not authorized to delete this message.");
            }

            _context.ChatMessage.Remove(messageToDelete);
            await _context.SaveChangesAsync();

            await _hubContext.Clients.User(messageToDelete.ReceiverId).SendAsync("MessageDeleted", messageId);
            await _hubContext.Clients.User(messageToDelete.SenderId).SendAsync("MessageDeleted", messageId);


            return NoContent();
        }
        #endregion

        #endregion
    }
}
