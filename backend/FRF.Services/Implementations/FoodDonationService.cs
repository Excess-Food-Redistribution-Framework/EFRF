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

public class FoodDonationService : IFoodDonationService
{
    private readonly IBaseRepository<FoodDonation> _foodDonationRepository;
    private readonly IBaseRepository<Product> _productRepository;
    public FoodDonationService(IBaseRepository<FoodDonation> foodDonationRepository, ProductService productService, IBaseRepository<Product> productRepository)
    {
        _foodDonationRepository = foodDonationRepository;
        _productRepository = productRepository;
    }

    public async Task AddFoodDonation(FoodDonation foodDonation)
    {
        await _foodDonationRepository.Add(foodDonation);
    }

    public async Task DeleteFoodDonation(Guid id)
    {
        await _foodDonationRepository.Delete(id);
    }

    public async Task<IEnumerable<FoodDonation>> GetAllFoodDonations()
    {
        var allFoodDonations = await _foodDonationRepository.GetAll().Include(d => d.Products).ToListAsync();
        var now = DateTime.Now;

        foreach (var donation in allFoodDonations)
        {
            donation.Products.RemoveAll(product => product.ExpirationDate < now);
        }

        return allFoodDonations;
    }

    public async Task<FoodDonation> GetFoodDonationByTitle(string title)
    {
        var foodDonation = await _foodDonationRepository.GetAll().FirstOrDefaultAsync(p => p.Title == title);
        if (foodDonation == null)
        {
            throw new Exception("Product not found");
        }
        return foodDonation;
    }

    public async Task<FoodDonation> GetFoodDonationById(Guid id)
    {
        var foodDonation = await _foodDonationRepository.GetById(id);
        if (foodDonation is null)
        {
            throw new Exception("Product not found");
        }
        return foodDonation;
    }

    public async Task UpdateFoodDonation(FoodDonation foodDonation)
    {
        await _foodDonationRepository.Update(foodDonation);
    }

}