namespace Jegymester_BarosGang;

public class Ticket
{
    public int Id { get; set; }
    public int ScreeningId { get; set; }
    public Screening Screening { get; set; }

    public override string ToString()
    {
        return $"Id: {Id}, ScreeningId: {ScreeningId}";
    }
}