using Microsoft.AspNetCore.Mvc;
using MyApi.Models;
using MyApi.Services;
using Microsoft.Extensions.Logging;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserLoginController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly ILogger<UserLoginController> _logger;

        public UserLoginController(UserService userService, ILogger<UserLoginController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Email and password are required.");
            }

            var user = _userService.GetUserByEmailAndPassword(request.Email, request.Password);

            if (user == null)
            {
                return Unauthorized("Invalid email or password.");
            }

            return Ok(new
            {
                userId = user.UserId,
                email = user.Email,
                firstName = user.FirstName, // Επιστροφή του FirstName
                isAdmin = user.Admin // Ενημέρωση για τη χρήση της ιδιότητας Admin
                
            });
        }
    }
}
