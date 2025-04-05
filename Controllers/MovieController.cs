using Microsoft.AspNetCore.Mvc;
using Jegymester.Services;
using Jegymester.DataContext.Dtos;

namespace Jegymester.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovieController : ControllerBase
    {
        private readonly IMovieService _movieService;

        public MovieController(IMovieService movieService)
        {
            _movieService = movieService;
        }

        [HttpGet("list")]
        public IActionResult List()
        {
            var result = _movieService.List();
            return Ok(result);
        }

        [HttpGet("get-movie/{id}")]
        public async Task<IActionResult> GetMovie(int id)
        {
            var movie = await _movieService.GetMovieByIdAsync(id);
            if (movie == null)
            {
                return NotFound("Film nem található.");
            }
            return Ok(movie);
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
            return result ? Ok("Film törölve.") : NotFound("Film nem található.");
        }

        [HttpPut("update-movie/{id}")]
        public async Task<IActionResult> UpdateMovie(int id, [FromBody] MovieUpdateDto movieDto)
        {
            var result = await _movieService.UpdateMovieAsync(id, movieDto);
            return result ? Ok("Film frissítve.") : NotFound("Film nem található.");
        }
    }
}