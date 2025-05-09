using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace SalesAutomationAPI.Models
{
    public class UrunCreateDto
    {
        [Required(ErrorMessage = "Ürün adı zorunludur")]
        [StringLength(200, ErrorMessage = "Ürün adı en fazla 200 karakter olabilir")]
        public string UrunAdi { get; set; } = string.Empty;
        
        public string? Aciklama { get; set; }
        
        [Required(ErrorMessage = "Fiyat zorunludur")]
        [Range(0.01, double.MaxValue, ErrorMessage = "Fiyat 0'dan büyük olmalıdır")]
        [Column(TypeName = "decimal(18,2)")]
        public decimal Fiyat { get; set; }
        
        [Required(ErrorMessage = "Stok miktarı zorunludur")]
        [Range(0, int.MaxValue, ErrorMessage = "Stok miktarı 0'dan büyük olmalıdır")]
        public int StokMiktari { get; set; }
        
        public int? KategoriID { get; set; }
        
        public string? Ozellikler { get; set; }
        
        [Url(ErrorMessage = "Geçerli bir URL giriniz")]
        public string? UrunGorseli { get; set; }
    }
} 