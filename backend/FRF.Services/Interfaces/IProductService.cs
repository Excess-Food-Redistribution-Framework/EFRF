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
        Task<Product> GetProductById(Guid id);
        Task<Product> GetProductByType(ProductType name);
        Task AddProduct(Product product);
        Task UpdateProduct(Product product);
        Task DeleteProduct(Guid id);
    }
}
