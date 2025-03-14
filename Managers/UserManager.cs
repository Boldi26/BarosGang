namespace Jegymester_BarosGang.Managers;

public class UserManager
{
    private readonly AppDbContext _context;
    
    public UserManager(AppDbContext context)
    {
        _context = context;
    }
    
    public List<User> GetAll()
    {
        return _context.Users.ToList();
    }
    
    public void Create(User user)
    {
        _context.Users.Add(user);
        _context.SaveChanges();
    }
}