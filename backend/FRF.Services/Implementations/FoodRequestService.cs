using FRF.DAL.Interfaces;
using FRF.DAL.Repositories;
using FRF.Domain.Entities;
using FRF.Domain.Enum;
using FRF.Services.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics.CodeAnalysis;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

public class FoodRequestService : IFoodRequestService
{
    private readonly IBaseRepository<FoodRequest> _foodRequestRepository;
    private readonly IBaseRepository<Product> _productRepository;
    public FoodRequestService(IBaseRepository<FoodRequest> foodRequestRepository, IBaseRepository<Product> productRepository)
    {
        _foodRequestRepository = foodRequestRepository;
        _productRepository = productRepository;
    }

    public async Task AddFoodRequest(FoodRequest foodRequest)
    {
        await _foodRequestRepository.Add(foodRequest);
    }

    public async Task DeleteFoodRequest(Guid id)
    {
        await _foodRequestRepository.Delete(id);
    }

    public async Task<IEnumerable<FoodRequest>> GetAllFoodRequests()
    {
        var allFoodfoodRequests = await _foodRequestRepository.GetAll().Include(d => d.Products).ToListAsync();

        return allFoodfoodRequests;
    }

    public async Task<FoodRequest> GetFoodRequestByTitle(string title)
    {
        var foodRequest = await _foodRequestRepository.GetAll().FirstOrDefaultAsync(p => p.Title == title);
        if (foodRequest == null)
        {
            throw new Exception("FoodRequest not found");
        }
        return foodRequest;
    }

    public async Task<FoodRequest> GetFoodRequestById(Guid id)
    {
        var foodRequest = await _foodRequestRepository.GetById(id);
        if (foodRequest is null)
        {
            throw new Exception("FoodRequest not found");
        }
        return foodRequest;
    }

    public async Task UpdateFoodRequest(FoodRequest foodRequest)
    {
        await _foodRequestRepository.Update(foodRequest);
    }

}