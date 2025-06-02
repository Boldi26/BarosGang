using Microsoft.AspNetCore.Mvc;
using Jegymester.Services;
using Jegymester.DataContext.Dtos;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;

namespace Jegymester.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = "Admin")]
    public class ScreeningController : ControllerBase
    {
        private readonly IScreeningService _screeningService;

        public ScreeningController(IScreeningService screeningService)
        {
            _screeningService = screeningService;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult List()
        {
            var result = _screeningService.List();
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> AddScreening([FromBody] ScreeningDto screeningDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(new { message = "Invalid data", errors = ModelState });
            }

            try
            {
                var result = await _screeningService.AddScreeningAsync(screeningDto);
                return Ok(new { message = "Screening added successfully", data = result });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An error occurred while adding the screening", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteScreening(int id)
        {
            var result = await _screeningService.DeleteScreeningAsync(id);
            return result ? Ok("Screening deleted.") : BadRequest("Screening not found or cannot be deleted.");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateScreening(int id, [FromBody] ScreeningUpdateDto screeningDto)
        {
            var result = await _screeningService.UpdateScreeningAsync(id, screeningDto);
            return result ? Ok("Screening updated.") : NotFound("Screening not found.");
        }
    }
}