using AutoMapper;
using Jegymester.DataContext.Context;
using Jegymester.DataContext.Entities;
using Jegymester.DataContext.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper.QueryableExtensions;

namespace Jegymester.Services
{
    public interface ITicketService
    {
        Task<List<TicketDto>> ListAsync(int userId);
        Task<List<TicketDto>> ListAllAsync();
        Task<List<TicketDto>> PurchaseTicketAsync(TicketPurchaseDto ticketDto);
        Task<bool> DeleteTicketAsync(int id);
    }

    public class TicketService : ITicketService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;

        public TicketService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<List<TicketDto>> ListAsync(int userId)
        {
            return await _context.Tickets
        .Where(t => t.UserId == userId)
        .ProjectTo<TicketDto>(_mapper.ConfigurationProvider)
        .ToListAsync();
        }

        public async Task<List<TicketDto>> ListAllAsync()
        {
            return await _context.Tickets
                .ProjectTo<TicketDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
        }

        public async Task<List<TicketDto>> PurchaseTicketAsync(TicketPurchaseDto ticketDto)
        {
            if (ticketDto.UserId == null && (string.IsNullOrWhiteSpace(ticketDto.Email) || string.IsNullOrWhiteSpace(ticketDto.PhoneNumber)))
                throw new ArgumentException("Email and phone number required for non registered users.");

            var ticketCount = await _context.Tickets.CountAsync(t => t.ScreeningId == ticketDto.ScreeningId);
            var screening = await _context.Screenings.Include(s => s.Movie)
    .FirstOrDefaultAsync(s => s.Id == ticketDto.ScreeningId);

            if (screening == null)
                throw new ArgumentException("Screening not found.");

            if (screening.StartTime <= DateTime.Now)
                throw new InvalidOperationException("Screening has already started.");

            if (screening.StartTime.Add(TimeSpan.FromMinutes(screening.Movie.Length)) <= DateTime.Now)
                throw new InvalidOperationException("Screenig has already ended.");

            if (ticketCount >= screening.Capacity)
                throw new InvalidOperationException("Screening capacity full.");

            int userId;

            User? user=null;

            if (ticketDto.UserId.HasValue)
            {
                userId = ticketDto.UserId.Value;
                user = await _context.Users.FindAsync(userId);
            }
            else
            {
                user = new User
                {
                    Email = ticketDto.Email!,
                    PhoneNumber = ticketDto.PhoneNumber!,
                    IsRegistered = false,
                    PasswordHash = ""
                };
                _context.Users.Add(user);
                await _context.SaveChangesAsync();

                userId = user.Id;
            }

            var tickets = new List<Ticket>();
            for (int i = 0; i < ticketDto.Quantity; i++)
            {
                tickets.Add(new Ticket
                {
                    ScreeningId = ticketDto.ScreeningId,
                    UserId = user.Id,
                    Email = user.Email,
                    PhoneNumber = user.PhoneNumber
                });
            }

            await _context.Tickets.AddRangeAsync(tickets);
            await _context.SaveChangesAsync();

            return _mapper.Map<List<TicketDto>>(tickets);
        }

        public async Task<bool> DeleteTicketAsync(int id)
        {
            var ticket = await _context.Tickets
        .Include(t => t.Screening)
        .FirstOrDefaultAsync(t => t.Id ==id);

            if (ticket == null)
                return false;

            if (ticket.Screening.StartTime <= DateTime.Now.AddHours(4))
                return false;

            _context.Tickets.Remove(ticket);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
