using Microsoft.AspNetCore.Mvc;
using SalesAutomationAPI.Models;
using SalesAutomationAPI.Models.DTOs;
using SalesAutomationAPI.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesAutomationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CariHareketlerController : ControllerBase
    {
        private readonly ICariHareketlerRepository _hareketlerRepository;
        private readonly ICarilerRepository _carilerRepository;

        public CariHareketlerController(
            ICariHareketlerRepository hareketlerRepository,
            ICarilerRepository carilerRepository)
        {
            _hareketlerRepository = hareketlerRepository;
            _carilerRepository = carilerRepository;
        }

        // GET: api/CariHareketler
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CariHareketler>>> GetHareketler()
        {
            var hareketler = await _hareketlerRepository.GetAllAsync();
            return Ok(hareketler);
        }

        // GET: api/CariHareketler/5
        [HttpGet("{id}")]
        public async Task<ActionResult<CariHareketler>> GetHareket(int id)
        {
            var hareket = await _hareketlerRepository.GetByIdAsync(id);
            if (hareket == null)
            {
                return NotFound();
            }
            return Ok(hareket);
        }

        // GET: api/CariHareketler/cari/5
        [HttpGet("cari/{cariId}")]
        public async Task<ActionResult<IEnumerable<CariHareketler>>> GetHareketlerByCariId(int cariId)
        {
            if (!await _carilerRepository.ExistsAsync(cariId))
            {
                return NotFound("Cari bulunamadı");
            }

            var hareketler = await _hareketlerRepository.GetByCariIdAsync(cariId);
            return Ok(hareketler);
        }

        // GET: api/CariHareketler/cari/5/tarih
        [HttpGet("cari/{cariId}/tarih")]
        public async Task<ActionResult<IEnumerable<CariHareketler>>> GetHareketlerByDateRange(
            int cariId,
            [FromQuery] DateTime startDate,
            [FromQuery] DateTime endDate)
        {
            if (!await _carilerRepository.ExistsAsync(cariId))
            {
                return NotFound("Cari bulunamadı");
            }

            var hareketler = await _hareketlerRepository.GetByDateRangeAsync(cariId, startDate, endDate);
            return Ok(hareketler);
        }

        // GET: api/CariHareketler/cari/5/islemturu/Tahsilat
        [HttpGet("cari/{cariId}/islemturu/{islemTuru}")]
        public async Task<ActionResult<IEnumerable<CariHareketler>>> GetHareketlerByIslemTuru(
            int cariId,
            string islemTuru)
        {
            if (!await _carilerRepository.ExistsAsync(cariId))
            {
                return NotFound("Cari bulunamadı");
            }

            var hareketler = await _hareketlerRepository.GetByIslemTuruAsync(cariId, islemTuru);
            return Ok(hareketler);
        }

        // GET: api/CariHareketler/cari/5/toplam/Tahsilat
        [HttpGet("cari/{cariId}/toplam/{islemTuru}")]
        public async Task<ActionResult<decimal>> GetToplamTutar(int cariId, string islemTuru)
        {
            if (!await _carilerRepository.ExistsAsync(cariId))
            {
                return NotFound("Cari bulunamadı");
            }

            var toplam = await _hareketlerRepository.GetToplamTutarAsync(cariId, islemTuru);
            return Ok(toplam);
        }

        // POST: api/CariHareketler
        [HttpPost]
        public async Task<ActionResult<CariHareketler>> CreateHareket(CariHareketCreateDto hareketDto)
        {
            if (!await _carilerRepository.ExistsAsync(hareketDto.CariID))
            {
                return NotFound("Cari bulunamadı");
            }

            var hareket = new CariHareketler
            {
                CariID = hareketDto.CariID,
                IslemTuru = hareketDto.IslemTuru,
                Tutar = hareketDto.Tutar,
                Aciklama = hareketDto.Aciklama,
                BelgeNo = hareketDto.BelgeNo,
                VadeTarihi = hareketDto.VadeTarihi,
                IslemTarihi = DateTime.Now
            };

            try
            {
                var createdHareket = await _hareketlerRepository.CreateAsync(hareket);
                return CreatedAtAction(
                    nameof(GetHareket),
                    new { id = createdHareket.HareketID },
                    createdHareket);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Cari hareket oluşturulurken hata: {ex.Message}");
            }
        }

        // DELETE: api/CariHareketler/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHareket(int id)
        {
            var hareket = await _hareketlerRepository.GetByIdAsync(id);
            if (hareket == null)
            {
                return NotFound();
            }

            // İşlem silinmeden önce bakiyeyi ters işlemle güncelle
            decimal bakiyeDegisimi = hareket.IslemTuru switch
            {
                "Satış" or "Tahsilat" => -hareket.Tutar,
                "Alış" or "Ödeme" or "İade" => hareket.Tutar,
                _ => 0
            };

            await _carilerRepository.UpdateBakiyeAsync(hareket.CariID, bakiyeDegisimi);
            await _hareketlerRepository.DeleteAsync(id);

            return NoContent();
        }
    }
} 