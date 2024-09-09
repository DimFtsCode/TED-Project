using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
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
        public List<Advertisement> Advertisements { get; set; } = new List<Advertisement>();

        public List<AdvertisementVector> AdvertisementVectors { get; set; } = new List<AdvertisementVector>();
        public ICollection<ArticleVector> AuthoredVectors { get; set; } = new List<ArticleVector>(); // For AuthorId in article vectors
        public ICollection<ArticleVector> ArticleVectors { get; set; } = new List<ArticleVector>();    // For UserId in article vectors
        // New navigation properties
        public ICollection<Article> Articles { get; set; } = new List<Article>();
        public ICollection<Like> Likes { get; set; } = new List<Like>();
        public ICollection<Comment> Comments { get; set; } = new List<Comment>();
        public ICollection<View> Views { get; set; } = new List<View>();
        public bool IsValid()
        {
            return Password == Password;
        }
    }

    public class Education
    {
        public int EducationId { get; set; }
        public Degree Degree { get; set; } // Use of the Degree enum
        public EducationLevel Level { get; set; } // Addition of the Level field
        public string Institution { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int UserId { get; set; } // Addition of the UserId property
        public bool IsPublic { get; set; } // Addition of the IsPublic field
    }

    public class Job
    {
        public int JobId { get; set; }
        public JobPosition Position { get; set; } // Use of the JobPosition enum
        public JobIndustry Industry { get; set; } // Use of the JobIndustry enum
        public JobLevel Level { get; set; } // Level of the job position
        public string Company { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int UserId { get; set; } // Addition of the UserId property
        public bool IsPublic { get; set; } // Addition of the IsPublic field
    }

    public class Skill
    {
        public int SkillId { get; set; }
        public SkillCategory SkillName { get; set; } // Use of the SkillCategory enum
        public string Proficiency { get; set; } = string.Empty;
        public int UserId { get; set; } // Addition of the UserId property
        public bool IsPublic { get; set; } // Addition of the IsPublic field
    }
}
