using BCrypt.Net;
using FRF.DAL.Interfaces;
using FRF.Domain.Entities;
using FRF.Domain.Enum;
using FRF.Domain.Exceptions;
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
        private readonly IBaseRepository<Comment> _commentRepository;

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
            IProductService productService,
            IBaseRepository<Comment> commentRepository)
        {
            _organizationRepository = organizationRepository;
            _userManager = userManager;
            _roleManager = roleManager;
            _foodRequestService = foodRequestService;
            _productService = productService;
            _commentRepository = commentRepository;
        }

        public async Task<bool> AddUserToOrganization(string userId, Guid organizationId/*, string password*/)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user is null)
                {
                    throw new NotFoundApiException("User with id: " + userId + ", not found");
                }

                var organization = await _organizationRepository.GetById(organizationId);
                if (organization is null)
                {
                    throw new NotFoundApiException("Organization with id: " + organizationId + ", not found");
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
                    throw new BadRequestApiException("You are not in invited users list");
                }

                if (organization.Users.Any(u => u.Id == userId))
                {
                    throw new BadRequestApiException("User already is in organization");
                }

                organization.Users.Add(user);
                await _organizationRepository.Update(organization);

                // Add role depending on organization type
                OrganizationType role = organization.Type == OrganizationType.Provider ? OrganizationType.Provider : OrganizationType.Distributor;
                await _userManager.AddToRoleAsync(user, role.ToString());

                return true;
            }
            catch (Exception e)
            {
                throw new InternalServerErrorApiException("AddUserToOrganization error", e);
            }
        }

        public async Task<bool> RemoveUserFromOrganization(string userId, Guid organizationId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user is null)
                {
                    throw new NotFoundApiException("User with id: " + userId + ", not found");
                }

                var organization = await _organizationRepository.GetById(organizationId);
                if (organization is null)
                {
                    throw new NotFoundApiException("Organization with id: " + organizationId + ", not found");
                }

                if (!organization.Users.Any(u => u.Id == user.Id))
                {
                    throw new BadRequestApiException("User not in Organization");
                }

                if (organization.CreatorId.ToString() == user.Id)
                {
                    throw new BadRequestApiException("Creator can't be removed");
                }

                organization.Users.Remove(user);
                await _organizationRepository.Update(organization);

                return true;
            }
            catch (Exception e)
            {
                throw new InternalServerErrorApiException("RemoveUserFromOrganization error", e);
            }
        }


        public async Task<IEnumerable<Organization>> GetAllOrganizations()
        {
            try
            {
                var organizations = await _organizationRepository.GetAll()
                    .Include(o => o.Users)
                    .Include(o => o.Products)
                    .Include(o => o.AllowedEmails)
                    .Include(o => o.Address)
                    .Include(o => o.Location)
                    .Include(o => o.Comments)
                    .ToListAsync();

                return organizations;
            }
            catch (Exception e)
            {
                throw new InternalServerErrorApiException("GetAllOrganizations error", e);
            }
        }


        public async Task<Organization> GetOrganizationById(Guid organizationId)
        {
            try
            {
                var organization = await _organizationRepository.GetAll()
                    .Include(o => o.Users)
                    .Include(o => o.Products)
                    .Include(o => o.AllowedEmails)
                    .Include(o => o.Address)
                    .Include(o => o.Location)
                    .Include(o => o.Comments)
                    .Where(o => o.Id == organizationId)
                    .FirstOrDefaultAsync();
                if (organization is null)
                {
                    throw new NotFoundApiException("Organization with id: " + organizationId + ", not found");
                }

                return organization;
            }
            catch (Exception e)
            {
                throw new InternalServerErrorApiException("GetOrganizationById error", e);
            }
        }

        public async Task<Organization> GetOrganizationByUser(string userId)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(userId);
                if (user is null)
                {
                    throw new NotFoundApiException("User with id: " + userId + ", not found");
                }

                var organization = await _organizationRepository.GetAll()
                    .Include(o => o.Users)
                    .Include(o => o.Products)
                    .Include(o => o.AllowedEmails)
                    .Include(o => o.Address)
                    .Include(o => o.Location)
                    .Include(o => o.Comments)
                    .Where(o => o.Users.Any(u => u.Id == userId))
                    .FirstOrDefaultAsync();

                if (organization is null)
                {
                    throw new BadRequestApiException("User not in any organization");
                }

                return organization;
            }
            catch (BadRequestApiException)
            {
                throw;
            }
            catch (NotFoundApiException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new InternalServerErrorApiException("GetOrganizationByUser error", e);
            }
        }

        public async Task<Organization> GetOrganizationByProduct(Guid productId)
        {
            try
            {
                var organization = await _organizationRepository.GetAll()
                    .Include(o => o.Users)
                    .Include(o => o.Products)
                    .Include(o => o.AllowedEmails)
                    .Include(o => o.Address)
                    .Include(o => o.Location)
                    .Include(o => o.Comments)
                    .Where(o => o.Products.Any(u => u.Id == productId))
                    .FirstOrDefaultAsync();

                if (organization is null)
                {
                    throw new BadRequestApiException("Product not in any organization");
                }

                return organization;
            }
            catch (BadRequestApiException)
            {
                throw;
            }
            catch (NotFoundApiException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new InternalServerErrorApiException("GetOrganizationByProduct error", e);
            }
        }

        public async Task<bool> CreateOrganization(Organization organization)
        {
            try
            {
                var user = await _userManager.FindByIdAsync(organization.CreatorId.ToString());
                if (user is null)
                {
                    throw new NotFoundApiException("Creator user not found");
                }

                string creatorId = organization.CreatorId.ToString();

                var org = await _organizationRepository.GetAll()
                    .Include(o => o.Users)
                    .Where(o => o.Users.Any(u => u.Id == creatorId))
                    .FirstOrDefaultAsync();

                if (org != null)
                {
                    throw new BadRequestApiException("Creator already is in other organization");
                }

                organization.Users.Add(user);
                await _organizationRepository.Add(organization);

                return true;
            }
            catch (BadRequestApiException)
            {
                throw;
            }
            catch (NotFoundApiException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new InternalServerErrorApiException("CreateOrganization error", e);
            }
        }

        public async Task<bool> UpdateOrganization(Organization organization)
        {
            try
            {
                await _organizationRepository.Update(organization);

                return true;
            }
            catch (Exception e)
            {
                throw new InternalServerErrorApiException("UpdateOrganization error", e);
            }
        }

        public async Task<bool> DeleteOrganization(Guid id)
        {
            try
            {
                var organization = await GetOrganizationById(id);

                var foodRequests = await _foodRequestService.GetAllFoodRequestsByOrganization(organization.Id);

                foreach (var foodRequest in foodRequests)
                {
                    await _foodRequestService.DeleteFoodRequests(foodRequest.Id, organization);
                }

                organization.Products.ForEach(async p =>
                {
                    var deleteProductResponse = await _productService.DeleteProduct(p.Id);
                });
                
                organization?.Users.Clear();
                if (organization != null)
                {
                    await _organizationRepository.Update(organization);
                }

                await _organizationRepository.Delete(id);

                return true;
            }
            catch (BadRequestApiException)
            {
                throw;
            }
            catch (NotFoundApiException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new InternalServerErrorApiException("DeleteOrganization error", e);
            }
        }

        public async Task<bool> CreateComment(Organization organization, Comment comment)
        {
            try
            {
                if (!organization.Comments.Any(c => c.User == comment.User)) {
                    organization.Comments.Add(comment);
                    organization.AverageEvaulation = organization.Comments.Average(c => c.Evaluation);
                }
                else
                {
                    throw new BadRequestApiException("Comment from this user is already created in this organization");
                }

                await _organizationRepository.Update(organization);

                return true;
            }
            catch (BadRequestApiException)
            {
                throw;
            }
            catch (NotFoundApiException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new InternalServerErrorApiException("DeleteOrganization error", e);
            }
        }

        public async Task<Comment> UpdateComment(Guid idComment, User user, string text, int evaluation)
        {
            try
            {
                var comment = await _commentRepository.GetById(idComment);
                if (comment == null)
                {
                    throw new NotFoundApiException("Comment not found");
                }

                if (comment.User != user)
                {
                    throw new BadRequestApiException("Not comment creator");
                }

                if (text != null)
                {
                    comment.Text = text;
                }
                if (evaluation != -1)
                {
                    comment.Evaluation = evaluation;
                }
                await _commentRepository.Update(comment);

                var organization = await _organizationRepository.GetAll()
                    .Include(o => o.Comments)
                    .FirstOrDefaultAsync(o => o.Comments.Contains(comment));
                if (organization == null)
                {
                    throw new NotFoundApiException("Organization not found");
                }
                organization.AverageEvaulation = organization.Comments.Average(c => c.Evaluation);

                return comment;
            }
            catch (BadRequestApiException)
            {
                throw;
            }
            catch (NotFoundApiException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new InternalServerErrorApiException("DeleteOrganization error", e);
            }
        }

        public async Task<bool> DeleteComment(Guid idComment, User user)
        {
            try
            {
                var comment = await _commentRepository.GetById(idComment);
                if (comment == null)
                {
                    throw new NotFoundApiException("Comment not found");
                }

                if (comment.User != user)
                {
                    throw new BadRequestApiException("Not comment creator");
                }

                var organization = await _organizationRepository.GetAll()
                    .Include(o => o.Comments)
                    .FirstOrDefaultAsync(o => o.Comments.Contains(comment));

                await _commentRepository.Delete(idComment);

                if (organization == null)
                {
                    throw new NotFoundApiException("Organization not found");
                }
                organization.AverageEvaulation = organization.Comments.Average(c => c.Evaluation);

                return true;
            }
            catch (BadRequestApiException)
            {
                throw;
            }
            catch (NotFoundApiException)
            {
                throw;
            }
            catch (Exception e)
            {
                throw new InternalServerErrorApiException("DeleteOrganization error", e);
            }
        }
    }
}
