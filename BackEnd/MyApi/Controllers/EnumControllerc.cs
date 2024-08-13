using Microsoft.AspNetCore.Mvc;
using MyApi.Services;
using System.Collections.Generic;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EnumController : ControllerBase
    {
        private readonly EnumService _enumService;

        public EnumController(EnumService enumService)
        {
            _enumService = enumService;
        }

        [HttpGet("all-enums")]
        public IActionResult GetAllEnums()
        {
            var enums = _enumService.GetAllEnums();
            return Ok(enums);
        }
    }
}
