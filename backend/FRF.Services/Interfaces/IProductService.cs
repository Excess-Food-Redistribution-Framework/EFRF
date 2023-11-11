using FRF.Domain.Entities;
using FRF.Domain.Enum;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace FRF.Services.Interfaces
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllProducts();

        Task<Product> GetProductById(Guid productId);

        Task<bool> AddProduct(Product product, Organization? organization);
        Task<bool> UpdateProduct(Product product);
        Task<bool> DeleteProduct(Guid productId);
    }
}
