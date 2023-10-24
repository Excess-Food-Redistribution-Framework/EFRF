using FRF.Domain.Entities;
using FRF.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
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
    }
}
