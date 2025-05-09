using System.ComponentModel.DataAnnotations;

namespace SalesAutomationAPI.Models.DTOs
{
    public class SatisCreateDto
    {
        public string Musteri { get; set; } = string.Empty;
        public List<SatisDetayCreateDto> SatisDetaylari { get; set; } = new List<SatisDetayCreateDto>();
    }

    public class SatisDetayCreateDto
    {
        [Required]
        public int UrunId { get; set; }

        [Required]
        [Range(1, int.MaxValue, ErrorMessage = "Miktar 0'dan büyük olmalıdır")]
        public int Miktar { get; set; }

        [Required]
        [Range(0.01, double.MaxValue, ErrorMessage = "Birim fiyat 0'dan büyük olmalıdır")]
        public decimal BirimFiyat { get; set; }
    }
} 