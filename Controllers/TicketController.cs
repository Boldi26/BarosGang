using Microsoft.AspNetCore.Mvc;
using Jegymester.Services;
using Jegymester.DataContext.Dtos;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Linq;

namespace Jegymester.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TicketController : ControllerBase
    {
        private readonly ITicketService _ticketService;

        public TicketController(ITicketService ticketService)
        {
            _ticketService = ticketService;
        }

        [HttpGet("List")]
        [Authorize]
        public async Task<IActionResult> List()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
                return Unauthorized("User id not found.");

            if (!int.TryParse(userIdClaim.Value, out var userId))
                return BadRequest("Invalid user id.");

            var result = await _ticketService.ListAsync(userId);
            return Ok(result);
        }

        [HttpPost("purchase-ticket")]
        [AllowAnonymous]
        public async Task<IActionResult> PurchaseTicket([FromBody] TicketPurchaseDto ticketDto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (userIdClaim != null && int.TryParse(userIdClaim.Value, out var currentUserId))
            {
                if (!User.IsInRole("Cashier"))
                {
                    ticketDto.UserId = currentUserId;
                }
            }

            try
            {
                var result = await _ticketService.PurchaseTicketAsync(ticketDto);
                return Ok(result);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("delete-ticket/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null || !int.TryParse(userIdClaim.Value, out var currentUserId))
                return Unauthorized("User ID is invalid.");

            var isAdminOrCashier = User.IsInRole("Admin") || User.IsInRole("Cashier");

            if (isAdminOrCashier)
            {
                var result = await _ticketService.DeleteTicketAsync(id);
                return result ? Ok("Ticket deleted.") : BadRequest("Ticket not found or within 4 hours of screening.");
            }

            var userTickets = await _ticketService.ListAsync(currentUserId);
            var ticket = userTickets.FirstOrDefault(t => t.Id == id);

            if (ticket == null)
                return BadRequest("You can only delete your own tickets.");

            var deleteResult = await _ticketService.DeleteTicketAsync(id);
            return deleteResult ? Ok("Ticket deleted.") : BadRequest("Ticket not found or within 4 hours of screening.");
        }
    }
}
