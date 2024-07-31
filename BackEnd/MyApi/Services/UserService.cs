using MyApi.Data;
using MyApi.Models;
using System.Collections.Generic;
using System.Linq;

namespace MyApi.Services
{
    public class UserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public List<User> GetAllUsers()
        {
            return _context.Users.ToList() ?? new List<User>();
        }

        public User? GetUserById(int id)
        {
            return _context.Users.SingleOrDefault(u => u.UserId == id);
        }

        public void AddUser(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public void UpdateUser(User user)
        {
            var existingUser = _context.Users.SingleOrDefault(u => u.UserId == user.UserId);
            if (existingUser != null)
            {
                existingUser.FirstName = user.FirstName;
                existingUser.LastName = user.LastName;
                existingUser.Email = user.Email;
                existingUser.PhoneNumber = user.PhoneNumber;
                existingUser.Password = user.Password;
                existingUser.ConfirmPassword = user.ConfirmPassword;
                existingUser.PhotoData = user.PhotoData;
                existingUser.DateOfBirth = user.DateOfBirth;
                existingUser.Address = user.Address;
                existingUser.Admin = user.Admin;

                _context.SaveChanges();
            }
        }

        public void UpdateUserBiography(int userId, List<string> bio)
        {
            var user = GetUserById(userId);
            if (user != null)
            {
                user.Biography = bio; // Αντικατάσταση της υπάρχουσας λίστας
                _context.SaveChanges();
            }
        }

        public bool IsEmailInUse(string email)
        {
            return _context.Users.Any(u => u.Email == email);
        }
    }
}
