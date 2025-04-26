using AutoMapper;
using Jegymester.DataContext.Context;
using Jegymester.DataContext.Entities;
using Jegymester.DataContext.Dtos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Jegymester.Services
{
    public interface IMovieService
    {
        List<MovieDto> List();
        Task<MovieDto> AddMovieAsync(MovieDto movieDto);
        Task<bool> DeleteMovieAsync(int id);
        Task<bool> UpdateMovieAsync(int id, MovieUpdateDto movieDto);
    }

    public class MovieService : IMovieService
    {
        private readonly AppDbContext _context;
        private readonly IMapper _mapper;


        public MovieService(AppDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public List<MovieDto> List()
        {
            var movies = _context.Movies.ToList();
            return _mapper.Map<List<MovieDto>>(movies);
        }

        public async Task<MovieDto> AddMovieAsync(MovieDto movieDto)
        {
            var movie = _mapper.Map<Movie>(movieDto);
            await _context.Movies.AddAsync(movie);
            await _context.SaveChangesAsync();

            return _mapper.Map<MovieDto>(movie);
        }

        public async Task<bool> DeleteMovieAsync(int id)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie != null)
            {
                var hasOngoingScreenings = await _context.Screenings
                    .AnyAsync(s => s.MovieId == id && s.StartTime > DateTime.Now);
                if (!hasOngoingScreenings)
                {
                    _context.Movies.Remove(movie);
                    await _context.SaveChangesAsync();
                    return true;
                }
            }
            return false;
        }

        public async Task<bool> UpdateMovieAsync(int id, MovieUpdateDto movieDto)
        {
            var movie = await _context.Movies.FindAsync(id);
            if (movie != null)
            {
                _mapper.Map(movieDto, movie);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;
        }
    }

}
