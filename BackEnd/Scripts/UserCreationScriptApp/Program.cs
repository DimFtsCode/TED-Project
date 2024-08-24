using System;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using MyApi.Models.Enums;
using MyApi.Models;
using MyApi.Data; 
//dotnet run --project ./Scripts/UserCreationScriptApp/UserCreationScriptApp.csproj 100
namespace UserCreationScript
{
    class Program
    {
        // Static variables to ensure unique IDs

        static void Main(string[] args)
        {
            // Σύνδεση με τη βάση δεδομένων
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            //optionsBuilder.UseSqlite("Data Source=D:/desktop/TED/Project/backend/MyApi/database.db");
            optionsBuilder.UseSqlite(@"Data Source=C:\Users\ziziz\Documents\DI\6ο εξάμηνο\ΤΕΔΙ\TED-Project\BackEnd\MyApi\database.db");

            using (var context = new AppDbContext(optionsBuilder.Options))
            {
                int userCount = 100; // Default to 100 users

                if (args.Length > 0 && int.TryParse(args[0], out int parsedCount))
                {
                    userCount = parsedCount;
                }

                List<User> users = CreateUsers(context, userCount);
                List<Article> articles = GenerateSampleArticles(context, users);
                GenerateSampleInteractions(context, users, articles);

                // Save all changes to the database
                context.SaveChanges();

                // Print the created users 
                foreach (var user in users)
                {
                    Console.WriteLine($"Created user: {user.FirstName} {user.LastName}, Email: {user.Email}, UserId: {user.UserId}");
                }
            }
        }

