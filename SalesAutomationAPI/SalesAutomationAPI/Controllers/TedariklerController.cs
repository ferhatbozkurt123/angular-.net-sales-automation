using Microsoft.AspNetCore.Mvc;
using SalesAutomationAPI.Models.DTOs;
using SalesAutomationAPI.Services;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesAutomationAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TedariklerController : ControllerBase
    {
        private readonly ITedarikService _tedarikService;

        public TedariklerController(ITedarikService tedarikService)
        {
            _tedarikService = tedarikService;
        }

        // GET: api/Tedarikler
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TedarikDetailDto>>> GetTedarikler()
        {
            var tedarikler = await _tedarikService.GetAllTedariklerAsync();
            return Ok(tedarikler);
        }

        // GET: api/Tedarikler/5
        [HttpGet("{id}")]
        public async Task<ActionResult<TedarikDetailDto>> GetTedarik(int id)
        {
            try
            {
                var tedarik = await _tedarikService.GetTedarikByIdAsync(id);
                return Ok(tedarik);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        // GET: api/Tedarikler/urun/5
        [HttpGet("urun/{urunId}")]
        public async Task<ActionResult<IEnumerable<TedarikDetailDto>>> GetTedariklerByUrun(int urunId)
        {
            var tedarikler = await _tedarikService.GetTedariklerByUrunAsync(urunId);
            return Ok(tedarikler);
        }

        // GET: api/Tedarikler/tedarikci/ABC
        [HttpGet("tedarikci/{tedarikci}")]
        public async Task<ActionResult<IEnumerable<TedarikDetailDto>>> GetTedariklerByTedarikci(string tedarikci)
        {
            var tedarikler = await _tedarikService.GetTedariklerByTedarikciAsync(tedarikci);
            return Ok(tedarikler);
        }

        // POST: api/Tedarikler
        [HttpPost]
        public async Task<ActionResult<TedarikDetailDto>> CreateTedarik(TedarikCreateDto tedarikDto)
        {
            try
            {
                var createdTedarik = await _tedarikService.CreateTedarikAsync(tedarikDto);
                return CreatedAtAction(
                    nameof(GetTedarik),
                    new { id = createdTedarik.TedarikID },
                    createdTedarik);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        // PUT: api/Tedarikler/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTedarik(int id, TedarikUpdateDto tedarikDto)
        {
            try
            {
                await _tedarikService.UpdateTedarikAsync(id, tedarikDto);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // DELETE: api/Tedarikler/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTedarik(int id)
        {
            try
            {
                await _tedarikService.DeleteTedarikAsync(id);
                return NoContent();
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }
    }
} 