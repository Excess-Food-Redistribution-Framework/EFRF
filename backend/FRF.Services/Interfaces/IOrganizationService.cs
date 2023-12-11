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
        Task<bool> AddUserToOrganization(string userId, Guid organizationId/*, string password */);
        Task<bool> RemoveUserFromOrganization(string userId, Guid organizationId);

        Task<IEnumerable<Organization>> GetAllOrganizations();
        Task<Organization> GetOrganizationById(Guid id);
        Task<Organization> GetOrganizationByUser(string id);
        Task<Organization> GetOrganizationByProduct(Guid productId);

        Task<bool> CreateOrganization(Organization organization);
        Task<bool> UpdateOrganization(Organization organization);
        Task<bool> DeleteOrganization(Guid id);

        Task<bool> CreateComment(Organization organization, Comment comment);
        Task<Comment> UpdateComment(Guid idComment, User user, string text, int evaluation);
        Task<bool> DeleteComment(Guid id, User user);
    }
}
