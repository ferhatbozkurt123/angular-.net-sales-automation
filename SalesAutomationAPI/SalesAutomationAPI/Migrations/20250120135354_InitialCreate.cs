using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesAutomationAPI.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "GorselData",
                table: "Urunler");

            migrationBuilder.DropColumn(
                name: "GorselTipi",
                table: "Urunler");

            migrationBuilder.AlterColumn<string>(
                name: "UrunGorseli",
                table: "Urunler",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "UrunGorseli",
                table: "Urunler",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<byte[]>(
                name: "GorselData",
                table: "Urunler",
                type: "varbinary(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "GorselTipi",
                table: "Urunler",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
