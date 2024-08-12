using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.AspNetCore.Http;
using MyApi.Models.Enums;

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

        public List<Message> SentMessages { get; set; } = new List<Message>(); // One-to-Many relationship with Message

        public bool IsValid()
        {
            return Password == Password;
        }
    }

    public class Education
    {
        public int EducationId { get; set; }
        public Degree Degree { get; set; } // Χρήση του Degree enum
        public EducationLevel Level { get; set; } // Προσθήκη του πεδίου Level
        public string Institution { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int UserId { get; set; } // Προσθήκη της ιδιότητας UserId
        public bool IsPublic { get; set; } // Προσθήκη του πεδίου IsPublic
    }

    public class Job
    {
        public int JobId { get; set; }
        public JobPosition Position { get; set; } // Χρήση του JobPosition enum
        public JobIndustry Industry { get; set; } // Χρήση του JobIndustry enum
        public JobLevel Level { get; set; } // Επίπεδο της θέσης εργασίας
        public string Company { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int UserId { get; set; } // Προσθήκη της ιδιότητας UserId
        public bool IsPublic { get; set; } // Προσθήκη του πεδίου IsPublic
    }

    public class Skill
    {
        public int SkillId { get; set; }
        public SkillCategory SkillName { get; set; } // Χρήση του SkillCategory enum
        public string Proficiency { get; set; } = string.Empty;
        public int UserId { get; set; } // Προσθήκη της ιδιότητας UserId
        public bool IsPublic { get; set; } // Προσθήκη του πεδίου IsPublic
    }
}
