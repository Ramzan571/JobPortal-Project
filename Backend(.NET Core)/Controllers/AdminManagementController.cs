using JobPortalAPI.Data;
using JobPortalAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "SuperAdmin")]  // sirf SuperAdmin
public class AdminManagementController : ControllerBase
{
    private readonly AppDbContext _context;

    public AdminManagementController(AppDbContext context)
    {
        _context = context;
    }

    // GET — saare admins dekho
    [HttpGet]
    public async Task<IActionResult> GetAllAdmins()
    {
        var admins = await _context.Users
            .Where(u => u.Role == "Admin")
            .Select(u => new {
                u.Id,
                u.Name,
                u.Email,
                u.Role
            })
            .ToListAsync();

        return Ok(admins);
    }

    // POST — naya admin banao
    [HttpPost]
    public async Task<IActionResult> CreateAdmin([FromBody] CreateAdminDto dto)
    {
        if (_context.Users.Any(u => u.Email == dto.Email))
            return BadRequest("Yeh email pehle se exist karti hai");

        var admin = new User
        {
            Name = dto.Name,
            Email = dto.Email,
            Password = BCrypt.Net.BCrypt.HashPassword(dto.Password),
            Role = "Admin"
        };

        _context.Users.Add(admin);
        await _context.SaveChangesAsync();

        return Ok(new { message = "Admin create ho gaya!", admin.Id, admin.Name, admin.Email });
    }

    // PUT — admin update karo
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAdmin(int id, [FromBody] UpdateAdminDto dto)
    {
        var admin = await _context.Users.FindAsync(id);
        if (admin == null || admin.Role != "Admin")
            return NotFound("Admin nahi mila");

        admin.Name = dto.Name ?? admin.Name;
        admin.Email = dto.Email ?? admin.Email;

        if (!string.IsNullOrEmpty(dto.Password))
            admin.Password = BCrypt.Net.BCrypt.HashPassword(dto.Password);

        await _context.SaveChangesAsync();
        return Ok(new { message = "Admin update ho gaya!" });
    }

    // DELETE — admin delete karo
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAdmin(int id)
    {
        var admin = await _context.Users.FindAsync(id);
        if (admin == null || admin.Role != "Admin")
            return NotFound("Admin nahi mila");

        _context.Users.Remove(admin);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Admin delete ho gaya!" });
    }
}