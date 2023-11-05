using BCrypt.Net;
using FRF.DAL.Interfaces;
using FRF.Domain.Entities;
using FRF.Domain.Enum;
using FRF.Domain.Responses;
using FRF.Services.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Services.Implementations
{
    public class OrganizationService : IOrganizationService
    {
        // Sercice uses repositories to work with datas
        private readonly IBaseRepository<Organization> _organizationRepository;

        private readonly IFoodRequestService _foodRequestService;
        private readonly IProductService _productService;

        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        // Dependency Injection (DI).
        public OrganizationService(
            IBaseRepository<Organization> organizationRepository,
            UserManager<User> userManager,
            RoleManager<IdentityRole> roleManager,
            IFoodRequestService foodRequestService,
            IProductService productService)
        {
            _organizationRepository = organizationRepository;
            _userManager = userManager;
            _roleManager = roleManager;
            _foodRequestService = foodRequestService;
            _productService = productService;
        }

        public async Task<BaseResponse<bool>> AddUserToOrganization(string userId, Guid organizationId/*, string password*/)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user is null)
                {
                    return new BaseResponse<bool>
                    {
                        StatusCode = HttpStatusCode.NotFound,
                        Message = "User not found",
                        Data = false
                    };
                }

                var organization = await _organizationRepository.GetById(organizationId);
                if (organization is null)
                {
                    return new BaseResponse<bool>
                    {
                        StatusCode = HttpStatusCode.NotFound,
                        Message = "Organization not found",
                        Data = false
                    };
                }

                //if (!BCrypt.Net.BCrypt.Verify(password, organization.Password))
                //{
                //    return new BaseResponse<Organization>
                //    {
                //        StatusCode = StatusCode.BadRequest,
                //        Message = "Incorrect password",
                //        Data = null
                //    };
                //}

                if (!organization.AllowedEmails.Any(a => a.Email == user.Email))
                {
                    return new BaseResponse<bool>
                    {
                        StatusCode = HttpStatusCode.InternalServerError,
                        Message = "You are not in invited users list",
                        Data = false
                    };
                }

                if (organization.Users.Any(u => u.Id == userId))
                {
                    return new BaseResponse<bool>
                    {
                        StatusCode = HttpStatusCode.InternalServerError,
                        Message = "User already is in organization",
                        Data = false
                    };
                }

                organization.Users.Add(user);
                await _organizationRepository.Update(organization);

                // Add role depending on organization type
                OrganizationType role = organization.Type == OrganizationType.Provider ? OrganizationType.Provider : OrganizationType.Distributer;
                await _userManager.AddToRoleAsync(user, role.ToString());

                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = "User was successfuly added to the organization",
                    Data = true
                };
            }
            catch (Exception e)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = "User wasn't added to the organization: " + e.Message,
                    Data = false
                };
            }
        }

        public async Task<BaseResponse<bool>> RemoveUserFromOrganization(string userId, Guid organizationId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user is null)
                {
                    return new BaseResponse<bool>
                    {
                        StatusCode = HttpStatusCode.NotFound,
                        Message = "User not found",
                        Data = false
                    };
                }

                var organization = await _organizationRepository.GetById(organizationId);
                if (organization is null)
                {
                    return new BaseResponse<bool>
                    {
                        StatusCode = HttpStatusCode.NotFound,
                        Message = "Organization not found",
                        Data = false
                    };
                }

                if (!organization.Users.Any(u => u.Id == user.Id))
                {
                    return new BaseResponse<bool>
                    {
                        StatusCode = HttpStatusCode.InternalServerError,
                        Message = "User not in Organization",
                        Data = false
                    };
                }

                if (organization.CreatorId.ToString() == user.Id)
                {
                    return new BaseResponse<bool>
                    {
                        StatusCode = HttpStatusCode.InternalServerError,
                        Message = "Creator can't be removed",
                        Data = false
                    };
                }

                organization.Users.Remove(user);
                await _organizationRepository.Update(organization);

                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = "User was successfuly removed from the organization",
                    Data = true
                };
            }
            catch (Exception e)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = "User wasn't removed from the organization: " + e.Message,
                    Data = false
                };
            }
        }


        public async Task<BaseResponse<IEnumerable<Organization>>> GetAllOrganizations()
        {
            try
            {
                var organizations = await _organizationRepository.GetAll()
                    .Include(o => o.Users)
                    .Include(o => o.Products)
                    .Include(o => o.AllowedEmails)
                    .ToListAsync();

                return new BaseResponse<IEnumerable<Organization>>
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = "Get all Organizations successfuly",
                    Data = organizations
                };
            }
            catch (Exception e)
            {
                return new BaseResponse<IEnumerable<Organization>>
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = "Get all Organizations error: " + e.Message,
                    Data = null
                };
            }
        }


        public async Task<BaseResponse<Organization>> GetOrganizationById(Guid id)
        {
            try
            {
                var organization = await _organizationRepository.GetAll()
                    .Include(o => o.Users)
                    .Include(o => o.Products)
                    .Include(o => o.AllowedEmails)
                    .Where(o => o.Id == id)
                    .FirstOrDefaultAsync();
                if (organization is null)
                {
                    return new BaseResponse<Organization>
                    {
                        StatusCode = HttpStatusCode.NotFound,
                        Message = "Organization not found",
                        Data = null
                    };
                }

                return new BaseResponse<Organization>
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = "Organization was found",
                    Data = organization
                };
            }
            catch (Exception e)
            {
                return new BaseResponse<Organization>
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = "Get Organizations by id error: " + e.Message,
                    Data = null
                };
            }
        }

        public async Task<BaseResponse<Organization>> GetOrganizationByUser(string id)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(id);
                if (user is null)
                {
                    return new BaseResponse<Organization>
                    {
                        StatusCode = HttpStatusCode.NotFound,
                        Message = "User not found",
                        Data = null
                    };
                }

                var organization = await _organizationRepository.GetAll()
                    .Include(o => o.Users)
                    .Include(o => o.Products)
                    .Include(o => o.AllowedEmails)
                    .Where(o => o.Users.Any(u => u.Id == id))
                    .FirstOrDefaultAsync();

                if (organization is null)
                {
                    return new BaseResponse<Organization>
                    {
                        StatusCode = HttpStatusCode.NotFound,
                        Message = "User not in any organization",
                        Data = null
                    };
                }

                return new BaseResponse<Organization>
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = "Get Organization succesfully",
                    Data = organization
                };
            }
            catch (Exception e)
            {
                return new BaseResponse<Organization>
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = "Organization not found - " + e.Message,
                    Data = null
                };
            }
        }

        public async Task<BaseResponse<bool>> CreateOrganization(Organization organization)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(organization.CreatorId.ToString());
                if (user is null)
                {
                    return new BaseResponse<bool>
                    {
                        StatusCode = HttpStatusCode.NotFound,
                        Message = "Creator User not found",
                        Data = false
                    };
                }

                // Test if user is in another organization
                string creatorId = organization.CreatorId.ToString();

                var org = await _organizationRepository.GetAll()
                    .Include(o => o.Users)
                    .Where(o => o.Users.Any(u => u.Id == creatorId))
                    .FirstOrDefaultAsync();

                if (org != null)
                {
                    return new BaseResponse<bool>
                    {
                        StatusCode = HttpStatusCode.InternalServerError,
                        Message = "Creator already is in the organization",
                        Data = false
                    };
                }

                organization.Users.Add(user);
                await _organizationRepository.Add(organization);

                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = "Organization was succesfuly created",
                    Data = true
                };
            }
            catch (Exception e)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = "AddOrganization error: " + e.Message,
                    Data = false
                };
            }
        }

        public async Task<BaseResponse<bool>> UpdateOrganization(Organization organization)
        {
            try
            {
                await _organizationRepository.Update(organization);

                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = "Organization was succesfuly updated",
                    Data = true
                };
            }
            catch (Exception e)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = "UpdateOrganization error: " + e.Message,
                    Data = false
                };
            }
        }

        public async Task<BaseResponse<bool>> DeleteOrganization(Guid id)
        {
            try
            {
                var getOrganizationResponse = await GetOrganizationById(id);
                var organization = getOrganizationResponse.Data;
                if (getOrganizationResponse.StatusCode != HttpStatusCode.OK)
                {
                    return new BaseResponse<bool>
                    {
                        StatusCode = getOrganizationResponse.StatusCode,
                        Message = getOrganizationResponse.Message,
                        Data = false
                    };
                }

                var getFoodRequestsResponse = await _foodRequestService.GetAllFoodRequestsByOrganization(organization.Id);
                if (getFoodRequestsResponse.StatusCode != HttpStatusCode.OK)
                {
                    return new BaseResponse<bool>
                    {
                        StatusCode = getFoodRequestsResponse.StatusCode,
                        Message = getFoodRequestsResponse.Message,
                        Data = false
                    };
                }
                if (getFoodRequestsResponse.Data?.Count() > 0)
                {
                    return new BaseResponse<bool>
                    {
                        StatusCode = HttpStatusCode.BadRequest,
                        Message = "Organization's requests list is not empty",
                        Data = false
                    };
                }

                organization.Products.ForEach(async p =>
                {
                    var deleteProductResponse = await _productService.DeleteProduct(p.Id);
                });
                
                organization?.Users.Clear();
                await _organizationRepository.Update(organization);

                await _organizationRepository.Delete(id);

                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = "Organization was succesfuly deleted",
                    Data = true
                };
            }
            catch (Exception e)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.InternalServerError,
                    Message = "DeleteOrganization error: " + e.Message,
                    Data = false
                };
            }
        }
    }
}
