using Microsoft.AspNetCore.Mvc;
using SalesAutomationAPI.Models;
using SalesAutomationAPI.Repositories;

namespace SalesAutomationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KategorilerController : ControllerBase
    {
        private readonly IKategorilerRepository _repository;

        public KategorilerController(IKategorilerRepository repository)
        {
            _repository = repository;
        }

        // GET: api/Kategoriler
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Kategoriler>>> GetKategoriler()
        {
            var kategoriler = await _repository.GetAllAsync();
            return Ok(kategoriler);
        }

        // GET: api/Kategoriler/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Kategoriler>> GetKategori(int id)
        {
            var kategori = await _repository.GetByIdAsync(id);

            if (kategori == null)
            {
                return NotFound();
            }

            return Ok(kategori);
        }

        // POST: api/Kategoriler
        [HttpPost]
        public async Task<ActionResult<Kategoriler>> CreateKategori(Kategoriler kategori)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdKategori = await _repository.CreateAsync(kategori);
            return CreatedAtAction(nameof(GetKategori),
                new { id = createdKategori.KategoriID }, createdKategori);
        }

        // PUT: api/Kategoriler/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateKategori(int id, Kategoriler kategori)
        {
            if (id != kategori.KategoriID)
            {
                return BadRequest();
            }

            if (!await _repository.ExistsAsync(id))
            {
                return NotFound();
            }

            await _repository.UpdateAsync(kategori);
            return NoContent();
        }

        // DELETE: api/Kategoriler/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKategori(int id)
        {
            if (!await _repository.ExistsAsync(id))
            {
                return NotFound();
            }

            await _repository.DeleteAsync(id);
            return NoContent();
        }
    }
}
