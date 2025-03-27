using Jegymester.DataContext.Context;
using Jegymester.DataContext.Entities;
using Microsoft.EntityFrameworkCore;

namespace Jegymester.DataContext.Managers;

public class MovieManager
{
    private readonly AppDbContext _context;
    
    public MovieManager(AppDbContext context)
    {
        _context = context;
    }
    
    public List<Movie> GetAll()
    {
        return _context.Movies.ToList();
    }
    
    public void Create(Movie movie)
    {
        _context.Movies.Add(movie);
        _context.SaveChanges();
    }
}