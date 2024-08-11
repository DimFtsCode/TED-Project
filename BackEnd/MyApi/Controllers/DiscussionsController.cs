using Microsoft.AspNetCore.Mvc;
using MyApi.Models;
using MyApi.Services;
using System.Collections.Generic;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DiscussionsController : ControllerBase
    {
        private readonly DiscussionService _discussionService;

        public DiscussionsController(DiscussionService discussionService)
        {
            _discussionService = discussionService;
        }

        [HttpPost]
        public IActionResult CreateDiscussion([FromBody] Discussion discussion)
        {
            if (discussion == null || discussion.Participants == null || discussion.Participants.Count < 2)
            {
                return BadRequest("Invalid discussion data. A discussion requires at least two participants.");
            }

            var createdDiscussion = _discussionService.CreateDiscussion(discussion);
            if (createdDiscussion == null)
            {
                return StatusCode(500, "Failed to create discussion.");
            }

            return CreatedAtAction(nameof(CreateDiscussion), new { id = createdDiscussion.Id }, createdDiscussion);
        }

        [HttpGet("{id}")]
        public IActionResult GetDiscussion(int id)
        {
            var discussion = _discussionService.GetDiscussionById(id);
            if (discussion == null)
            {
                return NotFound();
            }

            return Ok(discussion);
        }

        [HttpGet("user/{userId}")]
        public IActionResult GetDiscussionsByUser(int userId)
        {
            var discussions = _discussionService.GetDiscussionsByUser(userId);
            return Ok(discussions);
        }


        

        [HttpPost("{id}/add-participant")]
        public IActionResult AddParticipant(int id, [FromBody] AddParticipantRequest request)
        {
            var result = _discussionService.AddParticipantToDiscussion(id, request.UserId);
            if (result)
            {
                return Ok("Participant added successfully.");
            }

            return BadRequest("Failed to add participant. The discussion might not exist or the user is already a participant.");
        }

        [HttpPost("{id}/remove-participant")]
        public IActionResult RemoveParticipant(int id, [FromBody] RemoveParticipantRequest request)
        {
            var result = _discussionService.RemoveParticipantFromDiscussion(id, request.UserId);
            if (result)
            {
                return Ok("Participant removed successfully.");
            }

            return BadRequest("Failed to remove participant. The discussion might not exist or the user is not a participant.");
        }


        [HttpPost("{id}/delete-or-remove-participant")]
        public IActionResult DeleteDiscussionOrRemoveParticipant(int id, [FromBody] RemoveParticipantRequest request)
        {
            var result = _discussionService.DeleteDiscussionOrRemoveParticipant(id, request.UserId);
            if (result)
            {
                return Ok("Discussion deleted or participant removed successfully.");
            }

            return BadRequest("Failed to delete discussion or remove participant. The discussion might not exist or the user is not a participant.");
        }
        
    }

}
