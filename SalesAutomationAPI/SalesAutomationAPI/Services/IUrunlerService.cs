using SalesAutomationAPI.Models;

namespace SalesAutomationAPI.Services
{
    public interface IUrunlerService
    {
        Task<IEnumerable<Urunler>> GetAllAsync();
        Task<Urunler> GetByIdAsync(int id);
        Task<IEnumerable<Urunler>> GetByKategoriIdAsync(int kategoriId);
        Task<Urunler> CreateAsync(Urunler urun);
        Task UpdateAsync(Urunler urun);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
    }
}
