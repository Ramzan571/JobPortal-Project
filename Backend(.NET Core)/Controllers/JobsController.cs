using JobPortalAPI.Data;
using JobPortalAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class JobsController : ControllerBase
{
    // AppDbContext woh class hai jo database se baat karti hai
    private readonly AppDbContext _context;

    public JobsController(AppDbContext context)
    {
        _context = context;
    }

    // GET /api/jobs — Saari jobs lao (koi bhi dekh sakta hai)
    [HttpGet]
    public async Task<IActionResult> GetAllJobs()
    {
        var jobs = await _context.Jobs.ToListAsync();
        return Ok(jobs);
    }

    // GET /api/jobs/5 — Ek specific job lao
    [HttpGet("{id}")]
    public async Task<IActionResult> GetJob(int id)
    {
        var job = await _context.Jobs.FindAsync(id);
        if (job == null) return NotFound("Job nahi mili");
        return Ok(job);
    }

    // POST /api/jobs — Nayi job add karo (sirf Admin)
    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> AddJob([FromBody] Job job)
    {
        _context.Jobs.Add(job);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Job add ho gayi!", job });
    }

    // PUT /api/jobs/5 — Job update karo (sirf Admin)
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateJob(int id, [FromBody] Job updatedJob)
    {
        var job = await _context.Jobs.FindAsync(id);
        if (job == null) return NotFound("Job nahi mili");

        // Values update karo
        job.Title = updatedJob.Title;
        job.Description = updatedJob.Description;
        job.Salary = updatedJob.Salary;
        job.Location = updatedJob.Location;

        await _context.SaveChangesAsync();
        return Ok(new { message = "Job update ho gayi!" });
    }

    // DELETE /api/jobs/5 — Job delete karo (sirf Admin)
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteJob(int id)
    {
        var job = await _context.Jobs.FindAsync(id);
        if (job == null) return NotFound("Job nahi mili");

        _context.Jobs.Remove(job);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Job delete ho gayi!" });
    }
}