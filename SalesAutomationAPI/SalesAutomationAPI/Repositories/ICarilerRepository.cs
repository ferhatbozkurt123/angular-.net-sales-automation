using SalesAutomationAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesAutomationAPI.Repositories
{
    public interface ICarilerRepository
    {
        Task<IEnumerable<Cariler>> GetAllAsync();
        Task<Cariler?> GetByIdAsync(int id);
        Task<Cariler> CreateAsync(Cariler cari);
        Task UpdateAsync(Cariler cari);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<Cariler>> SearchByUnvanAsync(string unvan);
        Task<IEnumerable<Cariler>> GetByTipAsync(string tip);
        Task<decimal> GetBakiyeAsync(int id);
        Task UpdateBakiyeAsync(int id, decimal tutar);
    }
} 