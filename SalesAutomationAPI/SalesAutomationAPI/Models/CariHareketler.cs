using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesAutomationAPI.Models
{
    public class CariHareketler
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int HareketID { get; set; }

        [Required]
        public int CariID { get; set; }

        [Required]
        public DateTime IslemTarihi { get; set; } = DateTime.Now;

        [Required(ErrorMessage = "İşlem türü zorunludur")]
        [StringLength(20)]
        public string IslemTuru { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tutar zorunludur")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Tutar { get; set; }

        [StringLength(500)]
        public string? Aciklama { get; set; }

        [StringLength(50)]
        public string? BelgeNo { get; set; }

        public DateTime? VadeTarihi { get; set; }

        // Navigation property
        public virtual Cariler? Cari { get; set; }
    }
} 