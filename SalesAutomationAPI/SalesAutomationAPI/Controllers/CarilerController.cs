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
    public class CarilerController : ControllerBase
    {
        private readonly ICarilerRepository _carilerRepository;

        public CarilerController(ICarilerRepository carilerRepository)
        {
            _carilerRepository = carilerRepository;
        }

        // GET: api/Cariler
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cariler>>> GetCariler()
        {
            var cariler = await _carilerRepository.GetAllAsync();
            return Ok(cariler);
        }

        // GET: api/Cariler/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Cariler>> GetCari(int id)
        {
            var cari = await _carilerRepository.GetByIdAsync(id);
            if (cari == null)
            {
                return NotFound();
            }
            return Ok(cari);
        }

        // GET: api/Cariler/search/unvan
        [HttpGet("search/{unvan}")]
        public async Task<ActionResult<IEnumerable<Cariler>>> SearchCariler(string unvan)
        {
            var cariler = await _carilerRepository.SearchByUnvanAsync(unvan);
            return Ok(cariler);
        }

        // GET: api/Cariler/tip/Müsteri
        [HttpGet("tip/{tip}")]
        public async Task<ActionResult<IEnumerable<Cariler>>> GetCarilerByTip(string tip)
        {
            var cariler = await _carilerRepository.GetByTipAsync(tip);
            return Ok(cariler);
        }

        // GET: api/Cariler/5/bakiye
        [HttpGet("{id}/bakiye")]
        public async Task<ActionResult<decimal>> GetCariBakiye(int id)
        {
            if (!await _carilerRepository.ExistsAsync(id))
            {
                return NotFound();
            }
            var bakiye = await _carilerRepository.GetBakiyeAsync(id);
            return Ok(bakiye);
        }

        // POST: api/Cariler
        [HttpPost]
        public async Task<ActionResult<Cariler>> CreateCari(CariCreateDto cariDto)
        {
            var cari = new Cariler
            {
                Unvan = cariDto.Unvan,
                Tip = cariDto.Tip,
                VergiDairesi = cariDto.VergiDairesi,
                VergiNo = cariDto.VergiNo,
                Telefon = cariDto.Telefon,
                Email = cariDto.Email,
                Adres = cariDto.Adres
            };

            var createdCari = await _carilerRepository.CreateAsync(cari);
            return CreatedAtAction(nameof(GetCari), new { id = createdCari.CariID }, createdCari);
        }

        // PUT: api/Cariler/5
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCari(int id, CariUpdateDto cariDto)
        {
            if (id != cariDto.CariID)
            {
                return BadRequest();
            }

            var existingCari = await _carilerRepository.GetByIdAsync(id);
            if (existingCari == null)
            {
                return NotFound();
            }

            existingCari.Unvan = cariDto.Unvan;
            existingCari.Tip = cariDto.Tip;
            existingCari.VergiDairesi = cariDto.VergiDairesi;
            existingCari.VergiNo = cariDto.VergiNo;
            existingCari.Telefon = cariDto.Telefon;
            existingCari.Email = cariDto.Email;
            existingCari.Adres = cariDto.Adres;

            await _carilerRepository.UpdateAsync(existingCari);
            return NoContent();
        }

        // DELETE: api/Cariler/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCari(int id)
        {
            if (!await _carilerRepository.ExistsAsync(id))
            {
                return NotFound();
            }

            await _carilerRepository.DeleteAsync(id);
            return NoContent();
        }

        // PUT: api/Cariler/5/bakiye
        [HttpPut("{id}/bakiye")]
        public async Task<IActionResult> UpdateCariBakiye(int id, [FromBody] decimal tutar)
        {
            if (!await _carilerRepository.ExistsAsync(id))
            {
                return NotFound();
            }

            await _carilerRepository.UpdateBakiyeAsync(id, tutar);
            return NoContent();
        }
    }
} 