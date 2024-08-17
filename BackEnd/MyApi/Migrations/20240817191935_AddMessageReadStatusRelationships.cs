using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MyApi.Migrations
{
    /// <inheritdoc />
    public partial class AddMessageReadStatusRelationships : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MessageReadStatus_Messages_MessageId",
                table: "MessageReadStatus");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MessageReadStatus",
                table: "MessageReadStatus");

            migrationBuilder.RenameTable(
                name: "MessageReadStatus",
                newName: "MessageReadStatuses");

            migrationBuilder.RenameIndex(
                name: "IX_MessageReadStatus_MessageId",
                table: "MessageReadStatuses",
                newName: "IX_MessageReadStatuses_MessageId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MessageReadStatuses",
                table: "MessageReadStatuses",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_MessageReadStatuses_UserId",
                table: "MessageReadStatuses",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_MessageReadStatuses_Messages_MessageId",
                table: "MessageReadStatuses",
                column: "MessageId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_MessageReadStatuses_Users_UserId",
                table: "MessageReadStatuses",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_MessageReadStatuses_Messages_MessageId",
                table: "MessageReadStatuses");

            migrationBuilder.DropForeignKey(
                name: "FK_MessageReadStatuses_Users_UserId",
                table: "MessageReadStatuses");

            migrationBuilder.DropPrimaryKey(
                name: "PK_MessageReadStatuses",
                table: "MessageReadStatuses");

            migrationBuilder.DropIndex(
                name: "IX_MessageReadStatuses_UserId",
                table: "MessageReadStatuses");

            migrationBuilder.RenameTable(
                name: "MessageReadStatuses",
                newName: "MessageReadStatus");

            migrationBuilder.RenameIndex(
                name: "IX_MessageReadStatuses_MessageId",
                table: "MessageReadStatus",
                newName: "IX_MessageReadStatus_MessageId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_MessageReadStatus",
                table: "MessageReadStatus",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_MessageReadStatus_Messages_MessageId",
                table: "MessageReadStatus",
                column: "MessageId",
                principalTable: "Messages",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
