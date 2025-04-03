using Microsoft.AspNetCore.Mvc;
using Jegymester.Services;
using Jegymester.DataContext.Dtos;
using System.Threading.Tasks;

namespace Jegymester.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class TicketController : ControllerBase
    {
        private readonly ITicketService _ticketService;

        public TicketController(ITicketService ticketService)
        {
            _ticketService = ticketService;
        }

        [HttpGet]
        public async Task<IActionResult> List()
        {
            var result = await _ticketService.ListAsync();
            return Ok(result);
        }

        [HttpPost("add-ticket")]
        public async Task<IActionResult> AddTicket([FromBody] TicketCreateDto ticketDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _ticketService.AddTicketAsync(ticketDto);
            return Ok(result);
        }

        [HttpDelete("delete-ticket/{id}")]
        public async Task<IActionResult> DeleteTicket(int id)
        {
            var result = await _ticketService.DeleteTicketAsync(id);
            return result ? Ok("Jegy törölve.") : NotFound("Jegy nem található.");
        }
    }
}
