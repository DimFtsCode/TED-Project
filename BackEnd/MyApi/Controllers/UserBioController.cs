using Microsoft.AspNetCore.Mvc;
using MyApi.Models;
using MyApi.Services;
using Microsoft.Extensions.Logging;
using System;
using System.IO;
using System.Text.Json;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserBioController : ControllerBase
    {
        private readonly UserBioService _userBioService;
        private readonly ILogger<UserBioController> _logger;

        public UserBioController(UserBioService userBioService, ILogger<UserBioController> logger)
        {
            _userBioService = userBioService;
            _logger = logger;
        }

        [HttpPost("register-bio")]
        public IActionResult RegisterBio(UserBioRequest request)
        {
            _logger.LogInformation("Received bio request: {@Request}", request);

            try
            {
                _userBioService.AddUserBio(request);
                _logger.LogInformation("User bio registered successfully: {@Request}", request);
                return Ok(new { firstName = "User" });  // Adjust as needed
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while registering user bio: {@Request}", request);
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpPost("update-bio")]
        public IActionResult UpdateBio([FromBody] UserBioRequest request)
        {
            _logger.LogInformation("Received bio update request.");

            try
            {
                _userBioService.UpdateUserBio(request);
                _logger.LogInformation("User bio updated successfully.");
                return Ok(new { message = "User bio updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while updating user bio.");
                return StatusCode(500, "Internal server error");
            }
        }

    }
}
