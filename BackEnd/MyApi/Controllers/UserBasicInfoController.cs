    using Microsoft.AspNetCore.Mvc;
    using MyApi.Models;
    using MyApi.Services;
    using Microsoft.Extensions.Logging;
    using System;
    using System.IO;

    namespace MyApi.Controllers
    {
        [ApiController]
        [Route("api/[controller]")]
        public class UserBasicInfoController : ControllerBase
        {
            private readonly UserBasicInfoService _userBasicInfoService;
            private readonly ILogger<UserBasicInfoController> _logger;

            public UserBasicInfoController(UserBasicInfoService userBasicInfoService, ILogger<UserBasicInfoController> logger)
            {
                _userBasicInfoService = userBasicInfoService;
                _logger = logger;
            }

            [HttpPost("update-basic-info")]
            public IActionResult UpdateBasicInfo([FromForm] int userId, [FromForm] string phoneNumber, [FromForm] string address, [FromForm] IFormFile? photo)
            {
                _logger.LogInformation("Received basic info update request.");

                try
                {
                    _userBasicInfoService.UpdateUserBasicInfo(userId, phoneNumber, address, photo);
                    _logger.LogInformation("Basic info updated successfully.");
                    return Ok(new { message = "Basic info updated successfully" });
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while updating basic info.");
                    return StatusCode(500, "Internal server error");
                }
            }
        }
    }
