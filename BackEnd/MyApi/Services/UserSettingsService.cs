using MyApi.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MyApi.Data;

namespace MyApi.Services
{
    public class UserSettingsService
    {
        private readonly AppDbContext _context;

        public UserSettingsService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<ServiceResponse> UpdateEmailAsync(int userId, string email)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return new ServiceResponse { Success = false, Message = "User not found." };
            }

            var existingUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
            if (existingUser != null)
            {
                return new ServiceResponse { Success = false, Message = "Email is already in use." };
            }

            user.Email = email;
            await _context.SaveChangesAsync();
            return new ServiceResponse { Success = true };
        }

        public async Task<ServiceResponse> UpdatePasswordAsync(int userId, string password)
        {
            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return new ServiceResponse { Success = false, Message = "User not found." };
            }

            user.Password = password;
            await _context.SaveChangesAsync();
            return new ServiceResponse { Success = true };
        }
    }

    public class ServiceResponse
    {
        public bool Success { get; set; }
        public string? Message { get; set; } // Κάνουμε την ιδιότητα nullable
    }

}