        static List<User> CreateUsers(AppDbContext context, int userCount)
        {
            List<string> firstNames = new List<string>
            {
                "John", "Jane", "Alex", "Emily", "Chris", "Katie", "Michael", "Sarah", "David", "Laura",
                "Robert", "Linda", "James", "Mary", "William", "Patricia", "Richard", "Barbara", "Charles", "Jennifer"
            };

            List<string> lastNames = new List<string>
            {
                "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", "Moore", "Taylor",
                "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin", "Thompson", "Garcia", "Martinez", "Robinson",
                "Clark", "Rodriguez", "Lewis", "Lee", "Walker", "Hall", "Allen", "Young", "Hernandez", "King"
            };

            List<string> universities = new List<string>
            {
                "Harvard", "Stanford", "MIT", "Cambridge", "Oxford", "Yale", "Princeton", "Columbia", "UCLA", "UC Berkeley",
                "University of Toronto", "University of Melbourne", "National University of Singapore", "University of Tokyo",
                "ETH Zurich", "Peking University", "University of Hong Kong", "Seoul National University", "Tsinghua University", "University of Sydney"
            };

            // Ξεχωριστές λίστες εταιρειών για κάθε JobIndustry
            List<string> technologyCompanies = new List<string>
            {
                "Google", "Microsoft", "Apple", "Amazon", "Facebook", "Tesla", "Netflix", "IBM", "Intel", "Cisco"
            };

            List<string> healthcareCompanies = new List<string>
            {
                "Pfizer", "Johnson & Johnson", "Roche", "Novartis", "Merck", "Gilead Sciences", "Sanofi", "AbbVie", "Amgen", "Bristol-Myers Squibb"
            };

            List<string> energyCompanies = new List<string>
            {
                "ExxonMobil", "Chevron", "Shell", "BP", "Total", "Schlumberger", "Halliburton", "Baker Hughes", "ConocoPhillips", "Valero Energy"
            };

            List<string> transportationCompanies = new List<string>
            {
                "DHL", "FedEx", "United Parcel Service", "Maersk", "Caterpillar", "Boeing", "Airbus", "General Motors", "Ford", "Toyota"
            };

            List<string> educationCompanies = new List<string>
            {
                "Pearson", "McGraw-Hill", "Houghton Mifflin Harcourt", "Cengage Learning", "Scholastic", "Wiley", "Cambridge University Press",
                "Oxford University Press", "Hachette Livre", "Macmillan Education"
            };

            List<string> creativeCompanies = new List<string>
            {
                "WarnerMedia", "Walt Disney", "Comcast", "Sony Pictures", "Universal Music Group", "Paramount Pictures", "Lionsgate", "HBO",
                "20th Century Studios", "NBCUniversal"
            };

            List<string> legalCompanies = new List<string>
            {
                "Kirkland & Ellis", "Latham & Watkins", "Baker McKenzie", "DLA Piper", "Skadden, Arps, Slate, Meagher & Flom",
                "Jones Day", "Sidley Austin", "Hogan Lovells", "Norton Rose Fulbright", "White & Case"
            };

            // Χαρτογράφηση Degree σε JobPosition
            Dictionary<Degree, List<JobPosition>> degreeToJobMap = new Dictionary<Degree, List<JobPosition>>
            {
                { Degree.ComputerScience, new List<JobPosition> { JobPosition.SoftwareEngineer, JobPosition.DataScientist, JobPosition.ITManager, JobPosition.CyberSecurityAnalyst } },
                { Degree.BusinessAdministration, new List<JobPosition> { JobPosition.ITManager, JobPosition.MarketingSpecialist, JobPosition.HealthcareAdministrator, JobPosition.LegalAssistant } },
                { Degree.MechanicalEngineering, new List<JobPosition> { JobPosition.CyberSecurityAnalyst, JobPosition.RenewableEnergyEngineer, JobPosition.LogisticsManager, JobPosition.TransportationEngineer } },
                { Degree.ElectricalEngineering, new List<JobPosition> { JobPosition.CyberSecurityAnalyst, JobPosition.RenewableEnergyEngineer } },
                { Degree.CivilEngineering, new List<JobPosition> { JobPosition.TransportationEngineer, JobPosition.LogisticsManager } },
                { Degree.Medicine, new List<JobPosition> { JobPosition.Nurse, JobPosition.MedicalTechnician, JobPosition.HealthcareAdministrator } },
                { Degree.Law, new List<JobPosition> { JobPosition.Lawyer, JobPosition.LegalAssistant } },
                { Degree.Psychology, new List<JobPosition> { JobPosition.AcademicCounselor, JobPosition.LegalAssistant } },
                { Degree.Education, new List<JobPosition> { JobPosition.Teacher, JobPosition.AcademicCounselor } },
                { Degree.Economics, new List<JobPosition> { JobPosition.MarketingSpecialist, JobPosition.LegalAssistant, JobPosition.SupplyChainAnalyst } },
                { Degree.NoDegree, new List<JobPosition> { JobPosition.ContentCreator, JobPosition.GraphicDesigner } }
            };

            // Χαρτογράφηση JobIndustry σε εταιρείες
            Dictionary<JobIndustry, List<string>> industryToCompanyMap = new Dictionary<JobIndustry, List<string>>
            {
                { JobIndustry.Technology, technologyCompanies },
                { JobIndustry.Healthcare, healthcareCompanies },
                { JobIndustry.Energy, energyCompanies },
                { JobIndustry.Transportation, transportationCompanies },
                { JobIndustry.Education, educationCompanies },
                { JobIndustry.Creative, creativeCompanies },
                { JobIndustry.Legal, legalCompanies }
            };

            List<User> users = new List<User>();
            Random random = new Random();


            // Admin user creation
            User adminUser = new User
            {
                FirstName = "admin",
                LastName = "admin",
                Email = "admin@example.com",
                PhoneNumber = $"555-000001",
                Password = "1234",
                DateOfBirth = DateTime.Now.AddYears(-30),
                Address = "Admin Address",
                Admin = true,
                PublicFields = new List<string> { "FirstName", "LastName", "Email" },
                Education = new List<Education>(), // Κενή λίστα εκπαίδευσης
                Jobs = new List<Job>(), // Κενή λίστα εργασιών
                Skills = new List<Skill>(), // Κενή λίστα δεξιοτήτων
                Advertisements = new List<Advertisement>() // Κενή λίστα διαφημίσεων
            };

            // Προσθήκη του admin στη λίστα των χρηστών
            users.Add(adminUser);

            // regular user creation
            for (int i = 1; i <= userCount; i++)
            {
                string firstName = firstNames[random.Next(firstNames.Count)];
                string lastName = lastNames[random.Next(lastNames.Count)];
                string email = $"user{i}@example.com";

                Degree degree = (Degree)random.Next(0, Enum.GetNames(typeof(Degree)).Length);
                List<JobPosition> possiblePositions = degreeToJobMap[degree];
                JobPosition position = possiblePositions[random.Next(possiblePositions.Count)];

                JobIndustry industry = GetIndustryFromPosition(position);
                List<string> companyList = industryToCompanyMap[industry];
                string company = companyList[random.Next(companyList.Count)];

                int age = random.Next(25, 66); // 25 to 65 years old
                DateTime dateOfBirth = DateTime.Now.AddYears(-age);

                User user = new User
                {
                    FirstName = firstName,
                    LastName = lastName,
                    Email = email,
                    PhoneNumber = $"555-010{i:D3}",
                    Password = $"1234",
                    DateOfBirth = dateOfBirth,
                    Address = $"Address {i}",
                    Admin = false,
                    PublicFields = new List<string> { "FirstName", "LastName", "Email" },
                    Education = GenerateRandomEducation(universities, random, degree, age),
                    Jobs = GenerateRandomJobs(position, industry, companyList, age), 
                    Skills = GenerateRandomSkills(random),
                    Advertisements = new List<Advertisement>() // Αρχικοποιούμε τη λίστα των διαφημίσεων
                };

                // Δημιουργία διαφημίσεων για τον χρήστη
                if (user.Jobs.Any())
                {
                    var lastJob = user.Jobs.Last();
                    Console.WriteLine($"User: {user.Email}, Last Job: {lastJob.Position}, Level: {lastJob.Level}");

                    if ((int)lastJob.Level > (int)JobLevel.Senior)
                    {
                        Console.WriteLine("Creating advertisement for user: " + user.Email);
                        Advertisement advertisement = CreateAdvertisementForUser(user, random);
                        user.Advertisements.Add(advertisement); // Προσθήκη αγγελίας στη λίστα του χρήστη
                    }
                }
                else
                {
                    Console.WriteLine($"User: {user.Email} has no jobs.");
                }

                users.Add(user);
            }

            // Αποθήκευση χρηστών μαζί με τις διαφημίσεις τους στη βάση δεδομένων
            context.Users.AddRange(users);
            return users;
        }
                
