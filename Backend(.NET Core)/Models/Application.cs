// Models/Application.cs
namespace JobPortalAPI.Models
{
    public class Application
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int JobId { get; set; }
        public string Status { get; set; } = "Pending";
        public DateTime AppliedDate { get; set; } = DateTime.UtcNow;
        
        public string? ResumeUrl { get; set; }
        public string? PhoneNumber { get; set; }  

        // Navigation properties
        public User User { get; set; }
        public Job Job { get; set; }
    }
}