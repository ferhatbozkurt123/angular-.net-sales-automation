using System.ComponentModel.DataAnnotations;

namespace SalesAutomationAPI.Models
{
    public class UrunUpdateDto
    {
        [Required]
        public int UrunID { get; set; }

        [Required(ErrorMessage = "Ürün adı zorunludur")]
        public string UrunAdi { get; set; }
        
        public string? Aciklama { get; set; }
        
        [Required(ErrorMessage = "Fiyat zorunludur")]
        [Range(0, double.MaxValue, ErrorMessage = "Fiyat 0'dan büyük olmalıdır")]
        public decimal Fiyat { get; set; }
        
        [Required(ErrorMessage = "Stok miktarı zorunludur")]
        [Range(0, int.MaxValue, ErrorMessage = "Stok miktarı 0'dan büyük olmalıdır")]
        public int StokMiktari { get; set; }
        
        public int? KategoriID { get; set; }
        
        public string? Ozellikler { get; set; }
        
        [Url(ErrorMessage = "Geçerli bir Google Drive linki giriniz")]
        public string? UrunGorseli { get; set; }
    }
} 