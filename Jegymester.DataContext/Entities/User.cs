namespace Jegymester.DataContext.Entities;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string PasswordHash { get; set; }
    public string PhoneNumber { get; set; }
    public bool IsRegistered { get; set; }
    public List<Ticket> Tickets { get; set; }
    public List<Role> Roles { get; set; }
}