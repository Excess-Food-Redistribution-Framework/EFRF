using FRF.DAL.Interfaces;
using FRF.DAL.Repositories;
using FRF.Domain.Entities;
using FRF.Domain.Enum;
using FRF.Domain.Responses;
using FRF.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

public class FoodRequestService : IFoodRequestService
{
    private readonly IBaseRepository<FoodRequest> _foodRequestRepository;
    private readonly IBaseRepository<Product> _productRepository;
    private readonly IBaseRepository<Organization> _organizationRepository;
    public FoodRequestService(IBaseRepository<FoodRequest> foodRequestRepository, IBaseRepository<Product> productRepository, IBaseRepository<Organization> organizationRepository)
    {
        _foodRequestRepository = foodRequestRepository;
        _productRepository = productRepository;
        _organizationRepository = organizationRepository;
    }

    public async Task<BaseResponse<bool>> ChangeStateFoodRequest(FoodRequestState state, FoodRequest request, Organization creatorOrganization)
    {
        try
        {
            if (
            (request.State == FoodRequestState.Preparing && state == FoodRequestState.Waiting) ||
            (request.State == FoodRequestState.Waiting && state == FoodRequestState.Preparing) ||

            (request.State == FoodRequestState.Waiting && state == FoodRequestState.Deliviring) ||
            (request.State == FoodRequestState.Deliviring && state == FoodRequestState.Waiting) ||

            (request.State == FoodRequestState.Deliviring && state == FoodRequestState.Received)
            )
            {
                request.State = state;
                await _foodRequestRepository.Update(request);

                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.OK,
                    Message = "State was changed",
                    Data = true
                };
            }
            else
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Can't change to this state from previous state",
                    Data = false
                };
            }
        }
        catch (Exception e)
        {
            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = "ChangeStateFoodRequest error: " + e.Message,
                Data = false
            };
        }
    }

    public async Task<BaseResponse<bool>> AddToInvitedList(FoodRequest request, Organization invitedOrganization)
    {
        try
        {
            if (request.State != FoodRequestState.NotAssing)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Can't edit request in this state",
                    Data = false
                };
            }

            if (request.CreatorOrganizationId == invitedOrganization.Id)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Can't add creator organization",
                    Data = false
                };
            }

            var invitation = new InvitedOrganization
            {
                Organization = invitedOrganization
            };
            request.InvitedOrganizations.Add(invitation);
            await _foodRequestRepository.Update(request);

            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.OK,
                Message = "Organization is invited",
                Data = true
            };
        }
        catch (Exception e)
        {
            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = "CreateFoodRequest error: " + e.Message,
                Data = false
            };
        }
    }

    public async Task<BaseResponse<bool>> RemoveFromInvitedList(FoodRequest request, Organization invitedOrganization)
    {
        try
        {
            if (request.State != FoodRequestState.NotAssing)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Can't edit request in this state",
                    Data = false
                };
            }

            var invitation = request.InvitedOrganizations.Find(i => i.Organization?.Id == invitedOrganization.Id);

            if (invitation == null)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "Organization not found in invited list",
                    Data = false
                };
            }

            request.InvitedOrganizations.Remove(invitation);
            await _foodRequestRepository.Update(request);

            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.OK,
                Message = "Organization is removed from invited list",
                Data = true
            };
        }
        catch (Exception e)
        {
            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = "RemoveFromInvitedList error: " + e.Message,
                Data = false
            };
        }
    }

    public async Task<BaseResponse<bool>> AssignInvited(FoodRequest request, Organization creatorOrganization, Organization invitedOrganization)
    {
        try
        {
            if (request.State != FoodRequestState.NotAssing)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Request is already assigned",
                    Data = false
                };
            }
            
            if (creatorOrganization.Type == invitedOrganization.Type)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Error: Identical organization types",
                    Data = false
                };
            }

            var invitation = request.InvitedOrganizations.Find(i => i.Organization?.Id == invitedOrganization.Id);

            if (invitation == null)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "Organization not found in invited list",
                    Data = false
                };
            }

            request.AcceptorOrganizationId = invitedOrganization.Id;
            request.State = FoodRequestState.Preparing;

            // Block products for listing
            request.Products.ForEach(p => p.State = ProductState.Blocked);

            await _foodRequestRepository.Update(request);

            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.OK,
                Message = "Organization is assigned to food request",
                Data = true
            };
        }
        catch (Exception e)
        {
            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = "AcceptInvited error: " + e.Message,
                Data = false
            };
        }
    }

    public async Task<BaseResponse<bool>> UnassignInvited(FoodRequest request, Organization creatorOrganization, Organization invitedOrganization)
    {
        try
        {
            if (request.State != FoodRequestState.Preparing)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Cannot unassign in this state",
                    Data = false
                };
            }

            if (request.AcceptorOrganizationId != invitedOrganization.Id)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Error: not an assigned organization",
                    Data = false
                };
            }

            var invitation = request.InvitedOrganizations.Find(i => i.Organization?.Id == invitedOrganization.Id);

            if (invitation != null)
            {
                request.InvitedOrganizations.Remove(invitation);
            }

            request.AcceptorOrganizationId = Guid.Empty;
            request.State = FoodRequestState.NotAssing;


            // Unblock products for listing
            request.Products.ForEach(p => p.State = ProductState.Available);

            await _foodRequestRepository.Update(request);

            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.OK,
                Message = "Organization is unassigned from food request",
                Data = true
            };
        }
        catch (Exception e)
        {
            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = "RemoveInvited error: " + e.Message,
                Data = false
            };
        }
    }

    public async Task<BaseResponse<bool>> CreateFoodRequest(FoodRequest request, Organization organization)
    {
        try
        {
            if (!organization.Users.Any(u => u.Id == request.UserId))
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "User not in organization",
                    Data = false
                };
            }

            if (!request.Products.All(p => organization.Products.Contains(p)))
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Some products not exist in your Organization",
                    Data = false
                };
            }

            request.CreatorOrganizationId = organization.Id;

            await _organizationRepository.Update(organization);

            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.OK,
                Message = "FoodRequest created successfuly",
                Data = true
            };
        }
        catch (Exception e)
        {
            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = "CreateFoodRequest error: " + e.Message,
                Data = false
            };
        }
    }

    public async Task<BaseResponse<bool>> DeleteFoodRequests(Guid id)
    {
        try
        {
            var getFoodRequestResponse = await GetFoodRequestById(id);
            var foodRequest = getFoodRequestResponse.Data;
            if (getFoodRequestResponse.StatusCode != HttpStatusCode.OK)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = getFoodRequestResponse.StatusCode,
                    Message = getFoodRequestResponse.Message,
                    Data = false
                };
            }

            await _organizationRepository.Delete(id);

            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.OK,
                Message = "FoodRequest was succesfuly deleted",
                Data = true
            };
        }
        catch (Exception e)
        {
            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = "DeleteFoodRequest error: " + e.Message,
                Data = false
            };
        }
    }

    public async Task<BaseResponse<IEnumerable<FoodRequest>>> GetAllFoodRequests()
    {
        try
        {
            var foodRequests = await _foodRequestRepository.GetAll()
                .Include(f => f.Products)
                .Include(f => f.InvitedOrganizations)
                .ToListAsync();

            return new BaseResponse<IEnumerable<FoodRequest>>
            {
                StatusCode = HttpStatusCode.OK,
                Message = "FoodRequests are listed successfuly",
                Data = foodRequests
            };
        }
        catch (Exception e)
        {
            return new BaseResponse<IEnumerable<FoodRequest>>
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = "GetAllFoodRequests error: " + e.Message,
                Data = null
            };
        }
    }

    public async Task<BaseResponse<IEnumerable<FoodRequest>>> GetAllFoodRequestsByOrganization(Guid organizationId)
    {
        try
        {
            var foodRequests = await _foodRequestRepository.GetAll()
                .Include(f => f.Products)
                .Include(f => f.InvitedOrganizations)
                .Where(f => f.CreatorOrganizationId == organizationId || f.AcceptorOrganizationId == organizationId)
                .ToListAsync();

            return new BaseResponse<IEnumerable<FoodRequest>>
            {
                StatusCode = HttpStatusCode.OK,
                Message = "FoodRequests are listed successfuly",
                Data = foodRequests
            };
        }
        catch (Exception e)
        {
            return new BaseResponse<IEnumerable<FoodRequest>>
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = "GetAllFoodRequestsByOrganization error: " + e.Message,
                Data = null
            };
        }
    }

    // TODO
    public async Task<BaseResponse<IEnumerable<FoodRequest>>> GetAllFoodRequestsByUser(string userId)
    {
        throw new NotImplementedException();
    }

    public async Task<BaseResponse<FoodRequest>> GetFoodRequestById(Guid id)
    {
        try
        {
            var foodRequest = await _foodRequestRepository.GetAll()
                .Include(f => f.Products)
                .Include(f => f.InvitedOrganizations)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (foodRequest == null)
            {
                return new BaseResponse<FoodRequest>
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "FoodRequest not found",
                    Data = null
                };
            }

            return new BaseResponse<FoodRequest>
            {
                StatusCode = HttpStatusCode.OK,
                Message = "FoodRequest is found successfuly",
                Data = foodRequest
            };
        }
        catch (Exception e)
        {
            return new BaseResponse<FoodRequest>
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = "GetFoodRequestById error: " + e.Message,
                Data = null
            };
        }
    }

    // TODO
    public async Task<BaseResponse<FoodRequest>> GetFoodRequestByTitle(string title)
    {
        throw new NotImplementedException();
    }

    public async Task<BaseResponse<bool>> UpdateFoodRequest(FoodRequest request)
    {
        try
        {
            if (request.State != FoodRequestState.NotAssing)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Can't edit request in this state",
                    Data = false
                };
            }

            await _foodRequestRepository.Update(request);

            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.OK,
                Message = "FoodRequest was succesfuly updated",
                Data = true
            };
        }
        catch (Exception e)
        {
            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = "UpdateFoodRequest error: " + e.Message,
                Data = false
            };
        }
    }
}