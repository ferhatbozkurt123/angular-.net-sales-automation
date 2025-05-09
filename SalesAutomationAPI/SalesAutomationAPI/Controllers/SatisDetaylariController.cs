using Microsoft.AspNetCore.Mvc;
using SalesAutomationAPI.Models;
using SalesAutomationAPI.Repositories;

namespace SalesAutomationAPI.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SatisDetaylariController : ControllerBase
    {
        private readonly ISatisDetaylariRepository _repository;

        public SatisDetaylariController(ISatisDetaylariRepository repository)
        {
            _repository = repository;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<SatisDetaylari>>> GetAllSatisDetaylari()
        {
            var detaylar = await _repository.GetAllAsync();
            return Ok(detaylar);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<SatisDetaylari>> GetSatisDetay(int id)
        {
            var detay = await _repository.GetByIdAsync(id);
            if (detay == null)
            {
                return NotFound();
            }
            return Ok(detay);
        }

        [HttpGet("satis/{satisId}")]
        public async Task<ActionResult<IEnumerable<SatisDetaylari>>> GetBySatisId(int satisId)
        {
            var detaylar = await _repository.GetBySatisIdAsync(satisId);
            return Ok(detaylar);
        }

        [HttpGet("urun/{urunId}")]
        public async Task<ActionResult<IEnumerable<SatisDetaylari>>> GetByUrunId(int urunId)
        {
            var detaylar = await _repository.GetByUrunIdAsync(urunId);
            return Ok(detaylar);
        }

        [HttpPost]
        public async Task<ActionResult<SatisDetaylari>> CreateSatisDetay(SatisDetaylari satisDetay)
        {
            try
            {
                var createdDetay = await _repository.CreateAsync(satisDetay);
                return CreatedAtAction(
                    nameof(GetSatisDetay),
                    new { id = createdDetay.Id },
                    createdDetay);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateSatisDetay(int id, SatisDetaylari satisDetay)
        {
            if (id != satisDetay.Id)
            {
                return BadRequest();
            }

            try
            {
                await _repository.UpdateAsync(satisDetay);
            }
            catch (Exception ex)
            {
                if (!await _repository.ExistsAsync(id))
                {
                    return NotFound();
                }
                return BadRequest(ex.Message);
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteSatisDetay(int id)
        {
            var detay = await _repository.GetByIdAsync(id);
            if (detay == null)
            {
                return NotFound();
            }

            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
} 