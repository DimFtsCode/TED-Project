using Microsoft.AspNetCore.Mvc;
using MyApi.Data;


namespace MyApi.Controllers{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteOfInterestController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NoteOfInterestController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet("{userId}")]
        public IActionResult GetNotesOfInterest(int userId)
        {
            var notifications = _context.NotesOfInterest
                .Where(n => n.UserId == userId)
                .OrderByDescending(n => n.CreatedAt)
                .ToList();

            return Ok(notifications);
        }
        

        // endpoint to get all unread notes of interest for a user 
        [HttpGet("{userId}/unread")]
        public IActionResult GetUnreadNotesOfInterest(int userId)
        {
            var notifications = _context.NotesOfInterest
                .Where(n => n.UserId == userId && !n.IsRead)
                .OrderByDescending(n => n.CreatedAt)
                .ToList();

            return Ok(notifications);
        }

        // endpoint to mark a note of interest as read
        [HttpPost("{userId}/mark-as-read")]
        public IActionResult MarkNotesAsRead(int userId)
        {
            var unreadNotes = _context.NotesOfInterest
                .Where(n => n.UserId == userId && !n.IsRead)
                .ToList();
            
            foreach (var note in unreadNotes)
            {
                note.IsRead = true;
            }
            _context.SaveChanges();
            return Ok();
        }
    }
}