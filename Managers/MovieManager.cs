using Microsoft.EntityFrameworkCore;

namespace Jegymester_BarosGang.Managers;

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
        _context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT Movies ON");
        _context.Movies.Add(movie);
        _context.SaveChanges();
        _context.Database.ExecuteSqlRaw("SET IDENTITY_INSERT Movies OFF");
    }
}