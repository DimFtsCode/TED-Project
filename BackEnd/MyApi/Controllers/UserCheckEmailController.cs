using Microsoft.AspNetCore.Mvc;
using MyApi.Services;
using Microsoft.Extensions.Logging;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserCheckEmailController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly ILogger<UserCheckEmailController> _logger;

        public UserCheckEmailController(UserService userService, ILogger<UserCheckEmailController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpPost("check-email")]
        public IActionResult CheckEmail([FromBody] CheckEmailRequest request)
        {
            var emailExists = _userService.IsEmailInUse(request.Email);

            return Ok(new { exists = emailExists });
        }
    }
}

