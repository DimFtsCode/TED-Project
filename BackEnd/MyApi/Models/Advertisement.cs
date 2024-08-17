using MyApi.Models.Enums;

namespace MyApi.Models
{

    public class Advertisement
    {
        public int AdvertisementId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public DateTime PostedDate { get; set; }

        // Ελάχιστες απαιτήσεις εκπαίδευσης για την αγγελία
        public Degree RequiredDegree { get; set; } 
        public EducationLevel RequiredEducationLevel { get; set; }

        // Ελάχιστες απαιτήσεις εργασιακής εμπειρίας για την αγγελία
        public JobPosition RequiredPosition { get; set; } 
        public JobIndustry RequiredIndustry { get; set; } 
        public JobLevel RequiredJobLevel { get; set; } 
        public int MinimumYearsExperience { get; set; }

        // Ελάχιστες απαιτήσεις δεξιοτήτων για την αγγελία
        public SkillCategory RequiredSkill { get; set; }

        // Συσχέτιση με τον χρήστη που δημοσίευσε την αγγελία
        public int UserId { get; set; } // Συσχέτιση με τον χρήστη

        // Λίστα των UserId των χρηστών που έχουν κάνει αίτηση
        public List<int> ApplicantUserIds { get; set; } = new List<int>();
    }
}
