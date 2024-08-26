using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyApi.Migrations
{
    /// <inheritdoc />
    public partial class AddMultimediaToArticles : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<byte[]>(
                name: "PhotoData",
                table: "Articles",
                type: "BLOB",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "PhotoMimeType",
                table: "Articles",
                type: "TEXT",
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "VideoData",
                table: "Articles",
                type: "BLOB",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "VideoMimeType",
                table: "Articles",
                type: "TEXT",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PhotoData",
                table: "Articles");

            migrationBuilder.DropColumn(
                name: "PhotoMimeType",
                table: "Articles");

            migrationBuilder.DropColumn(
                name: "VideoData",
                table: "Articles");

            migrationBuilder.DropColumn(
                name: "VideoMimeType",
                table: "Articles");
        }
    }
}
