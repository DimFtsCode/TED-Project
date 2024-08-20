using Microsoft.AspNetCore.Mvc;
using MyApi.Models;
using MyApi.Services;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/addvector")]
    public class AdvertisementVectorController : ControllerBase
    {
        private readonly AdvertisementVectorService _vectorService;

        public AdvertisementVectorController(AdvertisementVectorService vectorService)
        {
            _vectorService = vectorService;
        }

        // Endpoint για την προσθήκη νέου διανύσματος
        [HttpPost]
        public IActionResult AddAdvertisementVector([FromBody] AdvertisementVector vector)
        {
            if (_vectorService.AddAdvertisementVector(vector))
            {
                return Ok(new { Message = "Advertisement vector added successfully." });
            }

            return NotFound(new { Message = "User not found." });
        }

        [HttpGet("recommendations/{userId}")]
        public IActionResult GetRecommendedAdvertisements(int userId)
        {
            var recommendedAds = _vectorService.GetRecommendedAdvertisements(userId);

            if (recommendedAds == null || !recommendedAds.Any())
            {
                return NotFound(new { Message = "No recommendations found for this user." });
            }

            return Ok(recommendedAds);
        }

    }
}
