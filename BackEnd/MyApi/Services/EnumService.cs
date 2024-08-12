using MyApi.Models.Enums;
using System;
using System.Collections.Generic;
using System.Linq;

namespace MyApi.Services
{
    public class EnumService
    {
        public Dictionary<string, List<string>> GetAllEnums()
        {
            var enums = new Dictionary<string, List<string>>();

            enums.Add(nameof(Degree), Enum.GetNames(typeof(Degree)).ToList());
            enums.Add(nameof(EducationLevel), Enum.GetNames(typeof(EducationLevel)).ToList());
            enums.Add(nameof(JobIndustry), Enum.GetNames(typeof(JobIndustry)).ToList());
            enums.Add(nameof(JobLevel), Enum.GetNames(typeof(JobLevel)).ToList());
            enums.Add(nameof(JobPosition), Enum.GetNames(typeof(JobPosition)).ToList());
            enums.Add(nameof(SkillCategory), Enum.GetNames(typeof(SkillCategory)).ToList());

            return enums;
        }
    }
}
