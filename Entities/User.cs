namespace Jegymester_BarosGang;

public class User
{
    public int Id { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string PhoneNumber { get; set; }
    public bool IsRegistered { get; set; }
    public List<Ticket> Tickets { get; set; }
    
    public override string ToString()
    {
        return $"Id: {Id}, Email: {Email}, Password: {Password}, PhoneNumber: {PhoneNumber}, IsRegistered: {IsRegistered}";
    }
}