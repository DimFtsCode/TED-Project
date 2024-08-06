using Microsoft.EntityFrameworkCore;
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

        public User? GetUserByEmailAndPassword(string email, string password)
        {
            return _context.Users.SingleOrDefault(u => u.Email == email && u.Password == password);
        }

        public bool IsEmailInUse(string? email)
        {
            if (email == null)
            {
                return false;
            }

            return _context.Users.Any(u => u.Email == email);
        }

        public IEnumerable<User> GetAllUsers()
        {
            return _context.Users
                .Include(u => u.Education)
                .Include(u => u.Jobs)
                .Include(u => u.Skills)
                .ToList();
        }

        public User? GetUserById(int id)
        {
            return _context.Users
                .Include(u => u.Education)
                .Include(u => u.Jobs)
                .Include(u => u.Skills)
                .SingleOrDefault(u => u.UserId == id);
        }

        public void UpdateUser(User updatedUser)
        {
            var existingUser = _context.Users
                .Include(u => u.Education)
                .Include(u => u.Jobs)
                .Include(u => u.Skills)
                .SingleOrDefault(u => u.UserId == updatedUser.UserId);

            if (existingUser != null)
            {
                _context.Entry(existingUser).CurrentValues.SetValues(updatedUser);

                // Clear and update education
                existingUser.Education.Clear();
                existingUser.Education.AddRange(updatedUser.Education);

                // Clear and update jobs
                existingUser.Jobs.Clear();
                existingUser.Jobs.AddRange(updatedUser.Jobs);

                // Clear and update skills
                existingUser.Skills.Clear();
                existingUser.Skills.AddRange(updatedUser.Skills);

                _context.SaveChanges();
            }
        }

        public void DeleteUser(int id)
        {
            var user = _context.Users.SingleOrDefault(u => u.UserId == id);
            if (user != null)
            {
                _context.Users.Remove(user);
                _context.SaveChanges();
            }
        }
    }
}
