using System.ComponentModel.DataAnnotations;

namespace Jegymester.DataContext.Dtos
{
    public class MovieDto
    {
        public int Id { get; set; }
        [Required]
        public string Name { get; set; }
        [Range(1, 500)]
        public int Length { get; set; }
        [Required]
        public string Genre { get; set; }
        [Range(0, 18)]
        public int AgeLimit { get; set; }
    }

    public class MovieUpdateDto
    {
        [Required]
        public string Name { get; set; }

        [Range(1, 500)]
        public int Length { get; set; }

        [Required]
        public string Genre { get; set; }

        [Range(0, 18)]
        public int AgeLimit { get; set; }
    }


    public class MovieDeleteDto
    {
        public int Id { get; set; }
    }
}
