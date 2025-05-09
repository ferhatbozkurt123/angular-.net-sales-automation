using Microsoft.EntityFrameworkCore;
using SalesAutomationAPI.Data;
using SalesAutomationAPI.Models;

namespace SalesAutomationAPI.Repositories
{
    public class SatisDetaylariRepository : ISatisDetaylariRepository
    {
        private readonly AppDbContext _context;

        public SatisDetaylariRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<SatisDetaylari>> GetAllAsync()
        {
            return await _context.SatisDetaylari
                .Include(sd => sd.Urun)
                .Include(sd => sd.Satis)
                .ToListAsync();
        }

        public async Task<SatisDetaylari> GetByIdAsync(int id)
        {
            return await _context.SatisDetaylari
                .Include(sd => sd.Urun)
                .Include(sd => sd.Satis)
                .FirstOrDefaultAsync(sd => sd.Id == id);
        }

        public async Task<IEnumerable<SatisDetaylari>> GetBySatisIdAsync(int satisId)
        {
            return await _context.SatisDetaylari
                .Include(sd => sd.Urun)
                .Where(sd => sd.SatisId == satisId)
                .ToListAsync();
        }

        public async Task<IEnumerable<SatisDetaylari>> GetByUrunIdAsync(int urunId)
        {
            return await _context.SatisDetaylari
                .Include(sd => sd.Satis)
                .Where(sd => sd.UrunId == urunId)
                .ToListAsync();
        }

        public async Task<SatisDetaylari> CreateAsync(SatisDetaylari satisDetay)
        {
            satisDetay.ToplamFiyat = satisDetay.BirimFiyat * satisDetay.Miktar;
            
            await _context.SatisDetaylari.AddAsync(satisDetay);
            await _context.SaveChangesAsync();
            
            return satisDetay;
        }

        public async Task UpdateAsync(SatisDetaylari satisDetay)
        {
            satisDetay.ToplamFiyat = satisDetay.BirimFiyat * satisDetay.Miktar;
            
            _context.Entry(satisDetay).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var satisDetay = await _context.SatisDetaylari.FindAsync(id);
            if (satisDetay != null)
            {
                _context.SatisDetaylari.Remove(satisDetay);
                await _context.SaveChangesAsync();
            }
        }

        public async Task DeleteBySatisIdAsync(int satisId)
        {
            var satisDetaylari = await _context.SatisDetaylari
                .Where(sd => sd.SatisId == satisId)
                .ToListAsync();

            _context.SatisDetaylari.RemoveRange(satisDetaylari);
            await _context.SaveChangesAsync();
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.SatisDetaylari.AnyAsync(sd => sd.Id == id);
        }

        public async Task CreateRangeAsync(IEnumerable<SatisDetaylari> satisDetaylar)
        {
            await _context.SatisDetaylari.AddRangeAsync(satisDetaylar);
            await _context.SaveChangesAsync();
        }
    }
} 