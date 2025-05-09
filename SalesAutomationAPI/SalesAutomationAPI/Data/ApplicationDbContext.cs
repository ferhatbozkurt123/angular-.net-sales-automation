using Microsoft.EntityFrameworkCore;
using SalesAutomationAPI.Models;

namespace SalesAutomationAPI.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<Urunler> Urunler { get; set; }
        public DbSet<Kategoriler> Kategoriler { get; set; }
        public DbSet<Satislar> Satislar { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Urunler tablosu için konfigürasyon
            modelBuilder.Entity<Urunler>(entity =>
            {
                entity.HasKey(e => e.UrunID);
                entity.Property(e => e.UrunAdi).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Aciklama).HasMaxLength(4000);
                entity.Property(e => e.Fiyat).HasColumnType("decimal(18,2)");
                entity.Property(e => e.UrunGorseli).HasMaxLength(4000);
                entity.Property(e => e.Ozellikler).HasMaxLength(4000);
                entity.Property(e => e.OlusturulmaTarihi).IsRequired();
                entity.Property(e => e.GuncellemeTarihi).IsRequired();

                // Kategori ilişkisi
                entity.HasOne(e => e.Kategori)
                    .WithMany()
                    .HasForeignKey(e => e.KategoriID)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            // Kategoriler tablosu için konfigürasyon
            modelBuilder.Entity<Kategoriler>(entity =>
            {
                entity.HasKey(e => e.KategoriID);
                entity.Property(e => e.KategoriAdi).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Aciklama).HasMaxLength(500);
            });
        }
    }
} 