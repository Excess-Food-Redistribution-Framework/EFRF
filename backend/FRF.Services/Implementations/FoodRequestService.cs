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

    public async Task<BaseResponse<bool>> ChangeStateFoodRequest(FoodRequestState state, FoodRequest request, Organization organization)
    {
        try
        {
            if (organization.Id != request.ProviderId && organization.Id != request.DistributorId)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "No such organization in food request",
                    Data = false
                };
            }

            if (
            (request.State == FoodRequestState.NotAccepted && state == FoodRequestState.Preparing && organization.Type == OrganizationType.Provider) ||
            (request.State == FoodRequestState.Preparing && state == FoodRequestState.NotAccepted && organization.Type == OrganizationType.Provider) ||

            (request.State == FoodRequestState.Preparing && state == FoodRequestState.Waiting && organization.Type == OrganizationType.Provider) ||
            (request.State == FoodRequestState.Waiting && state == FoodRequestState.Preparing && organization.Type == OrganizationType.Provider) ||

            (request.State == FoodRequestState.Waiting && state == FoodRequestState.Deliviring && organization.Type == OrganizationType.Provider) ||
            (request.State == FoodRequestState.Deliviring && state == FoodRequestState.Waiting && organization.Type == OrganizationType.Provider) ||

            (request.State == FoodRequestState.Deliviring && state == FoodRequestState.Received && organization.Type == OrganizationType.Distributor)
            )
            {
                if (request.State == FoodRequestState.NotAccepted && state == FoodRequestState.Preparing)
                {
                    request.Products.ForEach(p => p.State = ProductState.Blocked);
                }

                if (request.State == FoodRequestState.Preparing && state == FoodRequestState.NotAccepted)
                {
                    request.Products.ForEach(p => p.State = ProductState.Available);
                }

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
                    Message = "Can't change to this state",
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

    public async Task<BaseResponse<bool>> CreateFoodRequest(FoodRequest request, Organization provider, Organization distributor)
    {
        try
        {
            if (provider.Type != OrganizationType.Provider || distributor.Type != OrganizationType.Distributor)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Incorrect organization types",
                    Data = false
                };
            }

            if (!request.Products.All(p => provider.Products.Contains(p)))
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Some products not exist in provider list",
                    Data = false
                };
            }

            request.ProviderId = provider.Id;
            request.DistributorId = distributor.Id;

            await _foodRequestRepository.Update(request);

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

    public async Task<BaseResponse<bool>> UpdateFoodRequest(FoodRequest request, Organization organization)
    {
        try
        {
            if (organization.Id != request.ProviderId && organization.Id != request.DistributorId)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "No such organization in food request",
                    Data = false
                };
            }

            if (request.State != FoodRequestState.NotAccepted)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Can't edit request in this state",
                    Data = false
                };
            }

            var provider = await _organizationRepository.GetById(request.ProviderId);
            if (provider == null)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "Provider not found",
                    Data = false
                };
            }

            if (!request.Products.All(p => provider.Products.Contains(p)))
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Some products not exist in provider list",
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

    public async Task<BaseResponse<bool>> DeleteFoodRequests(Guid id, Organization organization)
    {
        try
        {
            var getFoodRequestResponse = await GetFoodRequestById(id);
            var foodRequest = getFoodRequestResponse.Data;

            if (foodRequest == null)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = getFoodRequestResponse.StatusCode,
                    Message = getFoodRequestResponse.Message,
                    Data = false
                };
            }

            if (foodRequest.State != FoodRequestState.NotAccepted)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Can't delete request in this state",
                    Data = false
                };
            }

            if (organization.Id != foodRequest.ProviderId && organization.Id != foodRequest.DistributorId)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "No such organization in food request",
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
                .Where(f => f.ProviderId == organizationId || f.DistributorId == organizationId)
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
}