using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyApi.Migrations
{
    /// <inheritdoc />
    public partial class AddAdvertisementVector : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AdvertisementVectors",
                columns: table => new
                {
                    AdvertisementVectorId = table.Column<int>(type: "INTEGER", nullable: false)
                        .Annotation("Sqlite:Autoincrement", true),
                    RequiredDegree = table.Column<int>(type: "INTEGER", nullable: false),
                    RequiredEducationLevel = table.Column<int>(type: "INTEGER", nullable: false),
                    RequiredPosition = table.Column<int>(type: "INTEGER", nullable: false),
                    RequiredIndustry = table.Column<int>(type: "INTEGER", nullable: false),
                    RequiredJobLevel = table.Column<int>(type: "INTEGER", nullable: false),
                    RequiredSkill = table.Column<int>(type: "INTEGER", nullable: false),
                    UserId = table.Column<int>(type: "INTEGER", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AdvertisementVectors", x => x.AdvertisementVectorId);
                    table.ForeignKey(
                        name: "FK_AdvertisementVectors_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "UserId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AdvertisementVectors_UserId",
                table: "AdvertisementVectors",
                column: "UserId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AdvertisementVectors");
        }
    }
}
