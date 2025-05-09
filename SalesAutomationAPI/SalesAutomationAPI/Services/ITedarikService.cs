using SalesAutomationAPI.Models.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesAutomationAPI.Services
{
    public interface ITedarikService
    {
        Task<IEnumerable<TedarikDetailDto>> GetAllTedariklerAsync();
        Task<TedarikDetailDto> GetTedarikByIdAsync(int id);
        Task<IEnumerable<TedarikDetailDto>> GetTedariklerByUrunAsync(int urunId);
        Task<TedarikDetailDto> CreateTedarikAsync(TedarikCreateDto tedarikDto);
        Task UpdateTedarikAsync(int id, TedarikUpdateDto tedarikDto);
        Task DeleteTedarikAsync(int id);
        Task<IEnumerable<TedarikDetailDto>> GetTedariklerByTedarikciAsync(string tedarikci);
    }
} 