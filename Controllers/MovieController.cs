using Microsoft.AspNetCore.Mvc;
using Jegymester.Services;
using Jegymester.DataContext.Dtos;
using Microsoft.AspNetCore.Authorization;

namespace Jegymester.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    [Authorize(Roles = "Admin")]
    public class MovieController : ControllerBase
    {
        private readonly IMovieService _movieService;

        public MovieController(IMovieService movieService)
        {
            _movieService = movieService;
        }

        [HttpGet]
        [AllowAnonymous]
        public IActionResult List()
        {
            var result = _movieService.List();
            return Ok(result);
        }

        [HttpPost("add-movie")]
        public async Task<IActionResult> AddMovie([FromBody] MovieDto movieDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _movieService.AddMovieAsync(movieDto);
            return Ok(result);
        }

        [HttpDelete("delete-movie/{id}")]
        public async Task<IActionResult> DeleteMovie(int id)
        {
            var result = await _movieService.DeleteMovieAsync(id);
            return result ? Ok("Movie deleted.") : BadRequest("Movie not found or already on screening.");
        }

        [HttpPut("update-movie/{id}")]
        public async Task<IActionResult> UpdateMovie(int id, [FromBody] MovieUpdateDto movieDto)
        {
            var result = await _movieService.UpdateMovieAsync(id, movieDto);
            return result ? Ok("Movie updated.") : NotFound("Movie not found.");
        }
    }


}
