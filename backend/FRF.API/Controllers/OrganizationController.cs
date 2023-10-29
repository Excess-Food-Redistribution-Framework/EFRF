using FRF.Domain.Entities;
using FRF.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
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

        // Dependency Injection (DI).
        public OrganizationController(IOrganizationService organizationService)
        {
            _organizationService = organizationService;
        }

        // GET: api/<OrganizationController>
        [HttpGet]
        public async Task<IEnumerable<Organization>> Get()
        {
            return await _organizationService.GetAllOrganizations();
        }

        // GET api/<OrganizationController>/5
        [HttpGet("{id}")]
        public async Task<Organization> Get(Guid id)
        {
            return await _organizationService.GetOrganizationById(id);
        }

        // POST api/<OrganizationController>
        [HttpPost]
        public async Task Post([FromBody] Organization organization)
        {
            await _organizationService.AddOrganization(organization);
        }

        // PUT api/<OrganizationController>/5
        [HttpPut("{id}")]
        public async Task Put(Guid id, [FromBody] Organization organization)
        {
            organization.Id = id;
            await _organizationService.UpdateOrganization(organization);
        }

        // DELETE api/<OrganizationController>/5
        [HttpDelete("{id}")]
        public async Task Delete(Guid id)
        {
            await _organizationService.DeleteOrganization(id);
        }




        [HttpPost]
        [Authorize]
        [Route("JoinOrganization")]
        [SwaggerOperation("Join to the organization")]
        [SwaggerResponse(StatusCodes.Status200OK, "User joined the organization successfully")]
        [SwaggerResponse(StatusCodes.Status400BadRequest, "User join organization failed", Type = typeof(MessageResponseDto))]
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
            catch (Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}
