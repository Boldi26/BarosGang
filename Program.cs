using Jegymester_BarosGang.Managers;
using Microsoft.EntityFrameworkCore;

namespace Jegymester_BarosGang;

class Program
{
    static void Main(string[] args)
    {
        using var context = new AppDbContext();
        
        MovieManager movieManager = new MovieManager(context);
        ScreeningManager screeningManager = new ScreeningManager(context);
        UserManager userManager = new UserManager(context);
        TicketManager ticketManager = new TicketManager(context);
        
        userManager.Create(new User
        {
            Email = "kucska.boldizsar@gmail.com",
            Password = "JohnDoe123",
            PhoneNumber = "063012345",
            IsRegistered = true
        });
        
        var movies = movieManager.GetAll();
        var users = userManager.GetAll();
        
        foreach (var movie in movies)
        {
            Console.WriteLine(movie.ToString());
        }
    }
}