using Microsoft.AspNetCore.Http;

namespace SalesAutomationAPI.Services
{
    public interface IFileUploadService
    {
        Task<string> UploadFileAsync(IFormFile file);
        void DeleteFile(string fileName);
    }
} 