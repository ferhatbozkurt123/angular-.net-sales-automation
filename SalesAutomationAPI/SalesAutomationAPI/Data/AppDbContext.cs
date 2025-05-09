using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using SalesAutomationAPI.Models;

namespace SalesAutomationAPI.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        public DbSet<Kategoriler> Kategoriler { get; set; }
        public DbSet<Urunler> Urunler { get; set; }
        public DbSet<Satislar> Satislar { get; set; }
        public DbSet<SatisDetaylari> SatisDetaylari { get; set; }
        public DbSet<Cariler> Cariler { get; set; }
        public DbSet<CariHareketler> CariHareketler { get; set; }
        public DbSet<Tedarikler> Tedarikler { get; set; }

        public async Task<IDbContextTransaction> BeginTransactionAsync()
        {
            if (Database.CurrentTransaction != null)
            {
                return Database.CurrentTransaction;
            }
            return await Database.BeginTransactionAsync();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Kategoriler konfigürasyonu
            modelBuilder.Entity<Kategoriler>()
                .HasMany(k => k.Urunler)
                .WithOne(u => u.Kategori)
                .HasForeignKey(u => u.KategoriID)
                .OnDelete(DeleteBehavior.Restrict);

            // Satislar konfigürasyonu
            modelBuilder.Entity<Satislar>()
                .HasMany(s => s.SatisDetaylari)
                .WithOne(sd => sd.Satis)
                .HasForeignKey(sd => sd.SatisId)
                .OnDelete(DeleteBehavior.Cascade);

            // SatisDetaylari konfigürasyonu
            modelBuilder.Entity<SatisDetaylari>()
                .HasOne(sd => sd.Urun)
                .WithMany()
                .HasForeignKey(sd => sd.UrunId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<SatisDetaylari>()
                .Property(sd => sd.BirimFiyat)
                .HasColumnType("decimal(18,2)");

            modelBuilder.Entity<SatisDetaylari>()
                .Property(sd => sd.ToplamFiyat)
                .HasColumnType("decimal(18,2)");

            // Cariler ve CariHareketler arasındaki ilişki
            modelBuilder.Entity<Cariler>(entity =>
            {
                entity.HasKey(e => e.CariID);
                entity.Property(e => e.Unvan).IsRequired().HasMaxLength(150);
                entity.Property(e => e.Bakiye).HasColumnType("decimal(18,2)");
                entity.Property(e => e.GuncellemeTarihi).HasColumnType("datetime");
            });

            modelBuilder.Entity<CariHareketler>(entity =>
            {
                entity.HasKey(e => e.HareketID);
                entity.Property(e => e.HareketID).UseIdentityColumn();
                entity.Property(e => e.IslemTuru).IsRequired().HasMaxLength(50);
                entity.Property(e => e.Tutar).HasColumnType("decimal(18,2)");
                entity.Property(e => e.IslemTarihi).HasColumnType("datetime");
                entity.Property(e => e.Aciklama).HasMaxLength(500);
                entity.Property(e => e.BelgeNo).HasMaxLength(50);

                entity.HasOne(d => d.Cari)
                    .WithMany(p => p.CariHareketler)
                    .HasForeignKey(d => d.CariID)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Tedarikler konfigürasyonu
            modelBuilder.Entity<Tedarikler>(entity =>
            {
                entity.HasKey(e => e.TedarikID);
                entity.Property(e => e.TedarikciAdi).IsRequired().HasMaxLength(150);
                entity.Property(e => e.BirimFiyat).HasColumnType("decimal(18,2)");
                entity.Property(e => e.TedarikMiktari).IsRequired();
                entity.Property(e => e.TedarikTarihi).HasColumnType("datetime");
                entity.Property(e => e.Aciklama).HasMaxLength(500);

                entity.HasOne(d => d.Urun)
                    .WithMany()
                    .HasForeignKey(d => d.UrunID)
                    .OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
