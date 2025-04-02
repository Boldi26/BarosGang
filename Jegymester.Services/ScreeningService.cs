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
        List<Screening> List();
        Task<ScreeningDto> AddScreeningAsync(ScreeningDto screeningDto);
        Task<bool> DeleteScreeningAsync(int id);
        Task<bool> UpdateScreeningAsync(int id, ScreeningUpdateDto screeningDto);
    }

    public class ScreeningService : IScreeningService
    {
        private readonly AppDbContext _context;

        public ScreeningService(AppDbContext context)
        {
            _context = context;
        }

        public List<Screening> List()
        {
            return _context.Screenings.ToList();
        }

        public async Task<ScreeningDto> AddScreeningAsync(ScreeningDto screeningDto)
        {
            var screening = new Screening
            {
                MovieId = screeningDto.MovieId,
                StartTime = screeningDto.StartTime,
                Capacity = screeningDto.Capacity,
                Price = screeningDto.Price,
                Room = screeningDto.Room
            };

            await _context.Screenings.AddAsync(screening);
            await _context.SaveChangesAsync();

            return screeningDto;
        }

        public async Task<bool> DeleteScreeningAsync(int id)
        {
            var screening = await _context.Screenings.FindAsync(id);
            if (screening != null)
            {
                _context.Screenings.Remove(screening);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> UpdateScreeningAsync(int id, ScreeningUpdateDto screeningDto)
        {
            var screening = await _context.Screenings.FindAsync(id);
            if (screening != null)
            {
                screening.StartTime = screeningDto.StartTime;
                screening.Capacity = screeningDto.Capacity;
                screening.Price = screeningDto.Price;
                screening.Room = screeningDto.Room;
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
