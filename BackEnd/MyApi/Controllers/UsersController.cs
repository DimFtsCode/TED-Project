using Microsoft.AspNetCore.Mvc;
using MyApi.Data;
using MyApi.Models;
using System.IO;
using System.Linq;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly WordsContext _context;

        public UsersController(WordsContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register([FromForm] User user)
        {
            if (!user.IsValid())
            {
                return BadRequest("Passwords do not match");
            }

            if (user.Photo != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    user.Photo.CopyTo(memoryStream);
                    user.PhotoData = memoryStream.ToArray();
                }
            }

            _context.Users.Add(user);
            _context.SaveChanges();

            return Ok("User registered successfully");
        }

        [HttpGet]
        public IActionResult GetAllUsers()
        {
            return Ok(_context.Users.ToList());
        }
    }
}
