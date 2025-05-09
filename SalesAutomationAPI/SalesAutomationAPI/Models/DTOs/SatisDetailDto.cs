namespace SalesAutomationAPI.Models.DTOs
{
    public class SatisDetailDto
    {
        public int SatisID { get; set; }
        public DateTime SatisTarihi { get; set; }
        public decimal ToplamTutar { get; set; }
        public string? Musteri { get; set; }
        public List<SatisDetayDetailDto> SatisDetaylari { get; set; }

        public SatisDetailDto()
        {
            SatisDetaylari = new List<SatisDetayDetailDto>();
        }
    }

    public class SatisDetayDetailDto
    {
        public int Id { get; set; }
        public int UrunId { get; set; }
        public string UrunAdi { get; set; }
        public int Miktar { get; set; }
        public decimal BirimFiyat { get; set; }
        public decimal ToplamFiyat { get; set; }
    }
} 