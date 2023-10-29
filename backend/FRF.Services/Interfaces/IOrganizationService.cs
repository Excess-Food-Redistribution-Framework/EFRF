using FRF.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Services.Interfaces
{
    public interface IOrganizationService
    {
        Task AddUserToOrganization(string userId, Guid organizationId);
        Task RemoveUserFromOrganization(string userId, Guid organizationId);

        Task<IEnumerable<Organization>> GetAllOrganizations();
        Task<Organization> GetOrganizationById(Guid id);
        Task AddOrganization(Organization organization);
        Task UpdateOrganization(Organization organization);
        Task DeleteOrganization(Guid id);
    }
}
