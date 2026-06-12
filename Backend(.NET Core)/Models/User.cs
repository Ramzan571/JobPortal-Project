namespace JobPortalAPI.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;     // ✅
        public string Email { get; set; } = string.Empty;    // ✅
        public string Password { get; set; } = string.Empty; // ✅
        public string Role { get; set; } = string.Empty;     // ✅

        public ICollection<Application> Applications { get; set; } = new List<Application>(); // ✅
    }
}