using MyApi.Data;
using MyApi.Models;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace MyApi.Services
{
    public class UserBioService
    {
        private readonly AppDbContext _context;
        private readonly ILogger<UserBioService> _logger;

        public UserBioService(AppDbContext context, ILogger<UserBioService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public void AddUserBio(UserBioRequest request)
        {
            var user = _context.Users.SingleOrDefault(u => u.UserId == request.UserId);
            if (user != null)
            {
                // Clear existing entries to prevent duplicates
                user.Education.Clear();
                user.Jobs.Clear();
                user.Skills.Clear();

                foreach (var education in request.Educations)
                {
                    var newEducation = new Education
                    {
                        Degree = education.Degree,
                        Institution = education.Institution,
                        StartDate = education.StartDate,
                        EndDate = education.EndDate,
                        IsPublic = education.IsPublic,
                        UserId = user.UserId // Ensure UserId is assigned
                    };
                    user.Education.Add(newEducation);
                    _logger.LogInformation($"Added Education: {education.Degree}, {education.Institution}");
                }

                foreach (var job in request.Jobs)
                {
                    var newJob = new Job
                    {
                        Position = job.Position,
                        Company = job.Company,
                        StartDate = job.StartDate,
                        EndDate = job.EndDate,
                        IsPublic = job.IsPublic,
                        UserId = user.UserId // Ensure UserId is assigned
                    };
                    user.Jobs.Add(newJob);
                    _logger.LogInformation($"Added Job: {job.Position}, {job.Company}");
                }

                foreach (var skill in request.Skills)
                {
                    var newSkill = new Skill
                    {
                        SkillName = skill.SkillName,
                        Proficiency = skill.Proficiency,
                        IsPublic = skill.IsPublic,
                        UserId = user.UserId // Ensure UserId is assigned
                    };
                    user.Skills.Add(newSkill);
                    _logger.LogInformation($"Added Skill: {skill.SkillName}, {skill.Proficiency}");
                }

                _context.SaveChanges();
                _logger.LogInformation("User bio saved to database.");
            }
        }
    }
}
