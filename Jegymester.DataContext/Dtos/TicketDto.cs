using System.ComponentModel.DataAnnotations;

namespace Jegymester.DataContext.Dtos
{
    public class TicketDto
    {
        public int Id { get; set; }

        [Required]
        public int ScreeningId { get; set; }

        
        public int? UserId { get; set; }

        public string? Email { get; set; }
        public string? PhoneNumber { get; set; }


    }

    public class TicketPurchaseDto
    {
        [Required]
        public int ScreeningId { get; set; }

        
        public int? UserId { get; set; }

        [EmailAddress]
        public string? Email { get; set; }

        [Phone]
        public string? PhoneNumber { get; set; }

        public int Quantity { get; set; } = 1;
    }

    public class TicketDeleteDto
    {
        public int Id { get; set; }
    }
}
