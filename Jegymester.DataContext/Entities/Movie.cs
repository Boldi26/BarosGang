namespace Jegymester.DataContext.Entities;

public class Movie
{
    public int Id { get; set; }
    public string Name { get; set; }
    public int Length { get; set; }
    public string Genre { get; set; }
    public int AgeLimit { get; set; }
    
    public override string ToString()
    {
        return $"Id: {Id}, Name: {Name}, Length: {Length}, Genre: {Genre}, AgeLimit: {AgeLimit}";
    }
}