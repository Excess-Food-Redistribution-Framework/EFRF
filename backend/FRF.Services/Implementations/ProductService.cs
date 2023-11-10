using FRF.DAL.Repositories;
using FRF.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using FRF.Services.Interfaces;
using FRF.DAL.Interfaces;
using FRF.Domain.Enum;
using FRF.Domain.Responses;
using System.Net;

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

    public async Task<BaseResponse<IEnumerable<Product>>> GetAllProducts()
    {
        try
        {
            var products = await _productRepository.GetAll()
                .ToListAsync();

            return new BaseResponse<IEnumerable<Product>>
            {
                StatusCode = HttpStatusCode.OK,
                Message = "Get all products - success",
                Data = products
            };
        }
        catch (Exception e)
        {
            return new BaseResponse<IEnumerable<Product>>
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = e.Message,
                Data = null
            };
        }
    }

    public async Task<BaseResponse<Product>> GetProductByType(ProductType type)
    {
        try
        {
            var product = await _productRepository.GetAll()
                .Where(p => p.State == ProductState.Available)
                .FirstOrDefaultAsync(p => p.Type == type);

            if (product == null)
            {
                return new BaseResponse<Product>
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "Product not found",
                    Data = null
                };
            }

            return new BaseResponse<Product>
            {
                StatusCode = HttpStatusCode.OK,
                Message = "Product found",
                Data = product
            };
        }
        catch (Exception e)
        {
            return new BaseResponse<Product>
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = e.Message,
                Data = null
            };
        }
    }

    public async Task<BaseResponse<Product>> GetProductById(Guid id)
    {
        try
        {
            var product = await _productRepository.GetById(id);

            if (product == null)
            {
                return new BaseResponse<Product>
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "Product not found",
                    Data = null
                };
            }

            return new BaseResponse<Product>
            {
                StatusCode = HttpStatusCode.OK,
                Message = "Product found",
                Data = product
            };
        }
        catch (Exception e)
        {
            return new BaseResponse<Product>
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = e.Message,
                Data = null
            };
        }
    }

    public async Task<BaseResponse<bool>> AddProduct(Product product, Organization? organization)
    {
        try
        {
            if (organization == null)
            {
                return new BaseResponse<bool>
                {
                    StatusCode = HttpStatusCode.NotFound,
                    Message = "Organization not found",
                    Data = false
                };
            }

            organization.Products.Add(product);
            await _organizationRepository.Update(organization);

            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.OK,
                Message = "Product added",
                Data = true
            };
        }
        catch (Exception e)
        {
            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = e.Message,
                Data = false
            };
        }
    }

    public async Task<BaseResponse<bool>> UpdateProduct(Product product)
    {
        try
        {
            await _productRepository.Update(product);

            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.OK,
                Message = "Product updated",
                Data = true
            };
        }
        catch (Exception e)
        {
            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = e.Message,
                Data = false
            };
        }
    }

    public async Task<BaseResponse<bool>> DeleteProduct(Guid id)
    {
        try
        {
            await _productRepository.Delete(id);

            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.OK,
                Message = "Product updated",
                Data = true
            };
        }
        catch (Exception e)
        {
            return new BaseResponse<bool>
            {
                StatusCode = HttpStatusCode.InternalServerError,
                Message = e.Message,
                Data = false
            };
        }
    }
}
