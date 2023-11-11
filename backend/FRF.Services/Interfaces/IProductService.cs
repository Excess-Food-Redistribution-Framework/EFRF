using FRF.Domain.Entities;
using FRF.Domain.Enum;
using FRF.Domain.Responses;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Services.Interfaces
{
    public interface IProductService
    {
        Task<BaseResponse<IEnumerable<Product>>> GetAllProducts();

        Task<BaseResponse<Product>> GetProductById(Guid productId);
        Task<BaseResponse<Product>> GetProductByType(ProductType name);

        Task<BaseResponse<bool>> AddProduct(Product product, Organization? organization);
        Task<BaseResponse<bool>> UpdateProduct(Product product);
        Task<BaseResponse<bool>> DeleteProduct(Guid productId);
    }
}
