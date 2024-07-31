using Microsoft.AspNetCore.Mvc;
using MyApi.Models;
using MyApi.Services;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Xml.Serialization;
using System.Xml;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(UserService userService, ILogger<UsersController> logger)
        {
            _userService = userService;
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

            if (string.IsNullOrEmpty(user.Email) || _userService.IsEmailInUse(user.Email))
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

            user.Admin = false;

            _logger.LogInformation("User data after setting admin to false: {@User}", user);

            try
            {
                _userService.AddUser(user);
                _logger.LogInformation("User registered successfully: {@User}", user);
                return Ok(new { userId = user.UserId, email = user.Email }); 
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while registering user: {@User}", user);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("check-email")]
        public IActionResult CheckEmail([FromBody] CheckEmailRequest request)
        {
            var userExists = _userService.IsEmailInUse(request.Email);
            return Ok(new { exists = userExists });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest loginRequest)
        {
            var user = _userService.GetAllUsers().SingleOrDefault(u => u.Email == loginRequest.Email);

            if (user == null || user.Password != loginRequest.Password)
            {
                _logger.LogWarning("Invalid login attempt for email: {Email}", loginRequest.Email);
                return Unauthorized("Invalid email or password");
            }

            _logger.LogInformation("User logged in successfully: {@User}", user);

            return Ok(new { isAdmin = user.Admin, userId = user.UserId });
        }

        [HttpGet]
        public IActionResult GetAllUsers()
        {
            return Ok(_userService.GetAllUsers());
        }

        [HttpGet("{id}")]
        public IActionResult GetUserById(int id)
        {
            var user = _userService.GetUserById(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(user);
        }

        [HttpPost("export")]
        public IActionResult ExportUsers([FromQuery] string format, [FromBody] List<int> userIds)
        {
            var users = _userService.GetAllUsers()
                .Where(u => userIds.Contains(u.UserId))
                .Select(u => new ExportUser
                {
                    UserId = u.UserId,
                    FirstName = u.FirstName,
                    LastName = u.LastName,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    DateOfBirth = u.DateOfBirth,
                    Address = u.Address,
                    Admin = u.Admin,
                    Biography = u.Biography?.ToList() // Ensure the biography is copied as a new list
                })
                .ToList();

            if (format.ToLower() == "json")
            {
                var json = JsonConvert.SerializeObject(users, Newtonsoft.Json.Formatting.Indented);
                return File(Encoding.UTF8.GetBytes(json), "application/json", "users.json");
            }
            else if (format.ToLower() == "xml")
            {
                var xmlSerializer = new XmlSerializer(typeof(List<ExportUser>));
                using (var memoryStream = new MemoryStream())
                {
                    var xmlWriterSettings = new XmlWriterSettings
                    {
                        Indent = true,
                        IndentChars = "  ",
                        NewLineOnAttributes = false
                    };

                    using (var xmlWriter = XmlWriter.Create(memoryStream, xmlWriterSettings))
                    {
                        xmlSerializer.Serialize(xmlWriter, users);
                    }

                    return File(memoryStream.ToArray(), "application/xml", "users.xml");
                }
            }

            return BadRequest("Invalid format specified.");
        }

        [HttpPost("register-bio")]
        public IActionResult RegisterBio([FromBody] RegisterBioRequest request)
        {
            var user = _userService.GetUserById(request.UserId);
            if (user == null)
            {
                return NotFound("User not found");
            }

            if (user.Biography == null)
            {
                user.Biography = new List<string>();
            }

            user.Biography.AddRange(request.Bio);
            try
            {
                _userService.UpdateUser(user);
                return Ok("Biography updated successfully");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating biography for user: {UserId}", user.UserId);
                return StatusCode(500, "Internal server error");
            }
        }
    }

    public class ExportUser
    {
        public int UserId { get; set; }
        public string? FirstName { get; set; } = string.Empty;
        public string? LastName { get; set; } = string.Empty;
        public string? Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; } = string.Empty;
        public DateTime DateOfBirth { get; set; }
        public string? Address { get; set; } = string.Empty;
        public bool Admin { get; set; }
        public List<string>? Biography { get; set; } = new List<string>();
    }

    public class CheckEmailRequest
    {
        public string Email { get; set; }
    }

}
