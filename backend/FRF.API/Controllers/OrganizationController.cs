using AutoMapper;
using FRF.API.Dto.Organization;
using FRF.Domain.Entities;
using FRF.Domain.Enum;
using FRF.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.Collections.Generic;
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
        public async Task<IEnumerable<Organization>?> Get()
        {
            var getResponse = await _organizationService.GetAllOrganizations();
            return getResponse.Data;
        }

        [HttpPost]
        [Authorize]
        [Route("CreateOrganization")]
        [SwaggerOperation("Create to the organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "User created the organization successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "User created organization - failed", Type = typeof(MessageResponseDto))]
        public async Task<Object> CreateOrganization([FromBody] CreateOrganizationDto createOrganizationDto)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            var organization = _mapper.Map<Organization>(createOrganizationDto);
            organization.CreatorId = Guid.Parse(user.Id);

            //string salt = BCrypt.Net.BCrypt.GenerateSalt();
            //organization.Password = BCrypt.Net.BCrypt.HashPassword(organization.Password, salt);

            var createOrganizationResponse = await _organizationService.CreateOrganization(organization);
            if (createOrganizationResponse.Data == true)
            {
                // Add role depending on organization type
                OrganizationType role = organization.Type == OrganizationType.Provider ? OrganizationType.Provider : OrganizationType.Distributer;
                await _userManager.AddToRoleAsync(user, role.ToString());

                var organizationDto = _mapper.Map<OrganizationDto>(organization);
                return Ok(organizationDto);
            }
            else
            {
                return BadRequest(createOrganizationResponse.Message);
            }
        }

        [HttpPut]
        [Authorize]
        [Route("UpdateOrganization")]
        [SwaggerOperation("Update to the organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "User updated the organization successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "User updated organization - failed", Type = typeof(MessageResponseDto))]
        public async Task<Object> UpdateOrganization([FromBody] UpdateOrganizationDto updateOrganizationDto)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
            var organization = getOrganizationResponse.Data;
            
            if (organization == null)
            {
                return BadRequest(getOrganizationResponse);
            }

            if (organization.CreatorId.ToString() != user.Id)
            {
                return BadRequest("User isn't the organization's creator");
            }

            if (updateOrganizationDto.Name != String.Empty)
                organization.Name = updateOrganizationDto.Name;
            if (updateOrganizationDto.Information != String.Empty)
                organization.Information = updateOrganizationDto.Information;
            //if (updateOrganizationDto.Password != String.Empty)
            //{
            //    string salt = BCrypt.Net.BCrypt.GenerateSalt();
            //    organization.Password = BCrypt.Net.BCrypt.HashPassword(updateOrganizationDto.Password, salt);
            //}

            var updateOrganizationResponse = await _organizationService.UpdateOrganization(organization);
            if (updateOrganizationResponse.Data == true)
            {
                var organizationDto = _mapper.Map<OrganizationDto>(organization);
                return Ok(organizationDto);
            }
            else
            {
                return BadRequest(updateOrganizationResponse.Message);
            }
        }

        [HttpPost]
        [Authorize]
        [Route("AddEmailToInvitedOrganization")]
        [SwaggerOperation("Add email to the list of allowed emails in organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "Email added to allowed successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Email added to allowed - failed", Type = typeof(MessageResponseDto))]
        public async Task<Object> AddEmailToAllowed([FromBody] AllowedEmailDto email)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
            var organization = getOrganizationResponse.Data;

            if (organization == null)
            {
                return BadRequest(getOrganizationResponse);
            }

            if (organization.CreatorId.ToString() != user.Id)
            {
                return BadRequest("User isn't the organization's creator");
            }

            if (email.Email != String.Empty)
                if (organization.AllowedEmails.Contains(email.Email))
                {
                    return BadRequest("This email is already in allowed list");
                }
            organization.AllowedEmails = string.Join(";", organization.AllowedEmails, email.Email);

            var updateOrganizationResponse = await _organizationService.UpdateOrganization(organization);
            if (updateOrganizationResponse.Data == true)
            {
                return Ok(organization.AllowedEmails.Split(';').ToList());
            }
            else
            {
                return BadRequest(updateOrganizationResponse.Message);
            }
        }

        [HttpDelete]
        [Authorize]
        [Route("RemoveEmailToInvitedOrganization")]
        [SwaggerOperation("Remove email to the list of allowed emails in organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "Email removed to allowed successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "Email removed to allowed - failed", Type = typeof(MessageResponseDto))]
        public async Task<Object> RemoveEmailFromAllowed([FromBody] AllowedEmailDto email)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
            var organization = getOrganizationResponse.Data;

            if (organization == null)
            {
                return BadRequest(getOrganizationResponse);
            }

            if (organization.CreatorId.ToString() != user.Id)
            {
                return BadRequest("User isn't the organization's creator");
            }

            if (email.Email != String.Empty)
                if (!organization.AllowedEmails.Contains(email.Email))
                {
                    return BadRequest("This email not found in allowed list");
                }
            organization.AllowedEmails = string.Join(";", organization.AllowedEmails.Split(';').Where(e => e != email.Email));

            var updateOrganizationResponse = await _organizationService.UpdateOrganization(organization);
            if (updateOrganizationResponse.Data == true)
            {
                return Ok(organization.AllowedEmails.Split(';').ToList());
            }
            else
            {
                return BadRequest(updateOrganizationResponse.Message);
            }
        }

        [HttpDelete]
        [Authorize]
        [Route("DeleteOrganization")]
        [SwaggerOperation("Delete to the organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "User deleted the organization successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "User delete organization - failed", Type = typeof(MessageResponseDto))]
        public async Task<Object> DeleteOrganization()
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user.Id == null)
            {
                return BadRequest("User not found");
            }

            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
            if (getOrganizationResponse.Data == null)
            {
                return BadRequest(getOrganizationResponse.Message);
            }

            var organization = getOrganizationResponse.Data;

            if (organization == null)
            {
                return BadRequest(getOrganizationResponse);
            }

            if (organization.CreatorId.ToString() != user.Id)
            {
                return BadRequest("User isn't the organization's creator");
            }

            // Remove all roles depending on organization type
            OrganizationType role = organization.Type == OrganizationType.Provider ? OrganizationType.Provider : OrganizationType.Distributer;
            // Copu users list
            var users = organization.Users.ToList();

            var deleteOrganizationResponse = await _organizationService.DeleteOrganization(organization.Id);
            if (deleteOrganizationResponse.Data == true)
            {
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
            else
            {
                return BadRequest(deleteOrganizationResponse.Message);
            }
        }

        [HttpDelete]
        [Authorize]
        [Route("KickUserFromOrganization")]
        [SwaggerOperation("Kick user from organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "User kicked from organization successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "User kicked from organization - failed", Type = typeof(MessageResponseDto))]
        public async Task<Object> KickUserFromOrganization(string userId)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user.Id == null)
            {
                return BadRequest("User not found");
            }

            var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
            if (getOrganizationResponse.Data == null)
            {
                return BadRequest(getOrganizationResponse.Message);
            }

            var organization = getOrganizationResponse.Data;

            if (organization.CreatorId.ToString() != user.Id)
            {
                return BadRequest("User isn't the organization's creator");
            }
            // Remove all roles depending on organization type
            OrganizationType role = organization.Type == OrganizationType.Provider ? OrganizationType.Provider : OrganizationType.Distributer;

            var userForDelete = await _userManager.FindByIdAsync(userId);

            var deleteFromOrganizationResponse = await _organizationService.RemoveUserFromOrganization(userForDelete.Id, organization.Id);
            if (deleteFromOrganizationResponse.StatusCode == Domain.Enum.StatusCode.Ok)
            {
                await _userManager.RemoveFromRoleAsync(userForDelete, role.ToString());

                var organizationDto = _mapper.Map<OrganizationDto>(organization);
                return Ok(organizationDto);
            }
            else
            {
                return BadRequest(deleteFromOrganizationResponse.Message);
            }
        }


        [HttpPost]
        [Authorize]
        [Route("JoinOrganization")]
        [SwaggerOperation("Join to the organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "User joined the organization successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "User join organization failed", Type = typeof(MessageResponseDto))]
        public async Task<Object> JoinOrganization(JoinOrganizationDto joinOrganizationDto)
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user.Id == null)
            {
                return BadRequest("User not found");
            }

            try
            {
                // Add role depending on organization type
                var getOrganizationResponse = await _organizationService.GetOrganizationById(joinOrganizationDto.OrganizationId);
                var organization = getOrganizationResponse.Data;
                var joinResponse = await _organizationService.AddUserToOrganization(user.Id, joinOrganizationDto.OrganizationId/*, joinOrganizationDto.Password */);

                if (joinResponse.StatusCode != Domain.Enum.StatusCode.Ok)
                {
                    return BadRequest(joinResponse.Message);
                }
                OrganizationType role = organization?.Type == OrganizationType.Provider ? OrganizationType.Provider : OrganizationType.Distributer;
                await _userManager.AddToRoleAsync(user, role.ToString());

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
        public async Task<Object> LeaveOrganization()
        {
            var user = await _userManager.FindByIdAsync(User?.FindFirst("UserId")?.Value);
            if (user.Id == null)
            {
                return BadRequest("User not found");
            }

            try
            {
                var getOrganizationResponse = await _organizationService.GetOrganizationByUser(user.Id);
                var organization = getOrganizationResponse.Data;
                var leaveResponse = await _organizationService.RemoveUserFromOrganization(user.Id, organization.Id);

                if (leaveResponse.StatusCode != Domain.Enum.StatusCode.Ok)
                {
                    return BadRequest(leaveResponse.Message);
                }

                // Remove role depending on organization type
                OrganizationType role = organization?.Type == OrganizationType.Provider ? OrganizationType.Provider : OrganizationType.Distributer;
                await _userManager.RemoveFromRoleAsync(user, role.ToString());

                return Ok("User leaved organization");
            }
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}