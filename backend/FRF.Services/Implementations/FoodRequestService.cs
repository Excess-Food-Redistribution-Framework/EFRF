using FRF.DAL.Interfaces;
using FRF.DAL.Repositories;
using FRF.Domain.Entities;
using FRF.Domain.Enum;
using FRF.Domain.Exceptions;
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
    private readonly IBaseRepository<ProductPick> _productPickRepository;
    private readonly IBaseRepository<Organization> _organizationRepository;
    public FoodRequestService(IBaseRepository<FoodRequest> foodRequestRepository, IBaseRepository<ProductPick> productPickRepository, IBaseRepository<Organization> organizationRepository)
    {
        _foodRequestRepository = foodRequestRepository;
        _productPickRepository = productPickRepository;
        _organizationRepository = organizationRepository;
    }

    public async Task<bool> ChangeStateFoodRequest(FoodRequestState state, FoodRequest request, Organization organization)
    {
        try
        {
            if (organization.Id != request.ProviderId && organization.Id != request.DistributorId)
            {
                throw new NotFoundApiException("No such organization in food request");
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
                request.State = state;
                await _foodRequestRepository.Update(request);

                if (state == FoodRequestState.Received)
                {
                    var provider = await _organizationRepository.GetById(request.ProviderId);
                    if (provider == null)
                    {
                        throw new NotFoundApiException("Provider not found");
                    }
                    provider.Coins.Add(new Coin());
                    await _organizationRepository.Update(provider);
                }

                return true;
            }
            else
            {
                throw new BadRequestApiException("Can't change to this state");
            }
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
            throw new InternalServerErrorApiException("ChangeStateFoodRequest error: ", e);
        }
    }

    public async Task<bool> CreateFoodRequest(FoodRequest request, Organization provider, Organization distributor)
    {
        try
        {
            if (provider.Type != OrganizationType.Provider || distributor.Type != OrganizationType.Distributor)
            {
                throw new BadRequestApiException("Incorrect organization types");
            }

            if (!request.ProductPicks.All(p => provider.Products.Contains(p.Product)))
            {
                throw new BadRequestApiException("Some products not exist in provider list");
            }

            request.ProviderId = provider.Id;
            request.DistributorId = distributor.Id;

            await _foodRequestRepository.Add(request);

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
            throw new InternalServerErrorApiException("CreateFoodRequest error: ", e);
        }
    }

    public async Task<bool> UnPickFromProduct(FoodRequest request, Product product, Organization organization)
    {
        try
        {
            if (request.State != FoodRequestState.NotAccepted)
            {
                throw new BadRequestApiException("Can't edit request in this state");
            }

            if (organization.Id != request.ProviderId && organization.Id != request.DistributorId)
            {
                throw new NotFoundApiException("No such organization in food request");
            }

            var provider = await _organizationRepository.GetById(request.ProviderId);
            if (provider == null)
            {
                throw new NotFoundApiException("Provider not found");
            }

            if (!provider.Products.Contains(product))
            {
                throw new NotFoundApiException("No such product in provider list");
            }

            var pick = request.ProductPicks.FirstOrDefault(pp => pp.Product == product);
            if (pick == null)
            {
                throw new NotFoundApiException("No such product pick in food request list");
            }

            request.ProductPicks.Remove(pick);
            product.AvailableQuantity += pick.Quantity;

            await _foodRequestRepository.Update(request);

            await _productPickRepository.Delete(pick.Id);

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
            throw new InternalServerErrorApiException("UnPickFromProduct error: ", e);
        }
    }

    public async Task<bool> PickFromProduct(FoodRequest request, Product product, Organization organization, int quantity)
    {
        try
        {
            if (request.State != FoodRequestState.NotAccepted)
            {
                throw new BadRequestApiException("Can't edit request in this state");
            }

            if (organization.Id != request.ProviderId && organization.Id != request.DistributorId)
            {
                throw new NotFoundApiException("No such organization in food request");
            }

            var provider = await _organizationRepository.GetById(request.ProviderId);
            if (provider == null)
            {
                throw new NotFoundApiException("Provider not found");
            }

            if (!provider.Products.Contains(product))
            {
                throw new NotFoundApiException("No such product in provider list");
            }

            if (quantity <= 0)
            {
                throw new BadRequestApiException("Bad quantity of product");
            }

            var pick = request.ProductPicks.FirstOrDefault(pp => pp.Product == product);
            if (pick == null)
            {
                if (quantity > product.AvailableQuantity)
                {
                    throw new BadRequestApiException("No quantity of product");
                }

                pick = new ProductPick
                {
                    Product = product,
                    Organization = organization,
                    Quantity = quantity
                };

                product.AvailableQuantity -= quantity;
                request.ProductPicks.Add(pick);
            }
            else
            {
                if (quantity > product.AvailableQuantity + pick.Quantity)
                {
                    throw new BadRequestApiException("No quantity of product");
                }

                product.AvailableQuantity += pick.Quantity - quantity;
                pick.Quantity = quantity;
            }

            await _foodRequestRepository.Update(request);

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
            throw new InternalServerErrorApiException("PickFromProduct error: ", e);
        }
    }

    public async Task<bool> UpdateFoodRequest(FoodRequest request, Organization organization)
    {
        try
        {
            if (organization.Id != request.ProviderId && organization.Id != request.DistributorId)
            {
                throw new NotFoundApiException("No such organization in food request");
            }

            if (request.State != FoodRequestState.NotAccepted)
            {
                throw new BadRequestApiException("Can't edit request in this state");
            }

            var provider = await _organizationRepository.GetById(request.ProviderId);
            if (provider == null)
            {
                throw new NotFoundApiException("Provider not found");
            }

            if (!request.ProductPicks.All(p => provider.Products.Contains(p.Product)))
            {
                throw new BadRequestApiException("Some products not exist in provider list");
            }

            await _foodRequestRepository.Update(request);

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
            throw new InternalServerErrorApiException("UpdateFoodRequest error: ", e);
        }
    }

    public async Task<bool> DeleteFoodRequests(Guid id, Organization organization)
    {
        try
        {
            var foodRequest = await GetFoodRequestById(id);

            if (foodRequest.State != FoodRequestState.NotAccepted)
            {
                throw new BadRequestApiException("Can't delete request in this state");
            }

            if (organization.Id != foodRequest.ProviderId && organization.Id != foodRequest.DistributorId)
            {
                throw new NotFoundApiException("No such organization in food request");
            }

            foreach (var productPick in foodRequest.ProductPicks)
            {
                var product = productPick.Product;
                product.AvailableQuantity += productPick.Quantity;

                await _productPickRepository.Delete(productPick.Id);
            }

            await _foodRequestRepository.Delete(foodRequest.Id);

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
            throw new InternalServerErrorApiException("DeleteFoodRequest error: ", e);
        }
    }

    public async Task<IEnumerable<FoodRequest>> GetAllFoodRequests()
    {
        try
        {
            var foodRequests = await _foodRequestRepository.GetAll()
                .Include(f => f.ProductPicks)
                    .ThenInclude(pp => pp.Product)
                .Include(f => f.ProductPicks)
                    .ThenInclude(pp => pp.Organization)
                .ToListAsync();

            return foodRequests;
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
            throw new InternalServerErrorApiException("GetAllFoodRequests error: ", e);
        }
    }

    public async Task<IEnumerable<FoodRequest>> GetAllFoodRequestsByOrganization(Guid organizationId)
    {
        try
        {
            var foodRequests = await _foodRequestRepository.GetAll()
                .Include(f => f.ProductPicks)
                    .ThenInclude(pp => pp.Product)
                .Include(f => f.ProductPicks)
                    .ThenInclude(pp => pp.Organization)
                .Where(f => f.ProviderId == organizationId || f.DistributorId == organizationId)
                .ToListAsync();

            return foodRequests;
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
            throw new InternalServerErrorApiException("GetAllFoodRequestsByOrganization error: ", e);
        }
    }

    // TODO
    public  Task<IEnumerable<FoodRequest>> GetAllFoodRequestsByUser(string userId)
    {
        throw new NotImplementedException();
    }

    public async Task<FoodRequest> GetFoodRequestById(Guid id)
    {
        try
        {
            var foodRequest = await _foodRequestRepository.GetAll()
                .Include(f => f.ProductPicks)
                    .ThenInclude(pp => pp.Product)
                .Include(f => f.ProductPicks)
                    .ThenInclude(pp => pp.Organization)
                .FirstOrDefaultAsync(f => f.Id == id);

            if (foodRequest == null)
            {
                throw new NotFoundApiException("Product not found");
            }

            return foodRequest;
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
            throw new InternalServerErrorApiException("GetFoodRequestById error: ", e);
        }
    }

    // TODO
    public  Task<FoodRequest> GetFoodRequestByTitle(string title)
    {
        throw new NotImplementedException();
    }
}