using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace MultiplayerGameApi.Migrations
{
    /// <inheritdoc />
    public partial class SetNullCurrentMatchIdOnDelete : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Players_Matches_CurrentMatchId",
                table: "Players");

            migrationBuilder.CreateIndex(
                name: "IX_Players_Email",
                table: "Players",
                column: "Email",
                unique: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Players_Matches_CurrentMatchId",
                table: "Players",
                column: "CurrentMatchId",
                principalTable: "Matches",
                principalColumn: "Id",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Players_Matches_CurrentMatchId",
                table: "Players");

            migrationBuilder.DropIndex(
                name: "IX_Players_Email",
                table: "Players");

            migrationBuilder.AddForeignKey(
                name: "FK_Players_Matches_CurrentMatchId",
                table: "Players",
                column: "CurrentMatchId",
                principalTable: "Matches",
                principalColumn: "Id");
        }
    }
}
