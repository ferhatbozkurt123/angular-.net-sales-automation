using System.ComponentModel.DataAnnotations;

namespace SalesAutomationAPI.Models.DTOs
{
    public class SatisUpdateDto
    {
        [Required]
        public int SatisID { get; set; }

        [StringLength(50)]
        public string? Musteri { get; set; }

        [Required]
        public List<SatisDetayUpdateDto> SatisDetaylari { get; set; }

        public SatisUpdateDto()
        {
            SatisDetaylari = new List<SatisDetayUpdateDto>();
        }
    }

    public class SatisDetayUpdateDto
    {
        public int? Id { get; set; }  // Null ise yeni detay eklenecek

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