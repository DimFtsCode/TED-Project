using Microsoft.AspNetCore.Mvc;
using MyApi.Services;
using System.Threading.Tasks;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserSettingsController : ControllerBase
    {
        private readonly UserSettingsService _userSettingsService;

        public UserSettingsController(UserSettingsService userSettingsService)
        {
            _userSettingsService = userSettingsService;
        }

        [HttpPut("{userId}/email")]
        public async Task<IActionResult> UpdateEmail(int userId, [FromBody] UpdateEmailRequest request)
        {
            if (string.IsNullOrEmpty(request.Email))
            {
                return BadRequest("Email cannot be null or empty.");
            }

            var result = await _userSettingsService.UpdateEmailAsync(userId, request.Email);
            if (!result.Success)
            {
                return BadRequest(result.Message);
            }
            return NoContent();
        }

        [HttpPut("{userId}/password")]
        public async Task<IActionResult> UpdatePassword(int userId, [FromBody] UpdatePasswordRequest request)
        {
            if (string.IsNullOrEmpty(request.Password))
            {
                return BadRequest("Password cannot be null or empty.");
            }

            var result = await _userSettingsService.UpdatePasswordAsync(userId, request.Password);
            if (!result.Success)
            {
                return BadRequest(result.Message);
            }
            return NoContent();
        }
    }

    public class UpdateEmailRequest
    {
        public string? Email { get; set; }
    }

    public class UpdatePasswordRequest
    {
        public string? Password { get; set; }
    }
}
