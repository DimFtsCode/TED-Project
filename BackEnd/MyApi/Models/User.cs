using Microsoft.AspNetCore.Http;
using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace MyApi.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Password { get; set; }
        public string ConfirmPassword { get; set; }

        [NotMapped]
        public IFormFile Photo { get; set; }
        
        public DateTime DateOfBirth { get; set; }
        public string Address { get; set; }

        public bool IsValid()
        {
            return Password == ConfirmPassword;
        }
    }
}
