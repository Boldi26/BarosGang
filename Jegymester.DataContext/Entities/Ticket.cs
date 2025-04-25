namespace Jegymester.DataContext.Entities;

public class Ticket
{
    public int Id { get; set; }
    public int ScreeningId { get; set; }
    public Screening Screening { get; set; }

    public int UserId { get; set; } 
    public User User { get; set; }

    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }

}