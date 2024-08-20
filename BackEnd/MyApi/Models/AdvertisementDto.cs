using MyApi.Models.Enums;
using MyApi.Models; // Προσθήκη της οδηγίας using




public class AdvertisementDto
{
    public int AdvertisementId { get; set; }
    public string? Title { get; set; }
    public string? Description { get; set; }
    public DateTime PostedDate { get; set; }
    public Degree RequiredDegree { get; set; }
    public EducationLevel RequiredEducationLevel { get; set; }
    public JobPosition RequiredPosition { get; set; }
    public JobIndustry RequiredIndustry { get; set; }
    public JobLevel RequiredJobLevel { get; set; }
    public int MinimumYearsExperience { get; set; }
    public SkillCategory RequiredSkill { get; set; }

    public int UserId { get; set; }
}
