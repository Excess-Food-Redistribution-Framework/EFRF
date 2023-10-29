using FRF.DAL.Interfaces;
using FRF.Domain.Entities;
using FRF.Domain.Enum;
using FRF.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Services.Implementations
{
    public class OrganizationService : IOrganizationService
    {
        // Sercice uses repositories to work with datas
        private readonly IBaseRepository<Organization> _organizationRepository;
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        // Dependency Injection (DI).
        public OrganizationService(IBaseRepository<Organization> organizationRepository, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _organizationRepository = organizationRepository;
            _userManager = userManager;
            _roleManager = roleManager;
        }

        public async Task AddUserToOrganization(string userId, Guid organizationId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user is null)
            {
                throw new Exception("User not found");
            }

            var organization = await _organizationRepository.GetById(organizationId);
            if (organization is null)
            {
                throw new Exception("Organization not found");
            }

            organization.Users.Add(user);
            await _organizationRepository.Update(organization);

            // Add role depending on organization type
            OrganizationType role = organization.Type == OrganizationType.Provider ? OrganizationType.Provider : OrganizationType.Distributer;
            await _userManager.AddToRoleAsync(user, role.ToString());
        }

        public async Task RemoveUserFromOrganization(string userId, Guid organizationId)
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user is null)
            {
                throw new Exception("User not found");
            }

            var organization = await _organizationRepository.GetById(organizationId);
            if (organization is null)
            {
                throw new Exception("Organization not found");
            }

            if (!organization.Users.Any(u => u.Id == user.Id))
            {
                throw new Exception("User not in Organization");
            }

            organization.Users.Remove(user);
            await _organizationRepository.Update(organization);

            // Add role depending on organization type
            OrganizationType role = organization.Type == OrganizationType.Provider ? OrganizationType.Provider : OrganizationType.Distributer;

            await _userManager.RemoveFromRoleAsync(user, role.ToString());
        }


        public async Task<IEnumerable<Organization>> GetAllOrganizations()
        {
            return await _organizationRepository.GetAll()
                .Include(o => o.Users)
                .Include(o => o.Products)
                .Include(o => o.FoodRequests)
                .ToListAsync();
        }


        public async Task<Organization> GetOrganizationById(Guid id)
        {
            var organization = await _organizationRepository.GetById(id);
            if (organization is null)
            {
                throw new Exception("Organization not found");
            }
            return organization;
        }

        public async Task AddOrganization(Organization product)
        {
            await _organizationRepository.Add(product);
        }

        public async Task UpdateOrganization(Organization product)
        {
            await _organizationRepository.Update(product);
        }

        public async Task DeleteOrganization(Guid id)
        {
            await _organizationRepository.Delete(id);
        }
    }
}
