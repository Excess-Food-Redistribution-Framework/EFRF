using FRF.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Swashbuckle.AspNetCore.Annotations;
using FRF.Services.Interfaces;
using FRF.API.Dto.User;

namespace FRF.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private IOrganizationService _organizationService;
        private UserManager<User> _userManager;
        private SignInManager<User> _signInManager;
        private RoleManager<IdentityRole> _roleManager;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;

        public UserController(
            UserManager<User> userManager, 
            RoleManager<IdentityRole> roleManager, 
            SignInManager<User> signInManager,
            IMapper mapper,
            IConfiguration config, 
            IOrganizationService organizationService
            )
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
            _mapper = mapper;
            _config = config;
            _organizationService = organizationService;
        }
        
        [HttpGet]
        [Authorize]
        [SwaggerOperation("Get current user")]
        [SwaggerResponse(StatusCodes.Status200OK)]
        [SwaggerResponse(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            
            var userResponse = _mapper.Map<UserDto>(user);
            
            return Ok(userResponse);
        }
    }
}
