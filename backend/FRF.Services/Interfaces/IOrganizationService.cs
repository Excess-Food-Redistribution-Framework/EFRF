using FRF.Domain.Entities;
using FRF.Domain.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Services.Interfaces
{
    public interface IOrganizationService
    {
        Task<BaseResponse<bool>> AddUserToOrganization(string userId, Guid organizationId/*, string password */);
        Task<BaseResponse<bool>> RemoveUserFromOrganization(string userId, Guid organizationId);

        Task<BaseResponse<IEnumerable<Organization>>> GetAllOrganizations();
        Task<BaseResponse<Organization>> GetOrganizationById(Guid id);
        Task<BaseResponse<Organization>> GetOrganizationByUser(string id);

        Task<BaseResponse<bool>> CreateOrganization(Organization organization);
        Task<BaseResponse<bool>> UpdateOrganization(Organization organization);
        Task<BaseResponse<bool>> DeleteOrganization(Guid id);
    }
}
