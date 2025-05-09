using SalesAutomationAPI.Models;

namespace SalesAutomationAPI.Repositories
{
    public interface IKategorilerRepository
    {
        Task<IEnumerable<Kategoriler>> GetAllAsync();
        Task<Kategoriler> GetByIdAsync(int id);
        Task<Kategoriler> CreateAsync(Kategoriler kategori);
        Task UpdateAsync(Kategoriler kategori);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
