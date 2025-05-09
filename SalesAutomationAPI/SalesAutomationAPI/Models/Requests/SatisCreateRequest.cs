using System.ComponentModel.DataAnnotations;

namespace SalesAutomationAPI.Models.Requests
{
    public class SatisCreateRequest
    {
        [Required]
        public string Musteri { get; set; }

        [Required]
        public List<SatisDetayRequest> Detaylar { get; set; } = new();
    }

    public class SatisDetayRequest
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