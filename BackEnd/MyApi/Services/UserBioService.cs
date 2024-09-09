using System;
using System.Linq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using MyApi.Data;
using MyApi.Models;
using MyApi.Models.Enums;

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
                        UserId = user.UserId,
                        Level = education.Level 
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
                        UserId = user.UserId,
                        Level = job.Level, 
                        Industry = job.Industry 
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
                        UserId = user.UserId,
                        
                    };
                    user.Skills.Add(newSkill);
                    _logger.LogInformation($"Added Skill: {skill.SkillName}, {skill.Proficiency}");
                }

                _context.SaveChanges();
                _logger.LogInformation("User bio saved to database.");
            }
        }

        public void UpdateUserBio(UserBioRequest request)
        {
            var user = _context.Users.Include(u => u.Education)
                                    .Include(u => u.Jobs)
                                    .Include(u => u.Skills)
                                    .SingleOrDefault(u => u.UserId == request.UserId);
            if (user != null)
            {
                // Remove the old data
                _context.Educations.RemoveRange(user.Education);
                _context.Jobs.RemoveRange(user.Jobs);
                _context.Skills.RemoveRange(user.Skills);
                _context.SaveChanges();

                // Add new data
                foreach (var education in request.Educations)
                {
                    var updatedEducation = new Education
                    {
                        Degree = education.Degree,
                        Institution = education.Institution,
                        StartDate = education.StartDate,
                        EndDate = education.EndDate,
                        IsPublic = education.IsPublic,
                        UserId = user.UserId,
                        Level = education.Level  
                    };
                    user.Education.Add(updatedEducation);
                    _logger.LogInformation($"Updated Education: {education.Degree}, {education.Institution}");
                }

                foreach (var job in request.Jobs)
                {
                    var updatedJob = new Job
                    {
                        Position = job.Position,
                        Company = job.Company,
                        StartDate = job.StartDate,
                        EndDate = job.EndDate,
                        IsPublic = job.IsPublic,
                        UserId = user.UserId,
                        Level = job.Level, 
                        Industry = job.Industry 
                    };
                    user.Jobs.Add(updatedJob);
                    _logger.LogInformation($"Updated Job: {job.Position}, {job.Company}");
                }

                foreach (var skill in request.Skills)
                {
                    var updatedSkill = new Skill
                    {
                        SkillName = skill.SkillName,
                        Proficiency = skill.Proficiency,
                        IsPublic = skill.IsPublic,
                        UserId = user.UserId,
                    };
                    user.Skills.Add(updatedSkill);
                    _logger.LogInformation($"Updated Skill: {skill.SkillName}, {skill.Proficiency}");
                }

                _context.SaveChanges();
                _logger.LogInformation("User bio updated in the database.");
            }
        }
    }
}
