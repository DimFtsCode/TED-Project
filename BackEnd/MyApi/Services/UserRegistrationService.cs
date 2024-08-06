using MyApi.Data;
using MyApi.Models;
using System.Linq;

namespace MyApi.Services
{
    public class UserRegistrationService
    {
        private readonly AppDbContext _context;

        public UserRegistrationService(AppDbContext context)
        {
            _context = context;
        }

        public bool IsEmailInUse(string email)
        {
            return _context.Users.Any(u => u.Email == email);
        }

        public void AddUser(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }
    }
}
