using SalesAutomationAPI.Models;

namespace SalesAutomationAPI.Repositories
{
    public interface ISatislarRepository
    {
        Task<IEnumerable<Satislar>> GetAllAsync();
        Task<Satislar> GetByIdAsync(int id);
        Task<IEnumerable<Satislar>> GetByDateRangeAsync(DateTime baslangic, DateTime bitis);
        Task<Satislar> CreateAsync(Satislar satis);
        Task UpdateAsync(Satislar satis);
        Task DeleteAsync(int id);
        Task<bool> ExistsAsync(int id);
        Task<decimal> GetTotalSalesByDateAsync(DateTime tarih);
        Task<decimal> GetTotalSalesInDateRangeAsync(DateTime baslangic, DateTime bitis);
        Task<IEnumerable<Satislar>> GetByCustomerAsync(string musteri);
        Task<IEnumerable<Satislar>> GetByProductAsync(int urunId);
        Task<IEnumerable<Satislar>> GetByProductAndDateRangeAsync(int urunId, DateTime baslangic, DateTime bitis);
    }
}
