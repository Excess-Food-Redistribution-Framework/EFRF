using FRF.DAL.Repositories;
using FRF.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FRF.Services.Interfaces;
using FRF.DAL.Interfaces;
using FRF.Domain.Enum;
using System.Net;
using FRF.Domain.Exceptions;

public class ProductService : IProductService
{
    // Sercice uses repositories to work with datas
    private readonly IBaseRepository<Product> _productRepository;
    private readonly IBaseRepository<Organization> _organizationRepository;


    // Dependency Injection (DI).
    public ProductService(
        IBaseRepository<Product> productRepository,
        IBaseRepository<Organization> organizationRepository
        )
    {
        _productRepository = productRepository;
        _organizationRepository = organizationRepository;
    }

    public async Task<IEnumerable<Product>> GetAllProducts()
    {
        try
        {
            var products = await _productRepository.GetAll()
                .ToListAsync();

            return products;
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
            throw new InternalServerErrorApiException("GetAllProducts error", e);
        }
    }

    public async Task<Product> GetProductById(Guid id)
    {
        try
        {
            var product = await _productRepository.GetById(id);

            if (product == null)
            {
                throw new NotFoundApiException("Product not found");
            }

            return product;
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
            throw new InternalServerErrorApiException("GetProductById error", e);
        }
    }

    public async Task<bool> AddProduct(Product product, Organization? organization)
    {
        try
        {
            if (organization == null)
            {
                throw new NotFoundApiException("Organization not found");
            }

            organization.Products.Add(product);
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
            throw new InternalServerErrorApiException("AddProduct error", e);
        }
    }

    public async Task<bool> UpdateProduct(Product product)
    {
        try
        {
            await _productRepository.Update(product);

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
            throw new InternalServerErrorApiException("UpdateProduct error", e);
        }
    }

    public async Task<bool> DeleteProduct(Guid id)
    {
        try
        {
            await _productRepository.Delete(id);

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
            throw new InternalServerErrorApiException("DeleteProduct error", e);
        }
    }
}
