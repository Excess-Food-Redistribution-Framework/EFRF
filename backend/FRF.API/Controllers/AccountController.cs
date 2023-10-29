using FRF.API.ViewModels;
using FRF.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using FRF.API.Dto;
using FRF.API.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Swashbuckle.AspNetCore.Annotations;
using FRF.Services.Interfaces;

namespace FRF.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private IOrganizationService _organizationService;
        private UserManager<User> _userManager;
        private SignInManager<User> _signInManager;
        private RoleManager<IdentityRole> _roleManager;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;

        public AccountController(
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

        [HttpPost]
        [Route("Register")]
        [SwaggerOperation("Registration")]
        public async Task<Object> Register(RegisterViewModel model)
        {
            var user = new User { 
                UserName = model.UserName,
                Email = model.Email,
            };
            
            try
            {
                var result = await _userManager.CreateAsync(user, model.Password);
                //result = await _userManager.SetUserNameAsync(user, model.UserName);
                //result = await _userManager.SetEmailAsync(user, model.Email);
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        [Authorize]
        [Route("JoinOrganization")]
        [SwaggerOperation("Join to the organization")]
        public async Task<Object> JoinOrganization(Guid organizationId)
        {
            var userId = User.FindFirst("UserId")?.Value;
            if (userId == null)
            {
                return BadRequest("User not found");
            }

            try
            {
                await _organizationService.AddUserToOrganization(userId, organizationId);

                return Ok("User joined organization");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }


        [HttpPost]
        [Authorize]
        [Route("LeaveOrganization")]
        [SwaggerOperation("Leave the organization")]
        public async Task<Object> LeaveOrganization(Guid organizationId)
        {
            var userId = User.FindFirst("UserId")?.Value;
            if (userId == null)
            {
                return BadRequest("User not found");
            }

            try
            {
                await _organizationService.RemoveUserFromOrganization(userId, organizationId);

                return Ok("User leaved organization");
            }
            catch(Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [HttpPost]
        [Route("Login")]
        [SwaggerOperation("Login")]
        [SwaggerResponse(StatusCodes.Status200OK, "User logged in successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "User login failed", Type = typeof(MessageResponseDto))]
        public async Task<ActionResult<LoginResponseDto>> Login(LoginViewModel model)
        {
            var user = await _userManager.FindByNameAsync(model.UserName);
            if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
            {
                var userRoles = await _userManager.GetRolesAsync(user);

                var tokenDescriptor = new SecurityTokenDescriptor
                {
                    Audience = _config.GetValue<string>("JwtSettings:Audience"),
                    Issuer = _config.GetValue<string>("JwtSettings:Issuer"),
                    Subject = new ClaimsIdentity(new Claim[]
                    {
                        new Claim("UserId", user.Id.ToString()),
                        new Claim("Name", user.UserName.ToString())
                    }),
                    Expires = DateTime.UtcNow.AddDays(1),
                    SigningCredentials = new SigningCredentials(
                        new SymmetricSecurityKey(
                            Encoding.UTF8.GetBytes(_config.GetValue<string>("JwtSettings:Key"))),
                        SecurityAlgorithms.HmacSha256
                        )
                };
                foreach (var role in userRoles)
                {
                    tokenDescriptor.Subject.AddClaim(new Claim(ClaimTypes.Role, role));
                }

                var tokenHandler = new JwtSecurityTokenHandler();
                var securityToken = tokenHandler.CreateToken(tokenDescriptor);
                var token = tokenHandler.WriteToken(securityToken);

                return Ok(new LoginResponseDto() { Token = token, User = _mapper.Map<UserDto>(user) });
            }
            else
            {
                return BadRequest(new MessageResponseDto() { Message = "Username or password is incorrect" });
            }
        }
        
        [HttpGet]
        [Authorize]
        [SwaggerOperation("Get current user")]
        [SwaggerResponse(StatusCodes.Status200OK)]
        [SwaggerResponse(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<UserDto>> GetAccount()
        {
            User user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            return Ok(_mapper.Map<UserDto>(user));
        }
    }
}
