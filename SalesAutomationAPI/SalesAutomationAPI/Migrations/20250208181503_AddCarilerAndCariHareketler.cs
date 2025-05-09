using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace SalesAutomationAPI.Migrations
{
    /// <inheritdoc />
    public partial class AddCarilerAndCariHareketler : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Satislar_Urunler_UrunID",
                table: "Satislar");

            migrationBuilder.DropIndex(
                name: "IX_Satislar_UrunID",
                table: "Satislar");

            migrationBuilder.DropColumn(
                name: "BirimFiyat",
                table: "Satislar");

            migrationBuilder.DropColumn(
                name: "Miktar",
                table: "Satislar");

            migrationBuilder.DropColumn(
                name: "SatisFiyati",
                table: "Satislar");

            migrationBuilder.DropColumn(
                name: "UrunID",
                table: "Satislar");

            migrationBuilder.AlterColumn<string>(
                name: "UrunGorseli",
                table: "Urunler",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Ozellikler",
                table: "Urunler",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AlterColumn<string>(
                name: "Aciklama",
                table: "Urunler",
                type: "nvarchar(max)",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.AddColumn<string>(
                name: "Musteri",
                table: "Satislar",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Cariler",
                columns: table => new
                {
                    CariID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Unvan = table.Column<string>(type: "nvarchar(150)", maxLength: 150, nullable: false),
                    Tip = table.Column<string>(type: "nvarchar(30)", maxLength: 30, nullable: false),
                    VergiDairesi = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    VergiNo = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Telefon = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true),
                    Email = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Adres = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    Bakiye = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    OlusturulmaTarihi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    GuncellemeTarihi = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Cariler", x => x.CariID);
                });

            migrationBuilder.CreateTable(
                name: "SatisDetaylari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SatisId = table.Column<int>(type: "int", nullable: false),
                    UrunId = table.Column<int>(type: "int", nullable: false),
                    Miktar = table.Column<int>(type: "int", nullable: false),
                    BirimFiyat = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    ToplamFiyat = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SatisDetaylari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SatisDetaylari_Satislar_SatisId",
                        column: x => x.SatisId,
                        principalTable: "Satislar",
                        principalColumn: "SatisID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_SatisDetaylari_Urunler_UrunId",
                        column: x => x.UrunId,
                        principalTable: "Urunler",
                        principalColumn: "UrunID",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CariHareketler",
                columns: table => new
                {
                    HareketID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    CariID = table.Column<int>(type: "int", nullable: false),
                    IslemTarihi = table.Column<DateTime>(type: "datetime2", nullable: false),
                    IslemTuru = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    Tutar = table.Column<decimal>(type: "decimal(18,2)", precision: 18, scale: 2, nullable: false),
                    Aciklama = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    BelgeNo = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    VadeTarihi = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CariHareketler", x => x.HareketID);
                    table.ForeignKey(
                        name: "FK_CariHareketler_Cariler_CariID",
                        column: x => x.CariID,
                        principalTable: "Cariler",
                        principalColumn: "CariID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_CariHareketler_CariID",
                table: "CariHareketler",
                column: "CariID");

            migrationBuilder.CreateIndex(
                name: "IX_SatisDetaylari_SatisId",
                table: "SatisDetaylari",
                column: "SatisId");

            migrationBuilder.CreateIndex(
                name: "IX_SatisDetaylari_UrunId",
                table: "SatisDetaylari",
                column: "UrunId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CariHareketler");

            migrationBuilder.DropTable(
                name: "SatisDetaylari");

            migrationBuilder.DropTable(
                name: "Cariler");

            migrationBuilder.DropColumn(
                name: "Musteri",
                table: "Satislar");

            migrationBuilder.AlterColumn<string>(
                name: "UrunGorseli",
                table: "Urunler",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Ozellikler",
                table: "Urunler",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Aciklama",
                table: "Urunler",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "",
                oldClrType: typeof(string),
                oldType: "nvarchar(max)",
                oldNullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "BirimFiyat",
                table: "Satislar",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "Miktar",
                table: "Satislar",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<decimal>(
                name: "SatisFiyati",
                table: "Satislar",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "UrunID",
                table: "Satislar",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Satislar_UrunID",
                table: "Satislar",
                column: "UrunID");

            migrationBuilder.AddForeignKey(
                name: "FK_Satislar_Urunler_UrunID",
                table: "Satislar",
                column: "UrunID",
                principalTable: "Urunler",
                principalColumn: "UrunID",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
