using System;
using System.Collections.Generic;

namespace MyApi.Models
{
    public class UserBioRequest
    {
        public int UserId { get; set; }
        public List<EducationRequest> Educations { get; set; } = new List<EducationRequest>();
        public List<JobRequest> Jobs { get; set; } = new List<JobRequest>();
        public List<SkillRequest> Skills { get; set; } = new List<SkillRequest>();
    }

    public class EducationRequest
    {
        public string Degree { get; set; } = string.Empty;
        public string Institution { get; set; } = string.Empty;
        public DateTime StartDate { get; set; } = DateTime.MinValue;
        public DateTime EndDate { get; set; } = DateTime.MinValue;
        public bool IsPublic { get; set; }
    }

    public class JobRequest
    {
        public string Position { get; set; } = string.Empty;
        public string Company { get; set; } = string.Empty;
        public DateTime StartDate { get; set; } = DateTime.MinValue;
        public DateTime EndDate { get; set; } = DateTime.MinValue;
        public bool IsPublic { get; set; }
    }

    public class SkillRequest
    {
        public string SkillName { get; set; } = string.Empty;
        public string Proficiency { get; set; } = string.Empty;
        public bool IsPublic { get; set; }
    }
}
