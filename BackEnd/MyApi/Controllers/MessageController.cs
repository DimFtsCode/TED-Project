using Microsoft.AspNetCore.Mvc;
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

        public MessagesController(MessageService messageService, DiscussionService discussionService)
        {
            _messageService = messageService;
            _discussionService = discussionService;
        }

        [HttpPost("send")]
        public IActionResult SendMessage([FromBody] Message message)
        {
            if (message == null)
            {
                return BadRequest("Message is null.");
            }

            try
            {
                if (message.DiscussionId == 0)
                {
                    // Δημιουργία νέας συζήτησης αν δεν υπάρχει ήδη
                    var discussion = new Discussion
                    {
                        Participants = new List<int> { message.SenderId } // Μόνο το SenderId, χωρίς ReceiverId
                    };

                    var createdDiscussion = _discussionService.CreateDiscussion(discussion);
                    if (createdDiscussion == null)
                    {
                        return StatusCode(500, "Failed to create discussion.");
                    }

                    message.DiscussionId = createdDiscussion.Id;
                }

                var createdMessage = _messageService.SendMessage(message);
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
    }
}
