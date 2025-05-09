using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesAutomationAPI.Models
{
    public class Cariler
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
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

        [Column(TypeName = "decimal(18,2)")]
        public decimal Bakiye { get; set; }

        public DateTime OlusturulmaTarihi { get; set; }

        public DateTime GuncellemeTarihi { get; set; }

        // Navigation property
        public virtual ICollection<CariHareketler> CariHareketler { get; set; }

        public Cariler()
        {
            CariHareketler = new List<CariHareketler>();
            OlusturulmaTarihi = DateTime.Now;
            GuncellemeTarihi = DateTime.Now;
            Bakiye = 0;
        }
    }
} 