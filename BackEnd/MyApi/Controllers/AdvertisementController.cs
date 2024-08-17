using Microsoft.AspNetCore.Mvc;
using MyApi.Models;
using MyApi.Services;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AdvertisementController : ControllerBase
    {
        private readonly AdvertisementService _advertisementService;

        public AdvertisementController(AdvertisementService advertisementService)
        {
            _advertisementService = advertisementService;
        }

        // Δημιουργία αγγελίας
        [HttpPost]
        public IActionResult CreateAdvertisement([FromBody] Advertisement advertisement)
        {
            var createdAd = _advertisementService.CreateAdvertisement(advertisement);
            return CreatedAtAction(nameof(GetAdvertisement), new { id = createdAd.AdvertisementId }, createdAd);
        }

        // Ενημέρωση αγγελίας
        [HttpPut("{id}")]
        public IActionResult UpdateAdvertisement(int id, [FromBody] Advertisement updatedAdvertisement)
        {
            var advertisement = _advertisementService.UpdateAdvertisement(id, updatedAdvertisement);
            if (advertisement == null) return NotFound();

            return Ok(advertisement);
        }

        // Διαγραφή αγγελίας
        [HttpDelete("{id}")]
        public IActionResult DeleteAdvertisement(int id, int userId)
        {
            var result = _advertisementService.DeleteAdvertisement(id, userId);
            if (!result) return NotFound();

            return NoContent();
        }

        // Εύρεση αγγελίας με βάση το ID
        [HttpGet("{id}")]
        public IActionResult GetAdvertisement(int id)
        {
            var advertisement = _advertisementService.GetAdvertisementById(id);
            if (advertisement == null) return NotFound();

            return Ok(advertisement);
        }

        // Λήψη όλων των αγγελιών
        [HttpGet]
        public IActionResult GetAllAdvertisements()
        {
            var advertisements = _advertisementService.GetAllAdvertisements();
            return Ok(advertisements);
        }


        [HttpGet("user/{userId}")]
        public IActionResult GetAdvertisementsByUser(int userId)
        {
            var advertisements = _advertisementService.GetAdvertisementsByUser(userId);
            if (advertisements == null || !advertisements.Any()) return NotFound();

            return Ok(advertisements);
        }

        [HttpGet("{id}/participants")]
        public IActionResult GetParticipantsByAdvertisementId(int id)
        {
            try
            {
                var participants = _advertisementService.GetParticipantsByAdvertisementId(id);
                return Ok(participants);
            }
            catch (KeyNotFoundException)
            {
                return NotFound();
            }
        }

        [HttpDelete("{advertisementId}/participant/{participantId}")]
        public IActionResult RemoveParticipant(int advertisementId, int participantId)
        {
            try
            {
                var result = _advertisementService.RemoveParticipant(advertisementId, participantId);
                if (!result)
                {
                    return NotFound("Participant not found or unable to remove.");
                }

                return NoContent(); // 204 No Content, successful delete
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
}
