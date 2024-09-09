using MyApi.Data;
using MyApi.Models;
using System.Collections.Generic;
using System.Linq;

namespace MyApi.Services
{
    public class UserExportService
    {
        private readonly AppDbContext _context;

        public UserExportService(AppDbContext context)
        {
            _context = context;
        }

        public List<ExportUser> GetUsersByIds(List<int> userIds)
        {
            return _context.Users
                .Where(u => userIds.Contains(u.UserId))
                .Select(u => new ExportUser
                {
                    UserId = u.UserId,
                    FirstName = u.FirstName ?? string.Empty,
                    LastName = u.LastName ?? string.Empty,
                    Email = u.Email ?? string.Empty,
                    PhoneNumber = u.PhoneNumber,
                    DateOfBirth = u.DateOfBirth,
                    Address = u.Address,
                    Admin = u.Admin,
                    Educations = u.Education.Select(e => new Education
                    {
                        EducationId = e.EducationId,
                        Degree = e.Degree,  // Use of Degree enum
                        Level = e.Level,    // Use of EducationLevel enum
                        Institution = e.Institution ?? string.Empty,
                        StartDate = e.StartDate,
                        EndDate = e.EndDate,
                        UserId = e.UserId,
                        IsPublic = e.IsPublic
                    }).ToList(),
                    Jobs = u.Jobs.Select(j => new Job
                    {
                        JobId = j.JobId,
                        Position = j.Position,  // Use of JobPosition enum
                        Industry = j.Industry,  // Use of JobIndustry enum
                        Level = j.Level,        // Use of JobLevel enum
                        Company = j.Company ?? string.Empty,
                        StartDate = j.StartDate,
                        EndDate = j.EndDate,
                        UserId = j.UserId,
                        IsPublic = j.IsPublic
                    }).ToList(),
                    Skills = u.Skills.Select(s => new Skill
                    {
                        SkillId = s.SkillId,
                        SkillName = s.SkillName,  // Use of  SkillCategory enum
                        Proficiency = s.Proficiency ?? string.Empty,
                        UserId = s.UserId,
                        IsPublic = s.IsPublic
                    }).ToList()
                })
                .ToList();
        }
    }
}
