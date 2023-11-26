using AutoMapper;
using FRF.API.Dto.Organization;
using FRF.Domain.Entities;
using FRF.Domain.Enum;
using FRF.Domain.Exceptions;
using FRF.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading.Tasks;

namespace FRF.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class OrganizationController : ControllerBase
    {
        // Controller uses services
        private readonly IOrganizationService _organizationService;
        private readonly IMapper _mapper;
        private readonly UserManager<User> _userManager;

        // Dependency Injection (DI).
        public OrganizationController(
            IOrganizationService organizationService,
            IMapper mapper,
            UserManager<User> userManager
            )
        {
            _organizationService = organizationService;
            _mapper = mapper;
            _userManager = userManager;
        }

        // GET: api/<OrganizationController>
        [HttpGet]
        [SwaggerOperation("Get all organizations")]
        public async Task<IEnumerable<Organization>?> Get()
        {
            var organization = await _organizationService.GetAllOrganizations();
            return organization;
        }

        [HttpPost]
        [Authorize]
        [SwaggerOperation("Create organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "User created the organization successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<OrganizationDto>> Post([FromBody] CreateOrganizationDto createOrganizationDto)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user == null)
            {
                throw new NotFoundApiException("User not found");
            }

            var organization = _mapper.Map<Organization>(createOrganizationDto);
            organization.CreatorId = Guid.Parse(user.Id);

            //string salt = BCrypt.Net.BCrypt.GenerateSalt();
            //organization.Password = BCrypt.Net.BCrypt.HashPassword(organization.Password, salt);

            await _organizationService.CreateOrganization(organization);

            // Add role depending on organization type
            OrganizationType role = organization.Type == OrganizationType.Provider ? OrganizationType.Provider : OrganizationType.Distributor;
            await _userManager.AddToRoleAsync(user, role.ToString());

            var organizationDto = _mapper.Map<OrganizationDto>(organization);
            return Ok(organizationDto);
        }

        [HttpPut("Current")]
        [Authorize]
        [SwaggerOperation("Update current user's organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "User updated the organization successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OrganizationDto>> Put([FromBody] UpdateOrganizationDto updateOrganizationDto)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user == null)
            {
                throw new NotFoundApiException("User not found");
            }

            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            if (organization.CreatorId.ToString() != user.Id)
            {
                return BadRequest("User isn't the organization's creator");
            }

            if (updateOrganizationDto.Name != String.Empty)
                organization.Name = updateOrganizationDto.Name;
            if (updateOrganizationDto.Information != String.Empty)
                organization.Information = updateOrganizationDto.Information;
            if (updateOrganizationDto.Location != null)
                organization.Location = _mapper.Map<Location>(updateOrganizationDto.Location);
            if (updateOrganizationDto.Address != null)
                organization.Address = _mapper.Map<Address>(updateOrganizationDto.Address);
            //if (updateOrganizationDto.Password != String.Empty)
            //{
            //    string salt = BCrypt.Net.BCrypt.GenerateSalt();
            //    organization.Password = BCrypt.Net.BCrypt.HashPassword(updateOrganizationDto.Password, salt);
            //}

            await _organizationService.UpdateOrganization(organization);
            
            var organizationDto = _mapper.Map<OrganizationDto>(organization);
            return Ok(organizationDto);
        }
        
        [HttpGet("Current")]
        [Authorize]
        [SwaggerOperation("Get current user's organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "User got the organization successfully")]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<OrganizationDto>> GetUserOrganization()
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            var organizationDto = _mapper.Map<OrganizationDto>(organization);
            return Ok(organizationDto);
        }

        [HttpGet]
        [Route("AllowedEmails")]
        [Authorize]
        [SwaggerOperation("Get current user's organization AllowedEmails")]
        [SwaggerResponse(StatusCodes.Status200OK, "User got the AllowedEmails successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<AllowedEmail>>> GetAllowedEmails()
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user == null)
            {
                throw new NotFoundApiException("User not found");
            }

            var organization = await _organizationService.GetOrganizationByUser(user.Id);


            if (organization.CreatorId.ToString() != user.Id)
            {
                throw new BadRequestApiException("User not organization creator");
            }

            return Ok(organization.AllowedEmails);
        }

        [HttpPost]
        [Authorize]
        [Route("AllowEmail")]
        [SwaggerOperation("Add email to the list of allowed emails in organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "Email added to allowed successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Email added to allowed - failed", Type = typeof(MessageResponseDto))]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<Object> AllowEmail([FromBody] OrganizationEmailDto email)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user == null)
            {
                throw new NotFoundApiException("User not found");
            }

            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            if (organization.CreatorId.ToString() != user.Id)
            {
                throw new BadRequestApiException("User not organization creator");
            }

            if (organization.AllowedEmails.Any(a => a.Email == email.Email))
            {
                throw new BadRequestApiException("This email is already in allowed list");
            }

            var allowedEmail = new AllowedEmail
            {
                Email = email.Email,
            };
            organization.AllowedEmails.Add(allowedEmail);

            await _organizationService.UpdateOrganization(organization);
            return Ok(organization.AllowedEmails);
        }

        [HttpDelete]
        [Authorize]
        [Route("DeclineEmail")]
        [SwaggerOperation("Remove email to the list of allowed emails in organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "Email removed to allowed successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Email removed to allowed - failed", Type = typeof(MessageResponseDto))]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<Object> DeclineEmail([FromBody] OrganizationEmailDto email)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user == null)
            {
                throw new NotFoundApiException("User not found");
            }

            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            if (organization.CreatorId.ToString() != user.Id)
            {
                throw new BadRequestApiException("User not organization creator");
            }

            var allowedEmail = organization.AllowedEmails.Find(a => a.Email == email.Email);
            if (allowedEmail == null)
            {
                throw new BadRequestApiException("This email not found in allowed list");
            }

            organization.AllowedEmails.Remove(allowedEmail);

            await _organizationService.UpdateOrganization(organization);
            return Ok(organization.AllowedEmails);
        }

        [HttpDelete]
        [Authorize]
        [SwaggerOperation("Delete current user's organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "User deleted the organization successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest)]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<Object> Delete()
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user == null)
            {
                throw new NotFoundApiException("User not found");
            }

            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            if (organization.CreatorId.ToString() != user.Id)
            {
                throw new BadRequestApiException("User not organization creator");
            }

            // Remove all roles depending on organization type
            OrganizationType role = organization.Type == OrganizationType.Provider ? OrganizationType.Provider : OrganizationType.Distributor;
            // Copu users list
            var users = organization.Users.ToList();

            await _organizationService.DeleteOrganization(organization.Id);

            if (users != null)
            {
                foreach (User u in users)
                {
                    await _userManager.RemoveFromRoleAsync(u, role.ToString());
                }
            }
            var organizationDto = _mapper.Map<OrganizationDto>(organization);
            return Ok(organizationDto);
        }

        [HttpDelete]
        [Authorize]
        [Route("KickUser")]
        [SwaggerOperation("Kick user from organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "User kicked from organization successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "User kicked from organization - failed", Type = typeof(MessageResponseDto))]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<Object> KickUser(string userId)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user == null)
            {
                throw new NotFoundApiException("User not found");
            }

            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            if (organization.CreatorId.ToString() != user.Id)
            {
                return BadRequest("User isn't the organization's creator");
            }
            // Remove all roles depending on organization type
            OrganizationType role = organization.Type == OrganizationType.Provider ? OrganizationType.Provider : OrganizationType.Distributor;

            var userForDelete = await _userManager.FindByIdAsync(userId);

            await _organizationService.RemoveUserFromOrganization(userForDelete.Id, organization.Id);
            
            await _userManager.RemoveFromRoleAsync(userForDelete, role.ToString());

            var organizationDto = _mapper.Map<OrganizationDto>(organization);
            return Ok(organizationDto);
        }


        [HttpPost]
        [Authorize]
        [Route("Join")]
        [SwaggerOperation("Join to the organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "User joined the organization successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "User join organization failed", Type = typeof(MessageResponseDto))]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<Object> Join(JoinOrganizationDto joinOrganizationDto)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user == null)
            {
                throw new NotFoundApiException("User not found");
            }


            // Add role depending on organization type
            var organization = await _organizationService.GetOrganizationById(joinOrganizationDto.OrganizationId);
            await _organizationService.AddUserToOrganization(user.Id, joinOrganizationDto.OrganizationId/*, joinOrganizationDto.Password */);

            OrganizationType role = organization?.Type == OrganizationType.Provider ? OrganizationType.Provider : OrganizationType.Distributor;
            await _userManager.AddToRoleAsync(user, role.ToString());

            var organizationDto = _mapper.Map<OrganizationDto>(organization);
            return Ok(organizationDto);
        }


        [HttpPost]
        [Authorize]
        [Route("Leave")]
        [SwaggerOperation("Leave the organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "User leaved the organization successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "User leave organization failed", Type = typeof(MessageResponseDto))]
        [SwaggerResponse(StatusCodes.Status404NotFound)]
        public async Task<Object> Leave()
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user == null)
            {
                throw new NotFoundApiException("User not found");
            }

            
            var organization = await _organizationService.GetOrganizationByUser(user.Id);

            await _organizationService.RemoveUserFromOrganization(user.Id, organization.Id);

            // Remove role depending on organization type
            OrganizationType role = organization?.Type == OrganizationType.Provider ? OrganizationType.Provider : OrganizationType.Distributor;
            await _userManager.RemoveFromRoleAsync(user, role.ToString());

            return Ok("User leaved organization");
        }
    }
}