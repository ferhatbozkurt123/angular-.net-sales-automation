using Microsoft.AspNetCore.Http;

namespace SalesAutomationAPI.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly string _uploadsFolder;

        public FileUploadService(IWebHostEnvironment environment)
        {
            _uploadsFolder = Path.Combine(environment.WebRootPath, "uploads");
            if (!Directory.Exists(_uploadsFolder))
            {
                Directory.CreateDirectory(_uploadsFolder);
            }
        }

        public async Task<string> UploadFileAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
                throw new ArgumentException("Dosya seçilmedi.");

            // Güvenli dosya adı oluştur
            var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
            var filePath = Path.Combine(_uploadsFolder, fileName);

            // Dosyayı kaydet
            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            return fileName;
        }

        public void DeleteFile(string fileName)
        {
            if (string.IsNullOrEmpty(fileName))
                return;

            var filePath = Path.Combine(_uploadsFolder, fileName);
            if (File.Exists(filePath))
            {
                File.Delete(filePath);
            }
        }
    }
} 