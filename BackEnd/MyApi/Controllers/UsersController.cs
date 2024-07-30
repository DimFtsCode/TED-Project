using Microsoft.AspNetCore.Mvc;
using MyApi.Data;
using MyApi.Models;
using System.IO;
using System.Linq;
using Microsoft.Extensions.Logging;
using System;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly ILogger<UsersController> _logger;

        public UsersController(AppDbContext context, ILogger<UsersController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpPost("register")]
        public IActionResult Register([FromForm] User user)
        {
            _logger.LogInformation("Received user: {@User}", user);

            if (!user.IsValid())
            {
                _logger.LogWarning("Passwords do not match for user: {@User}", user);
                return BadRequest("Passwords do not match");
            }

            if (_context.Users.Any(u => u.Email == user.Email))
            {
                _logger.LogWarning("Email already in use: {Email}", user.Email);
                return BadRequest("Email is already in use");
            }
            
            if (user.Photo != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    user.Photo.CopyTo(memoryStream);
                    user.PhotoData = memoryStream.ToArray();
                }
            }

            // Ορίστε την τιμή του admin σε false για νέους χρήστες
            user.Admin = false;

            _logger.LogInformation("User data after setting admin to false: {@User}", user);

            try
            {
                using (var transaction = _context.Database.BeginTransaction())
                {
                    _context.Users.Add(user);
                    _context.SaveChanges();
                    transaction.Commit();
                }
                
                _logger.LogInformation("User registered successfully: {@User}", user);
                return Ok("User registered successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while registering user: {@User}", user);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            var user = _context.Users.SingleOrDefault(u => u.Email == loginRequest.Email);

            if (user == null || user.Password != loginRequest.Password)
            {
                _logger.LogWarning("Invalid login attempt for email: {Email}", loginRequest.Email);
                return Unauthorized("Invalid email or password");
            }

            _logger.LogInformation("User logged in successfully: {@User}", user);

            return Ok(new { isAdmin = user.Admin });
        }

        [HttpGet]
        public IActionResult GetAllUsers()
        {
            return Ok(_context.Users.ToList());
        }
    }
}
