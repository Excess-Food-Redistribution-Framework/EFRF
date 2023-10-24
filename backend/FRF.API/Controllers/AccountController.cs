using FRF.API.ViewModels;
using FRF.Domain.Entities;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
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
        private readonly IConfiguration _config;

        public AccountController(UserManager<User> userManager, RoleManager<IdentityRole> roleManager, SignInManager<User> signInManager, IConfiguration config, IOrganizationService organizationService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _signInManager = signInManager;
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
        [SwaggerResponse(StatusCodes.Status400BadRequest, "User login failed")]
        public async Task<ActionResult<LoginResponse>> Login(LoginViewModel model)
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

                return Ok(new LoginResponse() { Token = token });
            }
            else
            {
                return BadRequest(new { message = "Username or password is incorrect" });
            }
        }
        
        // TODO: Return object without protected data (password, etc.)
        [HttpGet]
        [Authorize]
        [SwaggerOperation("Get current user")]
        [SwaggerResponse(StatusCodes.Status200OK, "TODO: Complete GetAccount method")]
        [SwaggerResponse(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<User>> GetAccount()
        {
            return Ok(await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value));
        }

        // TODO: DTO class needs to be moved to a separate file
        public class LoginResponse
        {
            public string Token { get; set; } = string.Empty;
        }
    }
}
