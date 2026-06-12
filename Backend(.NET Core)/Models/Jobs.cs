// ❌ using JobPortal.Models; → yeh line bilkul hata do

namespace JobPortalAPI.Models
{
    public class Job
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;        
        public string Description { get; set; } = string.Empty;  
        public string Salary { get; set; } = string.Empty;       
        public string Location { get; set; } = string.Empty;     
        public string Company { get; set; }    
        public string? JobType { get; set; }
        public DateTime PostedDate { get; set; } = DateTime.Now; 
        public DateTime DueDate { get; set; }
        public ICollection<Application> Applications { get; set; } = new List<Application>(); // ✅
    }
}