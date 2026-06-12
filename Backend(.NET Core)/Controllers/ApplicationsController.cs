// Controllers/ApplicationsController.cs
using Job_Portal.DTOs;
using JobPortalAPI.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class ApplicationsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ApplicationsController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/applications — SuperAdmin/Admin saari applications dekhe
    [HttpGet]
    [Authorize(Roles = "Admin,SuperAdmin")]
    public async Task<IActionResult> GetAll()
    {
        var applications = await _context.Applications
            .Include(a => a.User)
            .Include(a => a.Job)
            .Select(a => new {
                a.Id,
                userName = a.User.Name,
                userEmail = a.User.Email,
                jobTitle = a.Job.Title,
                company = a.Job.Company,
                phoneNumber = a.PhoneNumber,
                resumeUrl = a.ResumeUrl,
                a.Status,
                appliedAt = a.AppliedDate
            })
            .ToListAsync();

        return Ok(applications);
    }

    // POST /api/applications/{jobId} — User job pe apply kare
    [HttpPost("{jobId}")]
    [Authorize]
    public async Task<IActionResult> Apply(int jobId, [FromForm] ApplyFormDto dto)
    {
        var userId = int.Parse(User.FindFirst(
            System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

        bool alreadyApplied = await _context.Applications
            .AnyAsync(a => a.UserId == userId && a.JobId == jobId);

        if (alreadyApplied)
            return BadRequest("Aap pehle hi apply kar chuke hain");

        var job = await _context.Jobs.FindAsync(jobId);
        if (job == null) return NotFound("Job nahi mili");

        string? resumeUrl = null;

        if (dto.Resume != null && dto.Resume.Length > 0)
        {
            var uploadsFolder = Path.Combine(
                Directory.GetCurrentDirectory(), "wwwroot", "resumes");

            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            var fileName = $"resume_{userId}_{jobId}_{Guid.NewGuid()}.pdf";
            var fullPath = Path.Combine(uploadsFolder, fileName);

            using (var stream = System.IO.File.Create(fullPath))
            {
                await dto.Resume.CopyToAsync(stream);
            }

            resumeUrl = $"/resumes/{fileName}";
        }

        var application = new JobPortalAPI.Models.Application
        {
            UserId = userId,
            JobId = jobId,
            Status = "Pending",
            AppliedDate = DateTime.UtcNow,
            PhoneNumber = dto.PhoneNumber,
            ResumeUrl = resumeUrl,
        };

        _context.Applications.Add(application);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Application submit ho gayi!" });
    }

    // GET /api/applications/my — User apni applications dekhe
    [HttpGet("my")]
    [Authorize]
    public async Task<IActionResult> GetMyApplications()
    {
        var userId = int.Parse(User.FindFirst(
            System.Security.Claims.ClaimTypes.NameIdentifier)!.Value);

        var applications = await _context.Applications
            .Where(a => a.UserId == userId)
            .Include(a => a.Job)
            .Select(a => new {
                a.Id,
                jobTitle = a.Job.Title,
                company = a.Job.Company,
                location = a.Job.Location,
                a.Status,
                appliedAt = a.AppliedDate
            })
            .ToListAsync();

        return Ok(applications);
    }
}