using Jegymester.DataContext.Context;
using Jegymester.DataContext.Entities;

namespace Jegymester.DataContext.Managers;

public class ScreeningManager
{
    private readonly AppDbContext _context;
    
    public ScreeningManager(AppDbContext context)
    {
        _context = context;
    }
    
    public List<Screening> GetAll()
    {
        return _context.Screenings.ToList();
    }
    
    public void Create(Screening screening)
    {
        _context.Screenings.Add(screening);
        _context.SaveChanges();
    }
}