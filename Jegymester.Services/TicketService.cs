using Jegymester.DataContext.Context;
using Jegymester.DataContext.Entities;
using Jegymester.DataContext.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Jegymester.Services
{
    public interface ITicketService
    {
        Task<List<TicketDto>> ListAsync();
        Task<TicketDto> AddTicketAsync(TicketCreateDto ticketDto);
        Task<bool> DeleteTicketAsync(int id);
    }

    public class TicketService : ITicketService
    {
        private readonly AppDbContext _context;

        public TicketService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<TicketDto>> ListAsync()
        {
            return await _context.Tickets
                .Include(t => t.User)
                .Select(t => new TicketDto
                {
                    Id = t.Id,
                    ScreeningId = t.ScreeningId,
                    UserId = t.UserId
                }).ToListAsync();
        }

        public async Task<TicketDto> AddTicketAsync(TicketCreateDto ticketDto)
        {
            var ticket = new Ticket
            {
                ScreeningId = ticketDto.ScreeningId,
                UserId = ticketDto.UserId
            };

            await _context.Tickets.AddAsync(ticket);
            await _context.SaveChangesAsync();

            return new TicketDto
            {
                Id = ticket.Id,
                ScreeningId = ticket.ScreeningId,
                UserId=ticket.UserId
            };
        }

        public async Task<bool> DeleteTicketAsync(int id)
        {
            var ticket = await _context.Tickets
                .Include(t => t.Screening)
        .FirstOrDefaultAsync(t => t.Id == id);
            if (ticket != null)
            {
                if (ticket.Screening.StartTime > DateTime.Now.AddHours(4))
                {
                    _context.Tickets.Remove(ticket);
                    await _context.SaveChangesAsync();
                    return true;
                }
            }
            return false;
        }
    }
}
