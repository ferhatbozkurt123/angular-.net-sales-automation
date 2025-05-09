using Microsoft.EntityFrameworkCore;
using SalesAutomationAPI.Data;
using SalesAutomationAPI.Models;

namespace SalesAutomationAPI.Repositories
{
    public class SatislarRepository : ISatislarRepository
    {
        private readonly AppDbContext _context;

        public SatislarRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Satislar>> GetAllAsync()
        {
            return await _context.Satislar
                .Include(s => s.SatisDetaylari)
                .ThenInclude(sd => sd.Urun)
                .OrderByDescending(s => s.SatisTarihi)
                .ToListAsync();
        }

        public async Task<Satislar> GetByIdAsync(int id)
        {
            return await _context.Satislar
                .Include(s => s.SatisDetaylari)
                    .ThenInclude(sd => sd.Urun)
                .FirstOrDefaultAsync(s => s.SatisID == id);
        }

        public async Task<IEnumerable<Satislar>> GetByDateRangeAsync(DateTime baslangic, DateTime bitis)
        {
            return await _context.Satislar
                .Include(s => s.SatisDetaylari)
                .ThenInclude(sd => sd.Urun)
                .Where(s => s.SatisTarihi >= baslangic && s.SatisTarihi <= bitis)
                .OrderByDescending(s => s.SatisTarihi)
                .ToListAsync();
        }

        public async Task<Satislar> CreateAsync(Satislar satis)
        {
            satis.SatisTarihi = DateTime.Now;
            decimal toplamTutar = 0;

            // Önce ana satış kaydını oluştur
            await _context.Satislar.AddAsync(satis);
            await _context.SaveChangesAsync();

            // Detayları güncelle ve ekle
            foreach (var detay in satis.SatisDetaylari.ToList())
            {
                detay.SatisId = satis.SatisID;
                detay.ToplamFiyat = detay.BirimFiyat * detay.Miktar;
                toplamTutar += detay.ToplamFiyat;

                // Stok güncelleme
                var urun = await _context.Urunler.FindAsync(detay.UrunId);
                if (urun != null)
                {
                    if (urun.StokMiktari < detay.Miktar)
                        throw new Exception($"Yetersiz stok. Ürün: {urun.UrunAdi}, Mevcut Stok: {urun.StokMiktari}");
                    
                    urun.StokMiktari -= detay.Miktar;
                }
            }

            satis.ToplamTutar = toplamTutar;
            await _context.SaveChangesAsync();

            // İlişkili verileri içeren satışı döndür
            return await _context.Satislar
                .Include(s => s.SatisDetaylari)
                .ThenInclude(sd => sd.Urun)
                .FirstOrDefaultAsync(s => s.SatisID == satis.SatisID);
        }

        public async Task UpdateAsync(Satislar satis)
        {
            var existingSatis = await _context.Satislar.FindAsync(satis.SatisID);
            if (existingSatis == null)
                throw new Exception("Satış bulunamadı");

            existingSatis.Musteri = satis.Musteri;
            existingSatis.ToplamTutar = satis.ToplamTutar;

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var satis = await _context.Satislar
                .Include(s => s.SatisDetaylari)
                .FirstOrDefaultAsync(s => s.SatisID == id);

            if (satis != null)
            {
                // Return stock quantities
                foreach (var detay in satis.SatisDetaylari)
                {
                    var urun = await _context.Urunler.FindAsync(detay.UrunId);
                    if (urun != null)
                    {
                        urun.StokMiktari += detay.Miktar;
                    }
                }

                _context.Satislar.Remove(satis);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Satislar.AnyAsync(s => s.SatisID == id);
        }

        public async Task<decimal> GetTotalSalesByDateAsync(DateTime tarih)
        {
            return await _context.Satislar
                .Where(s => s.SatisTarihi.Date == tarih.Date)
                .SumAsync(s => s.ToplamTutar);
        }

        public async Task<decimal> GetTotalSalesInDateRangeAsync(DateTime baslangic, DateTime bitis)
        {
            return await _context.Satislar
                .Where(s => s.SatisTarihi >= baslangic && s.SatisTarihi <= bitis)
                .SumAsync(s => s.ToplamTutar);
        }

        public async Task<IEnumerable<Satislar>> GetByCustomerAsync(string musteri)
        {
            return await _context.Satislar
                .Include(s => s.SatisDetaylari)
                .ThenInclude(sd => sd.Urun)
                .Where(s => s.Musteri == musteri)
                .OrderByDescending(s => s.SatisTarihi)
                .ToListAsync();
        }

        public async Task<IEnumerable<Satislar>> GetByProductAsync(int urunId)
        {
            return await _context.Satislar
                .Include(s => s.SatisDetaylari)
                .ThenInclude(sd => sd.Urun)
                .Where(s => s.SatisDetaylari.Any(sd => sd.UrunId == urunId))
                .OrderByDescending(s => s.SatisTarihi)
                .ToListAsync();
        }

        public async Task<IEnumerable<Satislar>> GetByProductAndDateRangeAsync(int urunId, DateTime baslangic, DateTime bitis)
        {
            return await _context.Satislar
                .Include(s => s.SatisDetaylari)
                .ThenInclude(sd => sd.Urun)
                .Where(s => s.SatisDetaylari.Any(sd => sd.UrunId == urunId) && s.SatisTarihi >= baslangic && s.SatisTarihi <= bitis)
                .OrderByDescending(s => s.SatisTarihi)
                .ToListAsync();
        }
    }
}
