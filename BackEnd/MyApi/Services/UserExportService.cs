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
                        Degree = e.Degree ?? string.Empty,
                        Institution = e.Institution ?? string.Empty,
                        StartDate = e.StartDate,
                        EndDate = e.EndDate,
                        UserId = e.UserId
                    }).ToList(),
                    Jobs = u.Jobs.Select(j => new Job
                    {
                        JobId = j.JobId,
                        Position = j.Position ?? string.Empty,
                        Company = j.Company ?? string.Empty,
                        StartDate = j.StartDate,
                        EndDate = j.EndDate,
                        UserId = j.UserId
                    }).ToList(),
                    Skills = u.Skills.Select(s => new Skill
                    {
                        SkillId = s.SkillId,
                        SkillName = s.SkillName ?? string.Empty,
                        Proficiency = s.Proficiency ?? string.Empty,
                        UserId = s.UserId
                    }).ToList()
                })
                .ToList();
        }
    }
}
