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
    public interface IMovieService
    {
        List<Movie> List();
        Task<MovieDto> AddMovieAsync(MovieDto movieDto);
        Task<bool> DeleteMovieAsync(int id);
        Task<bool> UpdateMovieAsync(int id, MovieUpdateDto movieDto);
    }

    public class MovieService : IMovieService
    {
        private readonly AppDbContext _context;

        public MovieService(AppDbContext context)
        {
            _context = context;
        }

        public List<Movie> List()
        {
            return _context.Movies.ToList();
        }

        public async Task<MovieDto> AddMovieAsync(MovieDto movieDto)
        {
            var movie = new Movie
            {
                Name = movieDto.Name,
                Length = movieDto.Length,
                Genre = movieDto.Genre,
                AgeLimit = movieDto.AgeLimit
            };

            await _context.Movies.AddAsync(movie);
            await _context.SaveChangesAsync();

            return movieDto;
        }

        public async Task<bool> DeleteMovieAsync(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie != null)
            {
                _context.Movies.Remove(movie);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

        public async Task<bool> UpdateMovieAsync(int id, MovieUpdateDto movieDto)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie != null)
            {
                movie.Name = movieDto.Name;
                movie.Length = movieDto.Length;
                movie.Genre = movieDto.Genre;
                movie.AgeLimit = movieDto.AgeLimit;
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }

    }
}
