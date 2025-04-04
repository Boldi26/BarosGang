﻿using Microsoft.AspNetCore.Mvc;
using Jegymester.Services;
using Jegymester.DataContext.Dtos;
using System.Threading.Tasks;

namespace Jegymester.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class ScreeningController : ControllerBase
    {
        private readonly IScreeningService _screeningService;

        public ScreeningController(IScreeningService screeningService)
        {
            _screeningService = screeningService;
        }

        [HttpGet]
        public IActionResult List()
        {
            var result = _screeningService.List();
            return Ok(result);
        }

        [HttpPost("add-screening")]
        public async Task<IActionResult> AddScreening([FromBody] ScreeningDto screeningDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _screeningService.AddScreeningAsync(screeningDto);
            return Ok(result);
        }

        [HttpDelete("delete-screening/{id}")]
        public async Task<IActionResult> DeleteScreening(int id)
        {
            var result = await _screeningService.DeleteScreeningAsync(id);
            return result ? Ok("Vetítés törölve.") : NotFound("Vetítés nem található.");
        }

        [HttpPut("update-screening/{id}")]
        public async Task<IActionResult> UpdateScreening(int id, [FromBody] ScreeningUpdateDto screeningDto)
        {
            var result = await _screeningService.UpdateScreeningAsync(id, screeningDto);
            return result ? Ok("Vetítés frissítve.") : NotFound("Vetítés nem található.");
        }
    }
}