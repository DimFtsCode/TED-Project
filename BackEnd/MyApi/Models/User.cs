using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;

namespace MyApi.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }
        public string? Password { get; set; }

        [NotMapped]
        public IFormFile? Photo { get; set; }

        public byte[]? PhotoData { get; set; }
        public string? PhotoMimeType { get; set; }
        public DateTime DateOfBirth { get; set; }
        public string? Address { get; set; }
        public bool Admin { get; set; }

        public List<string> PublicFields { get; set; } = new List<string>();
        [NotMapped]
        public List<Friendship> Network { get; set; } = new List<Friendship>();

        public List<Education> Education { get; set; } = new List<Education>();
        public List<Job> Jobs { get; set; } = new List<Job>();
        public List<Skill> Skills { get; set; } = new List<Skill>();

        public bool IsValid()
        {
            return Password == Password;
        }
    }

    public class Education
    {
        public int EducationId { get; set; }
        public string Degree { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int UserId { get; set; } // Προσθήκη της ιδιότητας UserId
        public bool IsPublic { get; set; } // Προσθήκη του πεδίου IsPublic
    }

    public class Job
    {
        public int JobId { get; set; }
        public string Position { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int UserId { get; set; } // Προσθήκη της ιδιότητας UserId
        public bool IsPublic { get; set; } // Προσθήκη του πεδίου IsPublic
    }

    public class Skill
    {
        public int SkillId { get; set; }
        public string SkillName { get; set; } = string.Empty;
        public string Proficiency { get; set; } = string.Empty;
        public int UserId { get; set; } // Προσθήκη της ιδιότητας UserId
        public bool IsPublic { get; set; } // Προσθήκη του πεδίου IsPublic
    }
}
