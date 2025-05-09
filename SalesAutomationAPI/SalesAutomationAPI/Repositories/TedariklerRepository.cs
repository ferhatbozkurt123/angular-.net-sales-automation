using Microsoft.EntityFrameworkCore;
using SalesAutomationAPI.Data;
using SalesAutomationAPI.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesAutomationAPI.Repositories
{
    public class TedariklerRepository : ITedariklerRepository
    {
        private readonly AppDbContext _context;

        public TedariklerRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Tedarikler>> GetAllAsync()
        {
            return await _context.Tedarikler
                .Include(t => t.Urun)
                .ToListAsync();
        }

        public async Task<Tedarikler?> GetByIdAsync(int id)
        {
            return await _context.Tedarikler
                .Include(t => t.Urun)
                .FirstOrDefaultAsync(t => t.TedarikID == id);
        }

        public async Task<IEnumerable<Tedarikler>> GetByUrunIdAsync(int urunId)
        {
            return await _context.Tedarikler
                .Include(t => t.Urun)
                .Where(t => t.UrunID == urunId)
                .ToListAsync();
        }

        public async Task<Tedarikler> CreateAsync(Tedarikler tedarik)
        {
            _context.Tedarikler.Add(tedarik);
            await _context.SaveChangesAsync();
            return tedarik;
        }

        public async Task UpdateAsync(Tedarikler tedarik)
        {
            _context.Entry(tedarik).State = EntityState.Modified;
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(int id)
        {
            var tedarik = await _context.Tedarikler.FindAsync(id);
            if (tedarik != null)
            {
                _context.Tedarikler.Remove(tedarik);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<bool> ExistsAsync(int id)
        {
            return await _context.Tedarikler.AnyAsync(t => t.TedarikID == id);
        }

        public async Task<IEnumerable<Tedarikler>> GetByTedarikciAsync(string tedarikci)
        {
            return await _context.Tedarikler
                .Include(t => t.Urun)
                .Where(t => t.TedarikciAdi.Contains(tedarikci))
                .ToListAsync();
        }
    }
} 