        static List<Education> GenerateRandomEducation(List<string> universities, Random random, Degree degree, int age)
        {
            var educationList = new List<Education>();
            int currentAge = age;

            // Περίπτωση NoDegree - Προσθέτει μόνο εκπαίδευση λυκείου
            if (random.NextDouble() >= 0.9)
            {
                var education = new Education
                {
                    Degree = Degree.NoDegree,
                    Level = EducationLevel.HighSchool,
                    Institution = "High School",
                    StartDate = DateTime.Now.AddYears(-currentAge + 15),
                    EndDate = DateTime.Now.AddYears(-currentAge + 18),
                    IsPublic = true
                };
                educationList.Add(education);
                return educationList;
            }

            // Υπολογισμός ημερομηνιών από το παλαιότερο προς το νεότερο επίπεδο σπουδών
            DateTime currentDate = DateTime.Now;

            // Προπτυχιακό επίπεδο (Bachelor) - 80% πιθανότητα να το έχει ολοκληρώσει
            if (random.NextDouble() < 0.89)
            {
                int bachelorDuration = random.Next(3, 6); // Διάρκεια 3-5 χρόνια
                var bachelor = new Education
                {
                    Degree = degree,
                    Level = EducationLevel.Bachelor,
                    Institution = universities[random.Next(universities.Count)],
                    StartDate = DateTime.Now.AddYears(-currentAge + 18),
                    EndDate = DateTime.Now.AddYears(-currentAge + 18 + bachelorDuration),
                    IsPublic = true
                };
                educationList.Add(bachelor);

                
            }

            // Μεταπτυχιακό επίπεδο (Master) - 50% πιθανότητα αν έχει ολοκληρώσει το Bachelor
            if (educationList.Any(e => e.Level == EducationLevel.Bachelor) && random.NextDouble() < 0.4 && currentAge >= 26)
            {
                int masterDuration = random.Next(1, 4); // Διάρκεια 1-3 χρόνια
                int ageStart = random.Next(1,4);

                var master = new Education
                {
                    Degree = degree,
                    Level = EducationLevel.Master,
                    Institution = universities[random.Next(universities.Count)],
                    StartDate = DateTime.Now.AddYears(-currentAge + 22 + ageStart),
                    EndDate = DateTime.Now.AddYears(-currentAge + 22 + ageStart + masterDuration),
                    IsPublic = true
                };
                educationList.Add(master);

                
            }

            // Διδακτορικό επίπεδο (Doctorate) - 10% πιθανότητα αν έχει ολοκληρώσει το Master
            if (educationList.Any(e => e.Level == EducationLevel.Bachelor) && random.NextDouble() < 0.07 && currentAge >= 31)
            {
                int doctorateDuration = random.Next(4, 8); // Διάρκεια 4-7 χρόνια
                int ageStart = random.Next(1,4);

                var doctorate = new Education
                {
                    Degree = degree,
                    Level = EducationLevel.Doctorate,
                    Institution = universities[random.Next(universities.Count)],
                    StartDate = DateTime.Now.AddYears(-currentAge + 22 + ageStart),
                    EndDate = DateTime.Now.AddYears(-currentAge + 22 + ageStart + doctorateDuration),
                    IsPublic = true
                };
                educationList.Add(doctorate);

                
            }

            return educationList;
        }


