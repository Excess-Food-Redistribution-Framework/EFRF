using FRF.Domain.Entities;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using FRF.API.Dto.Organization;
using Microsoft.AspNetCore.Authorization;
using Swashbuckle.AspNetCore.Annotations;
using FRF.Services.Interfaces;
using FRF.API.Dto.User;
using FRF.Domain.Exceptions;

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
        [SwaggerResponse(StatusCodes.Status200OK, "User registered successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "User register failed", Type = typeof(MessageResponseDto))]
        public async Task<ActionResult<LoginResponseDto>> Register(RegisterDto model)
        {
            var user = new User {
                // Now UserName is set on Email value.
                UserName = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
            };
      
            var result = await _userManager.CreateAsync(user, model.Password);
            //result = await _userManager.SetUserNameAsync(user, model.UserName);
            //result = await _userManager.SetEmailAsync(user, model.Email);
            if (!result.Succeeded)
            {
                throw new ApiException(result.Errors.FirstOrDefault()?.Description, HttpStatusCode.BadRequest);
            }

            Organization organization = _mapper.Map<Organization>(model.Organization);
            organization.CreatorId = Guid.Parse(user.Id);
            await _organizationService.CreateOrganization(organization);

            var token = await LoginUserAndGenerateToken(model.Email, model.Password);
            
            var userToReturn = _mapper.Map<UserWithOrganizationDto>(user);
            userToReturn.Organization = _mapper.Map<OrganizationDto>(organization);
            
            return Ok(new LoginResponseDto() { Token = token, User = userToReturn });
        }
        
        [HttpPost]
        [Route("Login")]
        [SwaggerOperation("Login")]
        [SwaggerResponse(StatusCodes.Status200OK, "User logged in successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "User login failed", Type = typeof(MessageResponseDto))]
        public async Task<ActionResult<LoginResponseDto>> Login(LoginDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            var organization = await _organizationService.GetOrganizationByUser(user.Id);
            
            var token = await LoginUserAndGenerateToken(model.Email, model.Password);
            var userToReturn = _mapper.Map<UserWithOrganizationDto>(user);
            userToReturn.Organization = _mapper.Map<OrganizationDto>(organization);
            
            return Ok(new LoginResponseDto() { Token = token, User = userToReturn });
        }

        [HttpGet]
        [Authorize]
        [SwaggerOperation("Get current user")]
        [SwaggerResponse(StatusCodes.Status200OK)]
        [SwaggerResponse(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<UserWithOrganizationDto>> GetAccount()
        {
            var userResponse = _mapper.Map<UserWithOrganizationDto>(await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value));
            userResponse.Organization = _mapper.Map<OrganizationDto>(await _organizationService.GetOrganizationByUser(userResponse.Id.ToString()));
            
            return Ok(userResponse);
        }
        
        private async Task<String> LoginUserAndGenerateToken(string email, string password)
        {
            var user = await _userManager.FindByEmailAsync(email);

            if (user == null || !await _userManager.CheckPasswordAsync(user, password))
            {
                throw new ApiException("Email or password is incorrect", HttpStatusCode.Unauthorized);
            }
            
            var userRoles = await _userManager.GetRolesAsync(user);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Audience = _config.GetValue<string>("JwtSettings:Audience"),
                Issuer = _config.GetValue<string>("JwtSettings:Issuer"),
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim("UserId", user.Id.ToString()),
                    new Claim("Email", user.Email.ToString()),
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
            
            return token;
        }
    }
}
