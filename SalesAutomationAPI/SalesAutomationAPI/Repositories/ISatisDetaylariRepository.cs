using SalesAutomationAPI.Models;

namespace SalesAutomationAPI.Repositories
{
    public interface ISatisDetaylariRepository
    {
        Task<IEnumerable<SatisDetaylari>> GetAllAsync();
        Task<SatisDetaylari> GetByIdAsync(int id);
        Task<IEnumerable<SatisDetaylari>> GetBySatisIdAsync(int satisId);
        Task<IEnumerable<SatisDetaylari>> GetByUrunIdAsync(int urunId);
        Task<SatisDetaylari> CreateAsync(SatisDetaylari satisDetay);
        Task CreateRangeAsync(IEnumerable<SatisDetaylari> satisDetaylar);
        Task UpdateAsync(SatisDetaylari satisDetay);
        Task DeleteAsync(int id);
        Task DeleteBySatisIdAsync(int satisId);
        Task<bool> ExistsAsync(int id);
    }
} 