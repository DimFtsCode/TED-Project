using Microsoft.AspNetCore.Mvc;
using MyApi.Models;
using MyApi.Services;
using Microsoft.Extensions.Logging;
using System.IO;
using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserRegistrationController : ControllerBase
    {
        private readonly UserRegistrationService _userRegistrationService;
        private readonly ILogger<UserRegistrationController> _logger;

        public UserRegistrationController(UserRegistrationService userRegistrationService, ILogger<UserRegistrationController> logger)
        {
            _userRegistrationService = userRegistrationService;
            _logger = logger;
        }

        [HttpPost("register")]
        public IActionResult Register([FromForm] UserRegistrationRequest request)
        {
            _logger.LogInformation("Received registration request: {@Request}", request);

            if (string.IsNullOrEmpty(request.FirstName) ||
                string.IsNullOrEmpty(request.LastName) ||
                string.IsNullOrEmpty(request.Email) ||
                string.IsNullOrEmpty(request.Password) ||
                request.DateOfBirth == default)
            {
                return BadRequest("First name, last name, email, password, and date of birth are required.");
            }

            if (_userRegistrationService.IsEmailInUse(request.Email))
            {
                _logger.LogWarning("Email already in use: {Email}", request.Email);
                return BadRequest("Email is already in use");
            }

            byte[]? photoData = null;
            if (request.Photo != null)
            {
                using (var memoryStream = new MemoryStream())
                {
                    request.Photo.CopyTo(memoryStream);
                    photoData = memoryStream.ToArray();
                }
            }

            List<string> publicFields = new List<string>();
            if (!string.IsNullOrEmpty(request.PublicFields))
            {
                publicFields = JsonConvert.DeserializeObject<List<string>>(request.PublicFields) ?? new List<string>();
            }

            var user = new User
            {
                FirstName = request.FirstName,
                LastName = request.LastName,
                Email = request.Email,
                PhoneNumber = request.PhoneNumber,
                Password = request.Password,
                DateOfBirth = request.DateOfBirth,
                Address = request.Address,
                PhotoData = photoData,
                PhotoMimeType = request.Photo?.ContentType ?? string.Empty,
                Admin = false, // Default value, adjust as needed
                PublicFields = publicFields
            };

            _logger.LogInformation("User data to be saved: {@User}", user);

            try
            {
                _userRegistrationService.AddUser(user);
                _logger.LogInformation("User registered successfully: {@User}", user);
                return Ok(new { userId = user.UserId, email = user.Email });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while registering user: {@User}", user);
                return StatusCode(500, "Internal server error");
            }
        }
    }

    public class UserRegistrationRequest
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public IFormFile? Photo { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; } = string.Empty;
        public string PublicFields { get; set; } = string.Empty; // Add this field
    }
}