        static List<Job> GenerateRandomJobs(JobPosition position, JobIndustry industry, List<string> companies, int age)
        {
            var jobList = new List<Job>();
            Random random = new Random();

            int currentAge = 25; // Ξεκινάμε την εργασία στην ηλικία των 25
            int yearsWorked = age - 25;

            JobLevel currentLevel = JobLevel.Internship;
            string currentCompany = companies[random.Next(companies.Count)];
            DateTime lastEndDate = DateTime.Now.AddYears(-yearsWorked); // Ξεκινάμε με την ημερομηνία που ο χρήστης γίνεται 25 ετών

            while (yearsWorked > 0)
            {
                int jobDuration;
                if (currentLevel == JobLevel.Internship)
                {
                    jobDuration = 1; // Το Internship διαρκεί το πολύ 1 χρόνο
                }
                else
                {
                    jobDuration = random.Next(1, Math.Min(10, yearsWorked)); // Οι επόμενες δουλειές διαρκούν 1-6 χρόνια
                }

                // Υπολογισμός ημερομηνιών
                DateTime startDate = lastEndDate; // Ξεκινάει από την ημερομηνία που τελείωσε η προηγούμενη εργασία
                DateTime endDate = startDate.AddYears(jobDuration).AddMonths(random.Next(0, 5));

                // Διασφάλιση ότι το endDate δεν θα υπερβαίνει την τρέχουσα ημερομηνία
                if (endDate > DateTime.Now)
                {
                    endDate = DateTime.Now;
                    yearsWorked = 0; // Ορίζουμε τα υπόλοιπα χρόνια εργασίας σε 0 για να σταματήσει ο βρόχος
                }

                // Προσθήκη της εργασίας στη λίστα
                var job = new Job
                {
                    Position = position,
                    Industry = industry,
                    Level = currentLevel,
                    Company = currentCompany,
                    StartDate = startDate,
                    EndDate = endDate,
                    IsPublic = true
                };

                jobList.Add(job);

                // Ενημέρωση της ηλικίας και των υπόλοιπων ετών εργασίας
                currentAge += jobDuration;
                yearsWorked -= jobDuration;
                lastEndDate = endDate;

                // Αλλαγή εταιρίας ή/και προαγωγή
                if (random.Next(0, 100) < 80) // 80% πιθανότητα να παραμείνει στην ίδια εταιρία κατά την προαγωγή
                {
                    currentCompany = companies[random.Next(companies.Count)]; // Επιλέγει νέα εταιρία
                }

                if (currentLevel == JobLevel.Internship)
                {
                    currentLevel = JobLevel.Junior; // 100% προαγωγή από Internship σε Entry
                }
                else if (currentLevel > JobLevel.Internship)
                {
                    // Αύξηση του currentLevel βάσει της διάρκειας της προηγούμενης εργασίας
                    if (jobDuration > 0 && random.NextDouble() < 0.5) // Πιθανότητα 50%
                    {
                        currentLevel += 1; // +1 επίπεδο αν η προηγούμενη εργασία ήταν μέχρι 2 χρόνια
                    }
                    if (jobDuration > 3 && random.NextDouble() < 0.3) // Πιθανότητα 20%
                    {
                        currentLevel += 2; // +2 επίπεδα αν η προηγούμενη εργασία ήταν 2-4 χρόνια
                    }
                    if (jobDuration > 8 && random.NextDouble() < 0.2) // Πιθανότητα 10%
                    {
                        currentLevel += 3; // +3 επίπεδα αν η προηγούμενη εργασία ήταν 4-6 χρόνια
                    }

                    // Εξασφάλιση ότι το currentLevel δεν θα ξεπεράσει το μέγιστο επίπεδο
                    if (currentLevel > JobLevel.Executive)
                    {
                        currentLevel = JobLevel.Executive; // Μέγιστο επίπεδο είναι το Executive
                    }
                }
            }

            return jobList;
        }


