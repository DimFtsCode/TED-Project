using Microsoft.AspNetCore.Mvc;
using MyApi.Models;
using MyApi.Services;
using System;
using System.Collections.Generic;
using Microsoft.Extensions.Logging;

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

        [HttpGet]
        public ActionResult<IEnumerable<User>> GetAllUsers()
        {
            return Ok(_userService.GetAllUsers());
        }

        [HttpGet("{id}")]
        public ActionResult<User> GetUserById(int id)
        {
            var user = _userService.GetUserById(id);
            if (user == null)
            {
                return NotFound("User not found");
            }
            return Ok(user);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateUser(int id, [FromBody] User updatedUser)
        {
            if (id != updatedUser.UserId)
            {
                return BadRequest("User ID mismatch");
            }

            var user = _userService.GetUserById(id);
            if (user == null)
            {
                return NotFound("User not found");
            }

            _userService.UpdateUser(updatedUser);
            return NoContent();
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteUser(int id)
        {
            var user = _userService.GetUserById(id);
            if (user == null)
            {
                return NotFound("User not found");
            }

            _userService.DeleteUser(id);
            return NoContent();
        }


        [HttpGet("{id}/names")]
        public IActionResult GetUserNamesById(int id)
        {
            var result = _userService.GetUserNamesById(id);
            if (result == null)
            {
                return NotFound();
            }

            return Ok(new { FirstName = result?.FirstName, LastName = result?.LastName });
        }

    }
}
