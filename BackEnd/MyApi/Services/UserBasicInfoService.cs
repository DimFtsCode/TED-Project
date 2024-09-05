using MyApi.Data;
using MyApi.Models;
using Microsoft.Extensions.Logging;
using System.IO;
using Microsoft.AspNetCore.Http;
using System.Linq;

namespace MyApi.Services
{
    public class UserBasicInfoService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<UserBasicInfoService> _logger;

        public UserBasicInfoService(AppDbContext context, ILogger<UserBasicInfoService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public void UpdateUserBasicInfo(int userId, string phoneNumber, string address, IFormFile? photo)
        {
            var user = _context.Users.SingleOrDefault(u => u.UserId == userId);
            if (user != null)
            {
                user.PhoneNumber = phoneNumber;
                user.Address = address;

                if (photo != null)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        photo.CopyTo(memoryStream);
                        user.PhotoData = memoryStream.ToArray();
                        user.PhotoMimeType = photo.ContentType;
                    }
                }

                _context.SaveChanges();
                _logger.LogInformation("User basic info updated in the database.");
            }
        }
    }
}
