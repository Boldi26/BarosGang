using Jegymester.DataContext.Context;
using Jegymester.DataContext.Entities;
using Jegymester.DataContext.Dtos;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Jegymester.Services
{
    public interface IUserService
    {
        Task<List<UserDto>> ListAsync();
        Task<UserDto> RegisterAsync(UserRegisterDto userDto);
        Task<UserDto> LoginAsync(UserLoginDto userDto);
        Task<bool> UpdateUserAsync(int id, UserUpdateDto userDto);
    }

    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserDto>> ListAsync()
        {
            return await _context.Users
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Email = u.Email,
                    PhoneNumber = u.PhoneNumber,
                    IsRegistered = u.IsRegistered
                }).ToListAsync();
        }

        public async Task<UserDto> RegisterAsync(UserRegisterDto userDto)
        {
            var user = new User
            {
                Email = userDto.Email,
                Password = userDto.Password, 
                PhoneNumber = userDto.PhoneNumber,
                IsRegistered = true
            };

            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                IsRegistered = user.IsRegistered
            };
        }

        public async Task<UserDto> LoginAsync(UserLoginDto userDto)
        {
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == userDto.Email && u.Password == userDto.Password);

            if (user == null)
                return null;

            return new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                IsRegistered = user.IsRegistered
            };
        }

        public async Task<bool> UpdateUserAsync(int id, UserUpdateDto userDto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                user.Email = userDto.Email;
                user.PhoneNumber = userDto.PhoneNumber;
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }
}
