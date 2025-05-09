using SalesAutomationAPI.Models;
using SalesAutomationAPI.Models.DTOs;
using SalesAutomationAPI.Repositories;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace SalesAutomationAPI.Services
{
    public class TedarikService : ITedarikService
    {
        private readonly ITedariklerRepository _tedariklerRepository;
        private readonly IUrunlerRepository _urunlerRepository;

        public TedarikService(
            ITedariklerRepository tedariklerRepository,
            IUrunlerRepository urunlerRepository)
        {
            _tedariklerRepository = tedariklerRepository;
            _urunlerRepository = urunlerRepository;
        }

        public async Task<IEnumerable<TedarikDetailDto>> GetAllTedariklerAsync()
        {
            var tedarikler = await _tedariklerRepository.GetAllAsync();
            return tedarikler.Select(MapToDetailDto);
        }

        public async Task<TedarikDetailDto> GetTedarikByIdAsync(int id)
        {
            var tedarik = await _tedariklerRepository.GetByIdAsync(id);
            if (tedarik == null)
                throw new KeyNotFoundException($"Tedarik bulunamadı: {id}");

            return MapToDetailDto(tedarik);
        }

        public async Task<IEnumerable<TedarikDetailDto>> GetTedariklerByUrunAsync(int urunId)
        {
            var tedarikler = await _tedariklerRepository.GetByUrunIdAsync(urunId);
            return tedarikler.Select(MapToDetailDto);
        }

        public async Task<TedarikDetailDto> CreateTedarikAsync(TedarikCreateDto tedarikDto)
        {
            var urun = await _urunlerRepository.GetByIdAsync(tedarikDto.UrunID);
            if (urun == null)
                throw new KeyNotFoundException($"Ürün bulunamadı: {tedarikDto.UrunID}");

            var tedarik = new Tedarikler
            {
                UrunID = tedarikDto.UrunID,
                TedarikciAdi = tedarikDto.TedarikciAdi,
                TedarikMiktari = tedarikDto.TedarikMiktari,
                BirimFiyat = tedarikDto.BirimFiyat,
                TedarikTarihi = tedarikDto.TedarikTarihi ?? DateTime.Now,
                Aciklama = tedarikDto.Aciklama
            };

            var createdTedarik = await _tedariklerRepository.CreateAsync(tedarik);
            return MapToDetailDto(createdTedarik);
        }

        public async Task UpdateTedarikAsync(int id, TedarikUpdateDto tedarikDto)
        {
            if (id != tedarikDto.TedarikID)
                throw new ArgumentException("ID'ler eşleşmiyor");

            var existingTedarik = await _tedariklerRepository.GetByIdAsync(id);
            if (existingTedarik == null)
                throw new KeyNotFoundException($"Tedarik bulunamadı: {id}");

            var urun = await _urunlerRepository.GetByIdAsync(tedarikDto.UrunID);
            if (urun == null)
                throw new KeyNotFoundException($"Ürün bulunamadı: {tedarikDto.UrunID}");

            existingTedarik.UrunID = tedarikDto.UrunID;
            existingTedarik.TedarikciAdi = tedarikDto.TedarikciAdi;
            existingTedarik.TedarikMiktari = tedarikDto.TedarikMiktari;
            existingTedarik.BirimFiyat = tedarikDto.BirimFiyat;
            existingTedarik.TedarikTarihi = tedarikDto.TedarikTarihi ?? existingTedarik.TedarikTarihi;
            existingTedarik.Aciklama = tedarikDto.Aciklama;

            await _tedariklerRepository.UpdateAsync(existingTedarik);
        }

        public async Task DeleteTedarikAsync(int id)
        {
            if (!await _tedariklerRepository.ExistsAsync(id))
                throw new KeyNotFoundException($"Tedarik bulunamadı: {id}");

            await _tedariklerRepository.DeleteAsync(id);
        }

        public async Task<IEnumerable<TedarikDetailDto>> GetTedariklerByTedarikciAsync(string tedarikci)
        {
            var tedarikler = await _tedariklerRepository.GetByTedarikciAsync(tedarikci);
            return tedarikler.Select(MapToDetailDto);
        }

        private TedarikDetailDto MapToDetailDto(Tedarikler tedarik)
        {
            return new TedarikDetailDto
            {
                TedarikID = tedarik.TedarikID,
                UrunID = tedarik.UrunID,
                UrunAdi = tedarik.Urun?.UrunAdi ?? "Bilinmeyen Ürün",
                TedarikciAdi = tedarik.TedarikciAdi,
                TedarikMiktari = tedarik.TedarikMiktari,
                BirimFiyat = tedarik.BirimFiyat,
                TedarikTarihi = tedarik.TedarikTarihi,
                Aciklama = tedarik.Aciklama
            };
        }
    }
} 