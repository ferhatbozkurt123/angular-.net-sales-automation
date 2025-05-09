using System;
using System.ComponentModel.DataAnnotations;

namespace SalesAutomationAPI.Models.DTOs
{
    public class TedarikCreateDto
    {
        [Required]
        public int UrunID { get; set; }

        [Required]
        [StringLength(150)]
        public string TedarikciAdi { get; set; } = string.Empty;

        [Required]
        public int TedarikMiktari { get; set; }

        [Required]
        public decimal BirimFiyat { get; set; }

        public DateTime? TedarikTarihi { get; set; }

        [StringLength(500)]
        public string? Aciklama { get; set; }
    }

    public class TedarikUpdateDto : TedarikCreateDto
    {
        public int TedarikID { get; set; }
    }

    public class TedarikDetailDto
    {
        public int TedarikID { get; set; }
        public int UrunID { get; set; }
        public string UrunAdi { get; set; } = string.Empty;
        public string TedarikciAdi { get; set; } = string.Empty;
        public int TedarikMiktari { get; set; }
        public decimal BirimFiyat { get; set; }
        public DateTime TedarikTarihi { get; set; }
        public string? Aciklama { get; set; }
    }
} 