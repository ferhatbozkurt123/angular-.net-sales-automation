using SalesAutomationAPI.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesAutomationAPI.Repositories
{
    public interface ITedariklerRepository
    {
        Task<IEnumerable<Tedarikler>> GetAllAsync();
        Task<Tedarikler?> GetByIdAsync(int id);
        Task<IEnumerable<Tedarikler>> GetByUrunIdAsync(int urunId);
        Task<Tedarikler> CreateAsync(Tedarikler tedarik);
        Task UpdateAsync(Tedarikler tedarik);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<IEnumerable<Tedarikler>> GetByTedarikciAsync(string tedarikci);
    }
} 