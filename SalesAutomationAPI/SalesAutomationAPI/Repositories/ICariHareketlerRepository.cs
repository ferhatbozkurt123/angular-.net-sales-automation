using SalesAutomationAPI.Models;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesAutomationAPI.Repositories
{
    public interface ICariHareketlerRepository
    {
        Task<IEnumerable<CariHareketler>> GetAllAsync();
        Task<CariHareketler?> GetByIdAsync(int id);
        Task<CariHareketler> CreateAsync(CariHareketler hareket);
        Task UpdateAsync(CariHareketler hareket);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<CariHareketler>> GetByCariIdAsync(int cariId);
        Task<IEnumerable<CariHareketler>> GetByDateRangeAsync(int cariId, DateTime startDate, DateTime endDate);
        Task<IEnumerable<CariHareketler>> GetByIslemTuruAsync(int cariId, string islemTuru);
        Task<decimal> GetToplamTutarAsync(int cariId, string islemTuru);
    }
} 