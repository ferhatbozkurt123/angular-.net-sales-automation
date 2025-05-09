using Microsoft.EntityFrameworkCore;
using SalesAutomationAPI.Models;
using SalesAutomationAPI.Data;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesAutomationAPI.Repositories
{
    public class CarilerRepository : ICarilerRepository
    {
        private readonly AppDbContext _context;

        public CarilerRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Cariler>> GetAllAsync()
        {
            return await _context.Cariler
                .Include(c => c.CariHareketler)
                .ToListAsync();
        }

        public async Task<Cariler?> GetByIdAsync(int id)
        {
            return await _context.Cariler
                .Include(c => c.CariHareketler)
                .FirstOrDefaultAsync(c => c.CariID == id);
        }

        public async Task<Cariler> CreateAsync(Cariler cari)
        {
            _context.Cariler.Add(cari);
            await _context.SaveChangesAsync();
            return cari;
        }

        public async Task UpdateAsync(Cariler cari)
        {
            cari.GuncellemeTarihi = DateTime.Now;
            _context.Entry(cari).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var cari = await _context.Cariler.FindAsync(id);
            if (cari != null)
            {
                _context.Cariler.Remove(cari);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Cariler.AnyAsync(c => c.CariID == id);
        }

        public async Task<IEnumerable<Cariler>> SearchByUnvanAsync(string unvan)
        {
            return await _context.Cariler
                .Where(c => c.Unvan.Contains(unvan))
                .ToListAsync();
        }

        public async Task<IEnumerable<Cariler>> GetByTipAsync(string tip)
        {
            return await _context.Cariler
                .Where(c => c.Tip == tip)
                .ToListAsync();
        }

        public async Task<decimal> GetBakiyeAsync(int id)
        {
            var cari = await _context.Cariler
                .FirstOrDefaultAsync(c => c.CariID == id);
            return cari?.Bakiye ?? 0;
        }

        public async Task UpdateBakiyeAsync(int id, decimal tutar)
        {
            var cari = await _context.Cariler.FindAsync(id);
            if (cari != null)
            {
                cari.Bakiye += tutar;
                cari.GuncellemeTarihi = DateTime.Now;
                await _context.SaveChangesAsync();
            }
        }
    }
} 