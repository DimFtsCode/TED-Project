using System;
using System.IO;
using System.Linq;
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

        static void Main(string[] args)
        {
            
            /*** DEFAULT VALUES ***/ 
            int userCount = 100;        // Default to 100 users 
            // amount of connections for each user
            int leastConnectionCount = 15;
            int mostConnectionCount = 30;
            // amount of articles the user has posted
            int leastArticleCount = 2;  
            int mostArticleCount = 5;
            // amount of likes the user has given
            int leastLikeCount = 15;    
            int mostLikeCount = 30;
            // amount of comments the user has given
            int leastCommentCount = 5; 
            int mostCommentCount = 15;
            
            
            // Σύνδεση με τη βάση δεδομένων
            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();
            //optionsBuilder.UseSqlite("Data Source=D:/desktop/TED/Project/backend/MyApi/database.db");
            optionsBuilder.UseSqlite(@"Data Source=C:\Users\ziziz\Documents\DI\6ο εξάμηνο\ΤΕΔΙ\TED-Project\BackEnd\MyApi\database.db");

            using (var context = new AppDbContext(optionsBuilder.Options))
            {
                if (args.Length > 0 && int.TryParse(args[0], out int parsedCount))
                {
                    userCount = parsedCount; // get the user count from the command line 
                }

                // Create users
                List<User> users = CreateUsers(context, userCount);
                context.SaveChanges(); // Save once before generating interactions, to avoid foreign key conflicts
                System.Threading.Thread.Sleep(1000); // Sleep for 1 second
                Console.WriteLine($"Created {userCount} users.");


                // Generate sample connections between users (skip the admin)
                GenerateSampleConnections(context, users.Skip(1).ToList(), leastConnectionCount, mostConnectionCount);
                context.SaveChanges(); // Save all changes to the database
                System.Threading.Thread.Sleep(1000); // Sleep for 1 second
                Console.WriteLine($"Created {leastConnectionCount} to {mostConnectionCount} connections for each user.");

                // Generate sample articles 
                List<Article> articles = GenerateSampleArticles(context, users.Skip(1).ToList(), leastArticleCount, mostArticleCount);
                context.SaveChanges(); 
                System.Threading.Thread.Sleep(1000); 
                Console.WriteLine($"Created {leastArticleCount} to {mostArticleCount} articles for each user.");
                
                // Generate sample interactions to articles
                GenerateSampleInteractions(context, users.Skip(1).ToList(), articles, leastLikeCount, mostLikeCount, leastCommentCount, mostCommentCount);
                context.SaveChanges(); // Save all changes to the database
                Console.WriteLine("Created interactions between users and articles.");

                // // Print the created users 
                // foreach (var user in users)
                // {
                //     Console.WriteLine($"Created user: {user.FirstName} {user.LastName}, Email: {user.Email}, UserId: {user.UserId}");
                // }
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
            
            // File path to the stock profile pictures directory
            string stockProfilesPath = Path.Combine(Directory.GetCurrentDirectory(), "stockProfiles");
            string[] stockProfilePictures = Directory.GetFiles(stockProfilesPath, "*.jpg");

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

            // Τυχαία επιλογή εικόνας προφίλ για τον admin
            adminUser.PhotoData = LoadRadomProfilePicture(stockProfilePictures, stockProfilesPath, random);
            adminUser.PhotoMimeType = "image/jpeg";

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
                
                // Τυχαία επιλογή εικόνας προφίλ για τον χρήστη
                user.PhotoData = LoadRadomProfilePicture(stockProfilePictures, stockProfilesPath, random);
                user.PhotoMimeType = "image/jpeg";

                // Δημιουργία διαφημίσεων για τον χρήστη
                if (user.Jobs.Any())
                {
                    var lastJob = user.Jobs.Last();
                    //Console.WriteLine($"User: {user.Email}, Last Job: {lastJob.Position}, Level: {lastJob.Level}");

                    if ((int)lastJob.Level > (int)JobLevel.Senior)
                    {
                        //Console.WriteLine("Creating advertisement for user: " + user.Email);
                        Advertisement advertisement = CreateAdvertisementForUser(user, random);
                        user.Advertisements.Add(advertisement); // Προσθήκη αγγελίας στη λίστα του χρήστη
                    }
                }
                else
                {
                    //Console.WriteLine($"User: {user.Email} has no jobs.");
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
                UserId = user.UserId, // Σύνδεση της αγγελίας με τον χρήστη
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
    
        
        static void GenerateSampleConnections(AppDbContext context, List<User> users, int leastConnectionCount, int mostConnectionCount)
        {
            Random random = new Random();
            var friendships = new List<Friendship>();

            foreach (var user in users)
            {
                // determine the number of connections to create for the user
                int connectionsCount = random.Next(leastConnectionCount, mostConnectionCount + 1);

                var potentialConnections = users
                    .Where(u => u.UserId != user.UserId && // exclude the user itself
                                (u.Jobs.Any(job => user.Jobs.Any(uj => uj.Industry == job.Industry)) || // same industry
                                u.Education.Any(ed => user.Education.Any(ue => ed.Degree == ue.Degree)) || // same degree
                                u.Skills.Any(skill => user.Skills.Contains(skill)))) // same skills
                    .ToList();

                if (potentialConnections.Count < connectionsCount)
                {
                    connectionsCount = potentialConnections.Count;
                }
                if (connectionsCount == 0)
                {
                    // connect to 2 random users if no potential connections found
                    potentialConnections = users
                        .Where(u => u.UserId != user.UserId) // exclude user itself
                        .OrderBy(u => random.Next()) // shuffle the users
                        .Take(2)
                        .ToList();

                    connectionsCount = potentialConnections.Count; // == 2 
                }
            
                for (int i = 0; i < connectionsCount; i++)
                {
                    var connection = potentialConnections[random.Next(potentialConnections.Count)];

                    friendships.Add(new Friendship
                    {
                        UserId = user.UserId,
                        FriendId = connection.UserId,
                        FriendshipDate = DateTime.Now.AddDays(-random.Next(1, 365)),
                        IsAccepted = true // Automatically accept the connection
                    });

                    // Remove the connected user from the list to prevent duplicate connections
                    potentialConnections.Remove(connection);
                }
            }
            
            context.Friendships.AddRange(friendships);
        }
        
        static List<Article> GenerateSampleArticles(AppDbContext context, List<User> users, int leastArticleCount, int mostArticleCount)
        {
            var articles = new List<Article>();
            Random random = new Random();

            foreach (var user in users)
            {
                int articleCount = random.Next(leastArticleCount, mostArticleCount + 1); 

                for (int i = 0; i < articleCount; i++)
                {
                    // Generate a contextually consistent title and content
                    (string title, string content) = GenerateArticle(user, random);
                    var article = new Article
                    {
                        Title = title,
                        Content = content,
                        PostedDate = DateTime.Now.AddDays(-random.Next(1, 365)),
                        AuthorId = user.UserId
                    };

                    articles.Add(article);
                }
            }

            context.Articles.AddRange(articles);
            return articles;
        }
        
        static void GenerateSampleInteractions(AppDbContext context, List<User> users, List<Article> articles, int leastLikeCount, int mostLikeCount, int leastCommentCount, int mostCommentCount)
        {
            var likes = new List<Like>();
            var comments = new List<Comment>();
            var vectors = new List<ArticleVector>();

            Random random = new Random();

            foreach (var user in users)
            {
                // Get connected users' articles
                var connectedUserIds = context.Friendships.Where(f => f.UserId == user.UserId).Select(f => f.FriendId).ToList();
                var connectedArticles = articles.Where(a => connectedUserIds.Contains(a.AuthorId)).ToList();
                var otherArticles = articles.Except(connectedArticles).ToList();    // articles of the rest of the users

                // Generate Likes 
                int likeCount = random.Next(leastLikeCount, mostLikeCount + 1);
                int connectedLikes = (int)(likeCount * 0.8); // 80% of likes are on connected users' articles
                int otherLikes = likeCount - connectedLikes;
                
                likes.AddRange(GenerateLikesForArticles(user.UserId, connectedArticles, connectedLikes, vectors, random));      
                likes.AddRange(GenerateLikesForArticles(user.UserId, otherArticles, otherLikes, vectors, random));

                // Generate Comments
                int commentCount = random.Next(leastCommentCount, mostCommentCount + 1);
                int connectedComments = (int)(commentCount * 0.8); // 80% of comments are on connected users' articles
                int otherComments = commentCount - connectedComments;

                comments.AddRange(GenerateCommentsForArticles(user.UserId, connectedArticles, connectedComments, vectors, random));
                comments.AddRange(GenerateCommentsForArticles(user.UserId, otherArticles, otherComments, vectors, random));
            }

            context.Likes.AddRange(likes);
            context.Comments.AddRange(comments);
            context.ArticleVectors.AddRange(vectors);
        }

        static List<Like> GenerateLikesForArticles(int userId, List<Article> articles, int likeCount, List<ArticleVector> vectors, Random random)
        {
            var likes = new List<Like>();

            for (int i = 0; i < likeCount; i++)
            {
                var article = articles[random.Next(articles.Count)];

                likes.Add(new Like
                {
                    ArticleId = article.ArticleId,
                    LikerId = userId
                    
                });

                // Create and add a vector for the like interaction
                vectors.Add(new ArticleVector
                {
                    ArticleId = article.ArticleId,
                    AuthorId = article.AuthorId,
                    UserId = userId,
                    InteractionType = 1 // 1 for like
                });
            }

            return likes;
        }

        static List<Comment> GenerateCommentsForArticles(int userId, List<Article> articles, int commentCount, List<ArticleVector> vectors, Random random)
        {
            var comments = new List<Comment>();

            for (int i = 0; i < commentCount; i++)
            {
                var article = articles[random.Next(articles.Count)];

                comments.Add(new Comment
                {
                    ArticleId = article.ArticleId,
                    CommenterId = userId,
                    Content = GenerateCommentContent(random),
                    PostedDate = DateTime.Now.AddDays(-random.Next(1, 365))
                });

                // Create and add a vector for the comment interaction
                vectors.Add(new ArticleVector
                {
                    ArticleId = article.ArticleId,
                    AuthorId = article.AuthorId,
                    UserId = userId,
                    InteractionType = 2 // 2 for comment
                });
            }

            return comments;
        }
        
        static byte[] LoadRadomProfilePicture(string[] stockProfilePictures, string stockProfilesPath, Random random)
        {   
            if (stockProfilePictures.Length == 0)
            {
                throw new Exception("No stock profile pictures found.");
            }
            // Τυχαία επιλογή εικόνας προφίλ από τον κατάλογο stockProfiles
            string selectedProfilePath = stockProfilePictures[random.Next(stockProfilePictures.Length)];
            return File.ReadAllBytes(selectedProfilePath);
        }
    
        static (string title, string content) GenerateArticle(User user, Random random)
        {
            List<(string title, string content)> articleOptions = new List<(string title, string content)>();

            // Check if the user has a recent job and generate an article based on it
            var latestJob = user.Jobs.LastOrDefault();
            if (latestJob != null)
            {
                articleOptions.Add(($"Excited to start my new role at {latestJob.Company}",
                    $"I’m thrilled to share that I’ve joined {latestJob.Company} as a {latestJob.Position}. Looking forward to the journey ahead!"));
                
                articleOptions.Add(($"Reflecting on my journey at {latestJob.Company}",
                    $"After {user.Jobs.Sum(j => (j.EndDate - j.StartDate).Days / 365)} years at {latestJob.Company}, I’ve learned so much about {latestJob.Industry}. Here are some key takeaways..."));
                
                articleOptions.Add(($"Key learnings from my time at {latestJob.Company}",
                    $"Reflecting on my time at {latestJob.Company} as a {latestJob.Position}, I’ve realized how much I’ve grown both personally and professionally. Here’s what I’ve learned..."));
            }

            // Check if the user has recently completed a degree and generate an article based on it
            var latestEducation = user.Education.LastOrDefault();
            if (latestEducation != null)
            {
                articleOptions.Add(($"Just finished my {latestEducation.Degree}",
                    $"Today, I officially completed my {latestEducation.Degree} from {latestEducation.Institution}. Excited for what the future holds!"));
            }

            // Add more custom article options based on the user context as needed
            articleOptions.Add(("Sharing some thoughts on my recent project",
                "It’s been an incredible journey working on these projects. I’ve gained invaluable experience and can’t wait to apply this knowledge moving forward."));
            
            articleOptions.Add(("Just wrapped up a major project",
                "Just wrapped up a major project and wanted to share some insights on what we accomplished and the lessons learned along the way."));

            // Randomly select one of the contextually consistent articles
            return articleOptions[random.Next(articleOptions.Count)];
        }
    
        static string GenerateCommentContent(Random random)
        {
            List<string> commentOptions = new List<string>
            {
                "Great article!",
                "I found this very insightful.",
                "Thanks for sharing!",
                "Really enjoyed reading this.",
                "This was very helpful.",
                "Keep up the good work!",
                "This was a great read.",
                "wow, amazing!",
                "Nice",
                "Good job!",
            };

            return commentOptions[random.Next(commentOptions.Count)];
        }
    }
}
