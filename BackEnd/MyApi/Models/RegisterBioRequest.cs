namespace MyApi.Models
{
    public class RegisterBioRequest
    {
        public int UserId { get; set; }
        public List<string> Bio { get; set; } = new List<string>();
    }
}
