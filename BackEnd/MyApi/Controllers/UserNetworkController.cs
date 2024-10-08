using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using MyApi.Services;

namespace MyApi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserNetworkController : ControllerBase
    {
        private readonly UserNetworkService _userNetworkService;

        public UserNetworkController(UserNetworkService userNetworkService)
        {
            _userNetworkService = userNetworkService;
        }

        [HttpGet("{userId}/search")]
        public async Task<IActionResult> SearchUsers(int userId, [FromQuery] string query)
        {
            if (string.IsNullOrEmpty(query))
            {
                return BadRequest("Query parameter is required.");
            }

            var users = await _userNetworkService.SearchUsersAsync(query, userId);

            if (users == null || users.Count == 0)
            {
                return NotFound("No users found.");
            }

            return Ok(users);
        }

        [HttpPost("{userId}/sendrequest/{friendId}")]
        public async Task<IActionResult> SendConnectionRequest(int userId, int friendId)
        {
            try
            {
                await _userNetworkService.SendConnectionRequestAsync(userId, friendId);
                return Ok("Connection request sent!");
            }
            catch
            {
                return StatusCode(500, "Error sending connection request.");
            }
        }

        [HttpPost("connectionrequests/{requestId}/accept")]
        public async Task<IActionResult> AcceptConnectionRequest(int requestId)
        {
            try
            {
                await _userNetworkService.AcceptConnectionRequestAsync(requestId);
                return Ok(new { message = "Connection request accepted." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error accepting connection request.", error = ex.Message });
            }
        }

        [HttpPost("connectionrequests/{requestId}/reject")]
        public async Task<IActionResult> RejectConnectionRequest(int requestId)
        {
            try
            {
                await _userNetworkService.RejectConnectionRequestAsync(requestId);
                return Ok(new { message = "Connection request rejected." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Error rejecting connection request.", error = ex.Message });
            }
        }

        [HttpGet("{userId}/requests")]
        public async Task<IActionResult> GetConnectionRequests(int userId)
        {
            var requests = await _userNetworkService.GetConnectionRequestsAsync(userId);
            return Ok(requests);
        }

        [HttpGet("{userId}/friends")]
        public async Task<IActionResult> GetFriends(int userId)
        {
            var friends = await _userNetworkService.GetFriendsAsync(userId);

            // Print friends for debugging
            foreach (var friend in friends)
            {
                Console.WriteLine($"FriendId: {friend.UserId}, Friend: {friend.FirstName} {friend.LastName}");
            }

            return Ok(friends);
        }

        [HttpDelete("{userId}/friends/{friendId}")]
        public async Task<IActionResult> RemoveFriend(int userId, int friendId)
        {
            var result = await _userNetworkService.RemoveFriendAsync(userId, friendId);
            
            if (result)
            {
                return Ok("Friend removed successfully.");
            }
            
            return NotFound("Friendship not found.");
        }

    }
}
