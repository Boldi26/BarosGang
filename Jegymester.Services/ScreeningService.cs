using AutoMapper;
using Jegymester.DataContext.Context;
using Jegymester.DataContext.Entities;
using Jegymester.DataContext.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Jegymester.Services
{
    public interface IScreeningService
    {
        List<ScreeningDto> List();
        Task<ScreeningDto> AddScreeningAsync(ScreeningDto screeningDto);
        Task<bool> DeleteScreeningAsync(int id);
        Task<bool> UpdateScreeningAsync(int id, ScreeningUpdateDto screeningDto);
    }

    public class ScreeningService : IScreeningService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public ScreeningService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public List<ScreeningDto> List()
        {
            var screenings = _context.Screenings.ToList();
            return _mapper.Map<List<ScreeningDto>>(screenings);
        }

        public async Task<ScreeningDto> AddScreeningAsync(ScreeningDto screeningDto)
        {
            var screening = _mapper.Map<Screening>(screeningDto);
            _context.Screenings.Add(screening);
            await _context.SaveChangesAsync();
            return _mapper.Map<ScreeningDto>(screening);
        }

        public async Task<bool> DeleteScreeningAsync(int id)
        {
            var screening = await _context.Screenings.FindAsync(id);
            if (screening == null)
                return false;

            if (screening.StartTime <= DateTime.Now)
                return false;

            _context.Screenings.Remove(screening);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> UpdateScreeningAsync(int id, ScreeningUpdateDto screeningDto)
        {
            var screening = await _context.Screenings.FindAsync(id);
            if (screening == null)
                return false;

            _mapper.Map(screeningDto, screening);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
