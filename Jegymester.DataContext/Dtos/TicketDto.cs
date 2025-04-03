using System.ComponentModel.DataAnnotations;

namespace Jegymester.DataContext.Dtos
{
    public class TicketDto
    {
        public int Id { get; set; }

        [Required]
        public int ScreeningId { get; set; }

        [Required]
        public int UserId { get; set; }

    }

    public class TicketCreateDto
    {
        [Required]
        public int ScreeningId { get; set; }

        [Required]
        public int UserId { get; set; }
    }

    public class TicketDeleteDto
    {
        public int Id { get; set; }
    }
}
