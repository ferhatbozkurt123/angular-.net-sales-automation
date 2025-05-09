using Microsoft.EntityFrameworkCore;
using SalesAutomationAPI.Data;
using SalesAutomationAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SalesAutomationAPI.Repositories
{
    public class CariHareketlerRepository : ICariHareketlerRepository
    {
        private readonly AppDbContext _context;

        public CariHareketlerRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CariHareketler>> GetAllAsync()
        {
            return await _context.CariHareketler
                .OrderByDescending(ch => ch.IslemTarihi)
                .ToListAsync();
        }

        public async Task<CariHareketler?> GetByIdAsync(int id)
        {
            return await _context.CariHareketler.FindAsync(id);
        }

        public async Task<CariHareketler> CreateAsync(CariHareketler hareket)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var cari = await _context.Cariler.FindAsync(hareket.CariID);
                if (cari == null)
                    throw new InvalidOperationException("Cari bulunamadı.");

                // İşlem türünü standardize et
                hareket.IslemTuru = hareket.IslemTuru.Trim().ToLower();
                hareket.IslemTarihi = DateTime.Now;

                // İşlem türünü kontrol et ve düzelt
                hareket.IslemTuru = hareket.IslemTuru.Trim().ToLower() switch
                {
                    "satis" or "satış" => "Satis",
                    "tahsilat" => "Tahsilat",
                    "iade" => "Iade",
                    "alis" or "alış" => "Alis",
                    "odeme" or "ödeme" => "Odeme",
                    "borc" => "Satis",  // Borç işlemini Satış olarak işle
                    _ => throw new InvalidOperationException("Geçersiz işlem türü. Kabul edilen değerler: Satis, Tahsilat, Iade, Alis, Odeme")
                };

                _context.CariHareketler.Add(hareket);

                // Bakiye değişimini hesapla
                decimal bakiyeDegisimi = hareket.IslemTuru switch
                {
                    "Satis" => hareket.Tutar,      // Müşteriden alacak (bakiye artar)
                    "Tahsilat" => -hareket.Tutar,  // Tahsilat alındı (bakiye azalır)
                    "Iade" => -hareket.Tutar,      // İade yapıldı (bakiye azalır)
                    "Alis" => -hareket.Tutar,      // Tedarikçiye borç (bakiye azalır)
                    "Odeme" => hareket.Tutar,      // Borç ödendi (bakiye artar)
                    _ => 0
                };

                cari.Bakiye += bakiyeDegisimi;
                cari.GuncellemeTarihi = DateTime.Now;

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return hareket;
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new InvalidOperationException($"Cari hareket oluşturulurken hata: {ex.Message}");
            }
        }

        public async Task UpdateAsync(CariHareketler hareket)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var existingHareket = await _context.CariHareketler
                    .Include(ch => ch.Cari)
                    .FirstOrDefaultAsync(ch => ch.HareketID == hareket.HareketID);

                if (existingHareket == null)
                    throw new InvalidOperationException("Hareket bulunamadı.");

                // İşlem türünü standardize et
                hareket.IslemTuru = hareket.IslemTuru.Trim().ToLower() switch
                {
                    "satis" or "satış" => "Satis",
                    "tahsilat" => "Tahsilat",
                    "iade" => "Iade",
                    "alis" or "alış" => "Alis",
                    "odeme" or "ödeme" => "Odeme",
                    _ => throw new InvalidOperationException("Geçersiz işlem türü")
                };

                // Eski bakiye değişimini geri al
                decimal eskiBakiyeDegisimi = existingHareket.IslemTuru switch
                {
                    "Satis" => existingHareket.Tutar,
                    "Tahsilat" => -existingHareket.Tutar,
                    "Iade" => -existingHareket.Tutar,
                    "Alis" => -existingHareket.Tutar,
                    "Odeme" => existingHareket.Tutar,
                    _ => 0
                };

                existingHareket.Cari.Bakiye -= eskiBakiyeDegisimi;

                // Yeni bakiye değişimini uygula
                decimal yeniBakiyeDegisimi = hareket.IslemTuru switch
                {
                    "Satis" => hareket.Tutar,
                    "Tahsilat" => -hareket.Tutar,
                    "Iade" => -hareket.Tutar,
                    "Alis" => -hareket.Tutar,
                    "Odeme" => hareket.Tutar,
                    _ => 0
                };

                existingHareket.Cari.Bakiye += yeniBakiyeDegisimi;
                existingHareket.Cari.GuncellemeTarihi = DateTime.Now;

                _context.Entry(existingHareket).CurrentValues.SetValues(hareket);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new InvalidOperationException($"Hareket güncellenirken hata: {ex.Message}");
            }
        }

        public async Task DeleteAsync(int id)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                var hareket = await _context.CariHareketler
                    .Include(ch => ch.Cari)
                    .FirstOrDefaultAsync(ch => ch.HareketID == id);

                if (hareket == null)
                    throw new InvalidOperationException("Hareket bulunamadı.");

                decimal bakiyeDegisimi = hareket.IslemTuru switch
                {
                    "Satis" => hareket.Tutar,
                    "Tahsilat" => -hareket.Tutar,
                    "Iade" => -hareket.Tutar,
                    "Alis" => -hareket.Tutar,
                    "Odeme" => hareket.Tutar,
                    _ => 0
                };

                hareket.Cari.Bakiye -= bakiyeDegisimi;
                hareket.Cari.GuncellemeTarihi = DateTime.Now;

                _context.CariHareketler.Remove(hareket);
                await _context.SaveChangesAsync();
                await transaction.CommitAsync();
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                throw new InvalidOperationException($"Hareket silinirken hata: {ex.Message}");
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.CariHareketler.AnyAsync(ch => ch.HareketID == id);
        }

        public async Task<IEnumerable<CariHareketler>> GetByCariIdAsync(int cariId)
        {
            return await _context.CariHareketler
                .Where(ch => ch.CariID == cariId)
                .OrderByDescending(ch => ch.IslemTarihi)
                .ToListAsync();
        }

        public async Task<IEnumerable<CariHareketler>> GetByDateRangeAsync(int cariId, DateTime startDate, DateTime endDate)
        {
            return await _context.CariHareketler
                .Where(ch => ch.CariID == cariId && 
                            ch.IslemTarihi >= startDate && 
                            ch.IslemTarihi <= endDate)
                .OrderByDescending(ch => ch.IslemTarihi)
                .ToListAsync();
        }

        public async Task<IEnumerable<CariHareketler>> GetByIslemTuruAsync(int cariId, string islemTuru)
        {
            islemTuru = islemTuru.Trim().ToLower() switch
            {
                "satis" or "satış" => "Satis",
                "tahsilat" => "Tahsilat",
                "iade" => "Iade",
                "alis" or "alış" => "Alis",
                "odeme" or "ödeme" => "Odeme",
                _ => islemTuru
            };

            return await _context.CariHareketler
                .Where(ch => ch.CariID == cariId && 
                            ch.IslemTuru == islemTuru)
                .OrderByDescending(ch => ch.IslemTarihi)
                .ToListAsync();
        }

        public async Task<decimal> GetToplamTutarAsync(int cariId, string islemTuru)
        {
            islemTuru = islemTuru.Trim().ToLower() switch
            {
                "satis" or "satış" => "Satis",
                "tahsilat" => "Tahsilat",
                "iade" => "Iade",
                "alis" or "alış" => "Alis",
                "odeme" or "ödeme" => "Odeme",
                _ => islemTuru
            };

            return await _context.CariHareketler
                .Where(ch => ch.CariID == cariId && 
                            ch.IslemTuru == islemTuru)
                .SumAsync(ch => ch.Tutar);
        }
    }
} 