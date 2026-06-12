// DTOs/CreateAdminDto.cs
public class CreateAdminDto
{
    public string Name { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
}

// DTOs/UpdateAdminDto.cs
public class UpdateAdminDto
{
    public string? Name { get; set; }
    public string? Email { get; set; }
    public string? Password { get; set; }
}
