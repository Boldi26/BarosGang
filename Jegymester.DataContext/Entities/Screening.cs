namespace Jegymester.DataContext.Entities;

public class Screening
{
    public int Id { get; set; }
    public int MovieId { get; set; }
    public Movie Movie { get; set; }
    public DateTime StartTime { get; set; }
    public int Capacity { get; set; }
    public int Price { get; set; }
    public int Room { get; set; }
}