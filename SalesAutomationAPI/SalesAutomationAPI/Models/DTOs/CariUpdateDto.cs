using System.ComponentModel.DataAnnotations;

namespace SalesAutomationAPI.Models.DTOs
{
    public class CariUpdateDto
    {
        [Required]
        public int CariID { get; set; }

        [Required(ErrorMessage = "Unvan zorunludur")]
        [StringLength(150)]
        public string Unvan { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tip zorunludur")]
        [StringLength(30)]
        public string Tip { get; set; } = string.Empty;

        [StringLength(100)]
        public string? VergiDairesi { get; set; }

        [StringLength(20)]
        public string? VergiNo { get; set; }

        [StringLength(20)]
        public string? Telefon { get; set; }

        [StringLength(100)]
        [EmailAddress(ErrorMessage = "Geçerli bir e-posta adresi giriniz")]
        public string? Email { get; set; }

        [StringLength(500)]
        public string? Adres { get; set; }
    }
} 