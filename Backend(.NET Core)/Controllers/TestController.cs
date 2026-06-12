using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class TestController : ControllerBase
{
    // ✅ Sirf Admin access kar sakta hai
    [HttpGet("admin-panel")]
    [Authorize(Roles = "Admin")]
    public IActionResult AdminPanel()
    {
        return Ok(new
        {
            message = "Welcome Admin! You can Post/Edit/Delete Jobs.",
            panel = "Admin Dashboard"
        });
    }

    // ✅ Sirf User access kar sakta hai
    [HttpGet("user-panel")]
    [Authorize(Roles = "User")]
    public IActionResult UserPanel()
    {
        return Ok(new
        {
            message = "Welcome User! You can View and Apply for Jobs.",
            panel = "User Dashboard"
        });
    }

    // ✅ Dono access kar sakte hain
    [HttpGet("my-info")]
    [Authorize]
    public IActionResult MyInfo()
    {
        var email = User.FindFirst(ClaimTypes.Email)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        var id = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        return Ok(new
        {
            userId = id,
            email = email,
            role = role,
            message = $"You are logged in as {role}"
        });
    }
}