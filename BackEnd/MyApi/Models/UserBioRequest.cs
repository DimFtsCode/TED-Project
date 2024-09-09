using MyApi.Models.Enums;
using System.Text.Json.Serialization;


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
       [JsonConverter(typeof(JsonStringEnumConverter))]
        public Degree Degree { get; set; }

        [JsonConverter(typeof(JsonStringEnumConverter))]
        public EducationLevel Level { get; set; }
        public string Institution { get; set; } = string.Empty;
        public DateTime StartDate { get; set; } = DateTime.MinValue;
        public DateTime EndDate { get; set; } = DateTime.MinValue;
        public bool IsPublic { get; set; }
    }

    public class JobRequest
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]       
        public JobPosition Position { get; set; }  // Use of JobPosition enum
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public JobIndustry Industry { get; set; }  // Use of JobIndustry enum
         [JsonConverter(typeof(JsonStringEnumConverter))]
        public JobLevel Level { get; set; }  // Use of JobLevel enum
        public string Company { get; set; } = string.Empty;
        public DateTime StartDate { get; set; } = DateTime.MinValue;
        public DateTime EndDate { get; set; } = DateTime.MinValue;
        public bool IsPublic { get; set; }
    }

    public class SkillRequest
    {
        [JsonConverter(typeof(JsonStringEnumConverter))]
        public SkillCategory SkillName { get; set; }  // Use of SkillCategory enum
        public string Proficiency { get; set; } = string.Empty;
        public bool IsPublic { get; set; }
    }
}
