using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Job_Portal.Migrations
{
    /// <inheritdoc />
    public partial class AddResumeUrl : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "CoverLetter",
                table: "Applications",
                newName: "ResumeUrl");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "ResumeUrl",
                table: "Applications",
                newName: "CoverLetter");
        }
    }
}
