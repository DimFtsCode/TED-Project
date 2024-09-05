using MyApi.Models.Enums;

namespace MyApi.Models
{

    public class AdvertisementVector
    {
        public int AdvertisementVectorId { get; set; } // Primary Key
        public int AdvertisementId { get; set; } // Foreign key
        public int RequiredDegree { get; set; } 
        public int RequiredEducationLevel { get; set; }
        public int RequiredPosition { get; set; }
        public int RequiredIndustry { get; set; }
        public int RequiredJobLevel { get; set; }
        public int RequiredSkill { get; set; }
        public int UserId { get; set; } 
    }
}
