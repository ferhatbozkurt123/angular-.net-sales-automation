using System;
using System.ComponentModel.DataAnnotations;

namespace SalesAutomationAPI.Models
{
    public class Kategoriler
    {
        [Key]
        public int KategoriID { get; set; }

        [Required(ErrorMessage = "Kategori adı zorunludur")]
        [StringLength(100)]
        public string KategoriAdi { get; set; } = string.Empty;

        [Required(ErrorMessage = "Açıklama zorunludur")]
        public string Aciklama { get; set; } = string.Empty;

        public DateTime OlusturulmaTarihi { get; set; }

        public DateTime GuncellemeTarihi { get; set; }

        public virtual ICollection<Urunler>? Urunler { get; set; }
    }
}
