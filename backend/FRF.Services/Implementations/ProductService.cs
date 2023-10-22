using FRF.DAL.Repositories;
using FRF.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FRF.Services.Interfaces;
using FRF.DAL.Interfaces;
using FRF.Domain.Enum;

public class ProductService : IProductService
{
    // Sercice uses repositories to work with datas
    private readonly IBaseRepository<Product> _productRepository;

    // Dependency Injection (DI).
    public ProductService(IBaseRepository<Product> productRepository)
    {
        _productRepository = productRepository;
    }

    public async Task<IEnumerable<Product>> GetAllProducts()
    {
        var now = DateTime.Now;
        var allProducts = await _productRepository.GetAll().ToListAsync();

        var expiredProduct = allProducts.Where(d => d.ExpirationDate < now).ToList();

        foreach (var product in expiredProduct)
        {
            await DeleteProduct(product.Id);
        }
        return await _productRepository.GetAll().ToListAsync();
    }

    public async Task<Product> GetProductByType(ProductType type)
    {
        var product = await _productRepository.GetAll().FirstOrDefaultAsync(p => p.Type == type);
        if (product == null)
        {
            throw new Exception("Product not found");
        }
        return product;
    }

    public async Task<Product> GetProductById(Guid id)
    {
        var product = await _productRepository.GetById(id);
        if (product is null)
        {
            throw new Exception("Product not found");
        }
        return product;
    }

    public async Task AddProduct(Product product)
    {
        await _productRepository.Add(product);
    }

    public async Task UpdateProduct(Product product)
    {
        await _productRepository.Update(product);
    }

    public async Task DeleteProduct(Guid id)
    {
        await _productRepository.Delete(id);
    }
}
