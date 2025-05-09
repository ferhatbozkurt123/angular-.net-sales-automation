using System.ComponentModel.DataAnnotations;

namespace SalesAutomationAPI.Models.DTOs
{
    public class CariHareketCreateDto
    {
        [Required]
        public int CariID { get; set; }

        [Required(ErrorMessage = "İşlem türü zorunludur")]
        [StringLength(20)]
        public string IslemTuru { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tutar zorunludur")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Tutar 0'dan büyük olmalıdır")]
        public decimal Tutar { get; set; }

        [StringLength(500)]
        public string? Aciklama { get; set; }

        [StringLength(50)]
        public string? BelgeNo { get; set; }

        public DateTime? VadeTarihi { get; set; }
    }
} 