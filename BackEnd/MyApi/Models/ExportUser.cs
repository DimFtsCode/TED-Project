using System;
using System.Collections.Generic;

namespace MyApi.Models
{
    public class ExportUser
    {
        public int UserId { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string? PhoneNumber { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? Address { get; set; }
        public bool Admin { get; set; }
        public List<Education> Educations { get; set; } = new List<Education>();
        public List<Job> Jobs { get; set; } = new List<Job>();
        public List<Skill> Skills { get; set; } = new List<Skill>();
    }
}
