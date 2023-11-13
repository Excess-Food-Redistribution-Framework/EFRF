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
    public class AuthController : ControllerBase
    {
        private IOrganizationService _organizationService;
        private UserManager<User> _userManager;
        private SignInManager<User> _signInManager;
        private RoleManager<IdentityRole> _roleManager;
        private readonly IMapper _mapper;
        private readonly IConfiguration _config;

        public AuthController(
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
        [SwaggerResponse(StatusCodes.Status400BadRequest, "User register failed")]
        public async Task<ActionResult<LoginResponseDto>> Register([FromBody] RegisterDto model)
        {
            var user = new User
            {
                UserName = model.Email,
                FirstName = model.FirstName,
                LastName = model.LastName,
                Email = model.Email,
            };
            
            var result = await _userManager.CreateAsync(user, model.Password);
            
            if (!result.Succeeded)
            {
                if (await _userManager.FindByEmailAsync(model.Email) != null)
                {
                    throw new ApiException("User with this email already exists", HttpStatusCode.Conflict);
                } 
                else
                {
                    throw new ApiException("User registration failed", HttpStatusCode.BadRequest);
                }
            }
            
            // create organization
            var organization = _mapper.Map<Organization>(model.Organization);
            organization.CreatorId = new Guid(user.Id); 
            
            await _organizationService.CreateOrganization(organization);
            
            return Ok(new LoginResponseDto()
            {
                Token = await LoginUser(model.Email, model.Password),
                User = _mapper.Map<UserDto>(await _userManager.FindByEmailAsync(model.Email)),
                Organization = _mapper.Map<Organization>(organization)
            });
        }

        [HttpPost]
        [Route("Login")]
        [SwaggerOperation("Login")]
        [SwaggerResponse(StatusCodes.Status200OK, "User logged in successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "User login failed")]
        public async Task<ActionResult<LoginResponseDto>> Login(LoginDto model)
        { 
            return Ok(new LoginResponseDto()
            {
                Token = await LoginUser(model.Email, model.Password),
                User = _mapper.Map<UserDto>(await _userManager.FindByEmailAsync(model.Email))
            });
        }

        private async Task<String> LoginUser(string email, string password)
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
