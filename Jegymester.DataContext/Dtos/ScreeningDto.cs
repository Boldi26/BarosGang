using System.ComponentModel.DataAnnotations;

namespace Jegymester.DataContext.Dtos
{
    public class ScreeningDto
    {
        public int Id { get; set; }

        [Required]
        public int MovieId { get; set; }

        [Required]
        public DateTime StartTime { get; set; }

        [Range(1, 500)]
        public int Capacity { get; set; }

        [Range(1, 100000)]
        public int Price { get; set; }

        [Range(1, 20)]
        public int Room { get; set; }
    }

    public class ScreeningUpdateDto
    {
        [Required]
        public DateTime StartTime { get; set; }

        [Range(1, 500)]
        public int Capacity { get; set; }

        [Range(1, 100000)]
        public int Price { get; set; }

        [Range(1, 20)]
        public int Room { get; set; }
    }

    public class ScreeningDeleteDto
    {
        public int Id { get; set; }
    }
}
