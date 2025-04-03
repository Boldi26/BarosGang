using Microsoft.AspNetCore.Mvc;
using Jegymester.Services;
using Jegymester.DataContext.Dtos;
using System.Threading.Tasks;

namespace Jegymester.Controllers
{
    [ApiController]
    [Route("api/[controller]/[action]")]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpGet]
        public async Task<IActionResult> List()
        {
            var result = await _userService.ListAsync();
            return Ok(result);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.RegisterAsync(userDto);
            return Ok(result);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.LoginAsync(userDto);
            return result != null ? Ok(result) : Unauthorized("Hibás email vagy jelszó.");
        }

        [HttpPut("update-user/{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateDto userDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var result = await _userService.UpdateUserAsync(id, userDto);
            return result ? Ok("Felhasználó frissítve.") : NotFound("Felhasználó nem található.");
        }
    }
}
