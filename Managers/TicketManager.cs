namespace Jegymester_BarosGang.Managers;

public class TicketManager
{
    private readonly AppDbContext _context;
    
    public TicketManager(AppDbContext context)
    {
        _context = context;
    }
    
    public List<Ticket> GetAll()
    {
        return _context.Tickets.ToList();
    }
    
    public void Create(Ticket ticket)
    {
        _context.Tickets.Add(ticket);
        _context.SaveChanges();
    }
}