        static List<Skill> GenerateRandomSkills(Random random)
        {
            var skillList = new List<Skill>();

            int skillCount = random.Next(1, 2); // Each user will have 1-4 skills

            for (int i = 0; i < skillCount; i++)
            {
                var skill = new Skill
                {
                    SkillName = (SkillCategory)random.Next(0, Enum.GetNames(typeof(SkillCategory)).Length),
                    Proficiency = $"Proficiency {i + 1}",
                    IsPublic = true
                };

                skillList.Add(skill);
            }

            return skillList;
        }


        static Advertisement CreateAdvertisementForUser(User user, Random random)
        {   


            DateTime startDate = DateTime.Now.AddMonths(-6);
            DateTime endDate = DateTime.Now;
            int range = (endDate - startDate).Days;
            DateTime randomDate = startDate.AddDays(random.Next(range));    
            // Βρείτε το τελευταίο Job του χρήστη
            var lastJob = user.Jobs.Last();

            // Δημιουργία θέσης για ένα μικρότερο επίπεδο από το τρέχον επίπεδο
            JobLevel newJobLevel = (JobLevel)random.Next(0, (int)lastJob.Level - 1);

            // Δημιουργία αγγελίας με μικρότερο επίπεδο
            return new Advertisement
            {
                Title = $"New {newJobLevel} Position at {lastJob.Company}",
                Description = $"We're looking for a {newJobLevel} in the field of {lastJob.Industry}.",
                PostedDate = randomDate,
                RequiredDegree = user.Education.FirstOrDefault()?.Degree ?? Degree.NoDegree,
                RequiredEducationLevel = user.Education.FirstOrDefault()?.Level ?? EducationLevel.HighSchool,
                RequiredPosition = lastJob.Position,
                RequiredIndustry = lastJob.Industry,
                RequiredJobLevel = newJobLevel,
                MinimumYearsExperience = (newJobLevel == JobLevel.Internship) ? 0 : random.Next(0, 3), // Υπολογισμός εμπειρίας
                RequiredSkill = user.Skills.FirstOrDefault()?.SkillName ?? SkillCategory.Communication, // Χρήση δεξιοτήτων του χρήστη
                User = user,
                ApplicantUserIds = new List<int>()
            };
        }

