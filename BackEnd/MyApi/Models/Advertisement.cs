using MyApi.Models.Enums;

namespace MyApi.Models
{

    public class Advertisement
    {
        public int AdvertisementId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime PostedDate { get; set; }

        // Minimum education requirements for the advertisement
        public Degree RequiredDegree { get; set; } 
        public EducationLevel RequiredEducationLevel { get; set; }

        // Minimum work experience requirements for the advertisement
        public JobPosition RequiredPosition { get; set; } 
        public JobIndustry RequiredIndustry { get; set; } 
        public JobLevel RequiredJobLevel { get; set; } 
        public int MinimumYearsExperience { get; set; }

        // Minimum skill requirements for the advertisement
        public SkillCategory RequiredSkill { get; set; }

        // Association with the user who posted the advertisement
        public int UserId { get; set; } // Association with the user
        public User? User { get; set; }

        // List of UserIds of users who have applied
        public List<int> ApplicantUserIds { get; set; } = new List<int>();
    }
}
