using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using MyApi.Hubs;
using MyApi.Models;
using MyApi.Services;
using System;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MessagesController : ControllerBase
    {
        private readonly MessageService _messageService;
        private readonly DiscussionService _discussionService;
        private readonly IHubContext<ChatHub> _hubContext;

        public MessagesController(MessageService messageService, DiscussionService discussionService, IHubContext<ChatHub> hubContext)
        {
            _messageService = messageService;
            _discussionService = discussionService;
            _hubContext = hubContext;
        }

        [HttpPost("send")]
        public async Task<IActionResult> SendMessage([FromBody] Message message)
        {
            if (message == null)
            {
                return BadRequest("Message is null.");
            }

            try
            {
                if (message.DiscussionId == 0)
                {
                    // Create a new discussion if it doesn't exist
                    var discussion = new Discussion
                    {
                        Participants = new List<int> { message.SenderId } // Only SenderId, without ReceiverId
                    };

                    var createdDiscussion = _discussionService.CreateDiscussion(discussion);
                    if (createdDiscussion == null)
                    {
                        return StatusCode(500, "Failed to create discussion.");
                    }

                    message.DiscussionId = createdDiscussion.Id;
                }

                // Initialize ReadStatuses
                var discussionParticipants = _discussionService.GetParticipantsByDiscussionId(message.DiscussionId);
                message.ReadStatuses = discussionParticipants.Select(participantId => new MessageReadStatus
                {
                    UserId = participantId,
                    IsRead = participantId == message.SenderId // Mark as read for sender
                }).ToList();

                var createdMessage = _messageService.SendMessage(message);

                // Notify participants via SignalR
                foreach (var participantId in discussionParticipants)
                {
                    if (participantId != message.SenderId)
                    {
                        Console.WriteLine($"Sending message to participant {participantId}, sender {message.SenderId}, discussion {message.DiscussionId}");
                        await _hubContext.Clients.User(participantId.ToString())
                            .SendAsync("ReceiveMessage",message.SenderName, message.Text, message.SenderId, message.DiscussionId);
                    }
                }

                return CreatedAtAction(nameof(SendMessage), new { id = createdMessage.Id }, createdMessage);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
}

        [HttpPost("{discussionId}/mark-as-read/{userId}")]
        public IActionResult MarkMessagesAsRead(int discussionId, int userId)
        {
            try 
            {
                var result = _messageService.MarkMessagesAsRead(discussionId, userId);
                if (result)
                {
                    return Ok("Messages marked as read.");
                }
                return NotFound("No unread messages found or invalid discussion.");
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("test")]
        public IActionResult TestRoute()
        {
            return Ok("Test route works!");
        }
    }
}