        static JobIndustry GetIndustryFromPosition(JobPosition position)
        {
            switch (position)
            {
                case JobPosition.SoftwareEngineer:
                case JobPosition.DataScientist:
                case JobPosition.ITManager:
                case JobPosition.CyberSecurityAnalyst:
                    return JobIndustry.Technology;
                case JobPosition.Nurse:
                case JobPosition.Pharmacist:
                case JobPosition.MedicalTechnician:
                case JobPosition.HealthcareAdministrator:
                    return JobIndustry.Healthcare;
                case JobPosition.EnergyConsultant:
                case JobPosition.RenewableEnergyEngineer:
                    return JobIndustry.Energy;
                case JobPosition.LogisticsManager:
                case JobPosition.TransportationEngineer:
                case JobPosition.SupplyChainAnalyst:
                    return JobIndustry.Transportation;
                case JobPosition.Teacher:
                case JobPosition.AcademicCounselor:
                    return JobIndustry.Education;
                case JobPosition.GraphicDesigner:
                case JobPosition.ContentCreator:
                case JobPosition.MarketingSpecialist:
                    return JobIndustry.Creative;
                case JobPosition.Lawyer:
                case JobPosition.LegalAssistant:
                    return JobIndustry.Legal;
                default:
                    throw new Exception("Unknown Job Position");
            }
        }
    
        static List<Article> GenerateSampleArticles(AppDbContext context, List<User> users)
        {
            var articles = new List<Article>();
            Random random = new Random();

            foreach (var user in users)
            {
                int articleCount = random.Next(1, 5); // Each user creates 1 to 4 articles

                for (int i = 0; i < articleCount; i++)
                {
                    var article = new Article
                    {
                        Title = $"Sample Article {i + 1} by {user.FirstName}",
                        Content = "This is a sample article content.",
                        PostedDate = DateTime.Now.AddDays(-random.Next(1, 365)),
                        Author = user
                    };

                    articles.Add(article);
                }
            }

            context.Articles.AddRange(articles);
            return articles;
        }
        static void GenerateSampleInteractions(AppDbContext context, List<User> users, List<Article> articles)
        {
            var likes = new List<Like>();
            var comments = new List<Comment>();
            Random random = new Random();

            foreach (var article in articles)
            {
                int likeCount = random.Next(1, 10); // Each article gets 1 to 21 likes
                int commentCount = random.Next(1, 5); // Each article gets 1 to 4 comments

                // Generate Likes
                for (int i = 0; i < likeCount; i++)
                {
                    var liker = users[random.Next(users.Count)];

                    var like = new Like
                    {
                        Article = article,
                        Liker = liker
                    };

                    likes.Add(like);
                }

                // Generate Comments
                for (int i = 0; i < commentCount; i++)
                {
                    var commenter = users[random.Next(users.Count)];

                    var comment = new Comment
                    {
                        Article = article,
                        Commenter = commenter,
                        Content = "This is a sample comment.",
                        PostedDate = DateTime.Now.AddDays(-random.Next(1, 365))
                    };

                    comments.Add(comment);
                }
            }

            context.Likes.AddRange(likes);
            context.Comments.AddRange(comments);
        }
    }
}
