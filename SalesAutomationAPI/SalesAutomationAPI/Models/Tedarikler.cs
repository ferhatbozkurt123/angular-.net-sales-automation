using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesAutomationAPI.Models
{
    public class Tedarikler
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int TedarikID { get; set; }

        [Required]
        public int UrunID { get; set; }

        [Required]
        [StringLength(150)]
        public string TedarikciAdi { get; set; } = string.Empty;

        [Required]
        public int TedarikMiktari { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal BirimFiyat { get; set; }

        [Required]
        public DateTime TedarikTarihi { get; set; }

        [StringLength(500)]
        public string? Aciklama { get; set; }

        // Navigation property
        public virtual Urunler? Urun { get; set; }

        public Tedarikler()
        {
            TedarikTarihi = DateTime.Now;
        }
    }
} 