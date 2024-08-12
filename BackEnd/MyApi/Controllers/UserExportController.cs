using Microsoft.AspNetCore.Mvc;
using MyApi.Models;
using MyApi.Services;
using System.Collections.Generic;
using System.IO;
using System.Text;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using System.Xml.Serialization;
using System.Xml;

namespace MyApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UserExportController : ControllerBase
    {
        private readonly UserExportService _userExportService;
        private readonly ILogger<UserExportController> _logger;

        public UserExportController(UserExportService userExportService, ILogger<UserExportController> logger)
        {
            _userExportService = userExportService;
            _logger = logger;
        }

        [HttpPost("export")]
        public IActionResult ExportUsers([FromQuery] string format, [FromBody] List<int> userIds)
        {
            var users = _userExportService.GetUsersByIds(userIds);

            if (format.ToLower() == "json")
            {
                var settings = new JsonSerializerSettings();
                settings.Converters.Add(new StringEnumConverter());

                var json = Newtonsoft.Json.JsonConvert.SerializeObject(users, Newtonsoft.Json.Formatting.Indented, settings);
                return File(Encoding.UTF8.GetBytes(json), "application/json", "users.json");
            }
            else if (format.ToLower() == "xml")
            {
                var xmlSerializer = new XmlSerializer(typeof(List<ExportUser>));
                using (var memoryStream = new MemoryStream())
                {
                    var xmlWriterSettings = new XmlWriterSettings
                    {
                        Indent = true,
                        IndentChars = "  ",
                        NewLineOnAttributes = false
                    };

                    using (var xmlWriter = XmlWriter.Create(memoryStream, xmlWriterSettings))
                    {
                        xmlSerializer.Serialize(xmlWriter, users);
                    }

                    return File(memoryStream.ToArray(), "application/xml", "users.xml");
                }
            }

            return BadRequest("Invalid format specified.");
        }
    }
}
